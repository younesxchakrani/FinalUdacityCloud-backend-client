import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateToDo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const todoId = event.pathParameters.todoId
    const theUserId = getUserId(event)
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    /*
    if (event.requestContext.httpMethod === "OPTIONS") {
      return response;
    } // Handle the "OPTIONS" method
    */

    const toDoItemResponse = await updateToDo(
      todoId, 
      theUserId, 
      updatedTodo
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Content-Type": "*/*",
        "Accept": "*/*",
      },
      body: JSON.stringify(toDoItemResponse),
    }

  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )

/*
async function updateToDo(todoId: string, userId: string, todoUpdate: UpdateTodoRequest): Promise<TodoUpdate> {
  const params = {
    TableName: this.todosTable,
    Key: {
        "userId": userId,
        "todoId": todoId
    },
    UpdateExpression: "set name = :name, dueDate = :dueDate, done = :done",
    ExpressionAttributeValues: {
        ":name": todoUpdate['name'],
        ":dueDate": todoUpdate['dueDate'],
        ":done": todoUpdate['done']
    },
    ReturnValues: "UPDATED_NEW"
  };

  const result = await this.docClient.update(params).promise();
  const attributes = result.Attributes;
  return attributes as TodoUpdate;

}
*/
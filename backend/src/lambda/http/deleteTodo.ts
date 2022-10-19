import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteToDo } from '../../helpers/todos'
import { getUserId } from '../utils'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const theUserId = getUserId(event)
    // TODO: Remove a TODO item by id


    const deletedToDo = await deleteToDo(theUserId, todoId);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          items: deletedToDo
        })
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
async function deleteToDo(userId: string, todoId: string): Promise<string> {
  const params = {
    TableName: this.todosTable,
    Key: {
        "userId": userId,
        "todoId": todoId
    },
  };

  const result = await this.docClient.delete(params).promise();

  return result as string;
}
*/
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createToDo } from '../../helpers/todos'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const theUserId = getUserId(event)
    

    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    const newTodos = await createToDo(newTodo, theUserId);
    // TODO: Implement creating a new TODO item

    return {
      statusCode:201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items: newTodos
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

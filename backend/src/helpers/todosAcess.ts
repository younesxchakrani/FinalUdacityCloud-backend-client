import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
//import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('todosAccess')

// TODO: Implement the dataLayer logic

export class todosAccess{
    constructor(
        private readonly docClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) 
    {

    }

    async getToDos(userId:string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
          TableName: this.todosTable,
          KeyConditionExpression: '#userId = :userId',
          ExpressionAttributeNames: {
            "#userId": "userId",
        },
          ExpressionAttributeValues: {
            ':userId': userId
          },
          //ScanIndexForward: false
        }).promise()

        logger.info('get Todos for a user ', {
            key: userId
        })
      
        return result.Items 
    }
    
    async createToDo(todoItem: TodoItem): Promise<TodoItem> {

        const params = {
            TableName: this.todosTable,
            Item: todoItem,
        };

        await this.docClient.put(params).promise();

        logger.info('create Todos ', {
            key: todoItem
        })

        return todoItem as TodoItem;
    }

    async updateToDo(todoId: string, userId: string, todoUpdate: UpdateTodoRequest): Promise<TodoUpdate> {

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

        logger.info('update Todos', {
            key: todoId
        })

        return attributes as TodoUpdate;
    }

    async deleteToDo(userId: string, todoId: string): Promise<string> {
        const params = {
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        };
        
        await this.docClient.delete(params).promise();
    
        logger.info('delete Todos', {
        key: todoId
        })

        return "" as string;
    }

}
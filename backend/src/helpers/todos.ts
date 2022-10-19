import { todosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic

const logger = createLogger('Todos')

const toDoAccess = new todosAccess();
const attachmentUtils = new AttachmentUtils();

export async function getTodosForUser(userId: string): Promise<TodoItem[]>{
    logger.info('prepare: get Todos for a user ', {
        key: userId
    })
    return toDoAccess.getToDos(userId);
}

export async function createToDo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    
    const todosId = uuid.v4()
    const newDate = new Date().getTime().toString()
    const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;

    const newTodos = {
        userId: userId,
        todoId: todosId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todosId}`, 
        createdAt: newDate,
        done: false,
        ...createTodoRequest,
    }

    logger.info('prepare : create Todos ', {
        key: todosId
    })

    return toDoAccess.createToDo(newTodos);
}

export async function updateToDo(todoId: string, userId: string, todoUpdate: UpdateTodoRequest): Promise<TodoUpdate> {
    
    logger.info('prepare : update Todos', {
        key: todoId
    })

    return toDoAccess.updateToDo(todoId, userId, todoUpdate);
}

export async function deleteToDo(userId: string, todoId: string): Promise<string> {
    
    logger.info('prepare : delete Todos', {
        key: todoId
    })

    return toDoAccess.deleteToDo(userId, todoId);
}

export async function createAttachmentPresignedUrl(todoId: string): Promise<string> {
    
    logger.info('prepare : create presigned url', {
        key: todoId
    })

    return attachmentUtils.createAttachmentPresignedUrl(todoId);
}
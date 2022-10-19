import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)


// TODO: Implement the fileStogare logic

export class AttachmentUtils{
    constructor(
        private readonly s3Client = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly s3BucketName = process.env.ATTACHMENT_S3_BUCKET) 
    {

    }

    async createAttachmentPresignedUrl(todoId: string): Promise<string> {
        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: 3000,
        });
        

        return url as string;
    }

}
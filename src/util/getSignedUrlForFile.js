import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const config = {
    region: process.env.REGION
};

export const GetSignedUrlForFile = async ({ bucket, fileName, operation = 'put' }) => {

    const objectParams = {
        Bucket: bucket,
        Key: fileName,
        ContentType: 'image/jpeg'
    }

    // console.log('url params', objectParams)

    const s3Client = new S3Client(config);
    const command = operation === 'get' ? new GetObjectCommand(objectParams) : new PutObjectCommand(objectParams);
    return await getSignedUrl(s3Client, command, { expiresIn: 15 }); // expires in 15 seconds minimize blast radius
    // return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // expires in 15 seconds minimize blast radius
}

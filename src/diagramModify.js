import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";
import s3 from "./util/s3";
import { v4 as uuidv4 } from 'uuid';
import { GetSignedUrlForFile } from "./util/getSignedUrlForFile";

export const main = handler(async (event) => {

    let id = null

    try {
        if (event.pathParameters && event.pathParameters.id) {
            id = event.pathParameters.id
        }
    }
    catch (err) {
        console.log(err.message)
        throw new Error("Could not parse input!");
    }

    let data

    try {
        data = JSON.parse(event.body)
    }
    catch (err) {
        console.log(err)
        throw new Error('Could not parse document body!')
    }

    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            nameGroup: 'camelot',
            diagramId: id
        }
    }

    // store reference
    let diagram
    try {
        diagram = await dynamoDb.get(params)
    }
    catch (err) {
        console.log(err)
        throw new Error('Diagram not found!')
    }

    const s3params = {
        Bucket: process.env.BUCKET_NAME,
        Key: diagram.objectKey,
        Body: JSON.stringify(data.drawing),
        ContentType: 'application/json'
    }

    // store diagram
    console.log('Before putting dialog object', process.env.BUCKET_NAME, s3params)
    await s3.putObject(s3params)

    console.log('After putting all objects')

    const url = await GetSignedUrlForFile({ bucket: process.env.THUMBS_BUCKET, fileName: diagram.thumbNail })

    console.log('The Url', url)

    return {
        url
    }

});
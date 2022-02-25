import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";
import s3 from "./util/s3";
import { uuid } from 'uuidv4'

export const main = handler(async (event) => {

    let id = null

    if (event.pathParameters && event.pathParameters.id) {
        id = event.pathParameters.id
    }

    if (!id) {
        throw new Error('ID path parameter required .../diagrams/{id}')
    }

    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            "diagramId": { "S": id }
        }
    };

    const row = await dynamoDb.getItem(params)

    if (!row) {
        throw new Error('Diagram not found!')
    }

    console.log(JSON.stringify(row))

    const s3Params = {
        Bucket: process.env.BUCKET_NAME,
        Key: row.objectKey
    }

    const diagram = await s3.getObject(s3Params)

    console.log('The document', diagram.body)

    return {
        diagramId: row.diagramId,
        diagramName: row.diagramName,
        description: row.description,
        version: row.version,
        diagram: diagram.Body
    }

});
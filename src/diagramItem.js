import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";
import s3 from "./util/s3";

export const main = handler(async (event) => {

    let id = null

    if (event.pathParameters && event.pathParameters.id) {
        id = event.pathParameters.id
    }

    // console.log('The ID', id)

    if (!id) {
        throw new Error('ID path parameter required .../diagrams/{id}')
    }

    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            nameGroup: 'camelot',
            diagramId: id
        },
        ProjectionExpression: "diagramId, diagramName, description, version, objectKey"
    };

    const row = await dynamoDb.get(params)

    if (!row) {
        throw new Error('Diagram not found!')
    }

    // console.log('Found Diagram', JSON.stringify(row))``

    const s3Params = {
        Bucket: process.env.BUCKET_NAME,
        Key: row.Item.objectKey
    }

    // console.log('The Params', s3Params)

    const diagram = await s3.getObject(s3Params)

    // console.log('The document', diagram.body)

    return {
        diagramId: row.Item.diagramId,
        diagramName: row.Item.diagramName,
        diagramDesc: row.Item.description,
        version: row.Item.version,
        drawing: diagram.Body
    }

});
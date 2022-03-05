import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";
import s3 from "./util/s3";

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

    if (!id) {
        throw new Error('Id of diagram to remove required!')
    }

    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            nameGroup: 'camelot',
            diagramId: id
        },
        ProjectionExpression: "diagramId, objectKey, thumbNail"
    };

    const row = await dynamoDb.get(params)

    if (!row) {
        throw new Error('Diagram not found!')
    }

    params.Exists = true

    try {
        await dynamoDb.delete(params)
    }
    catch (err) {
        throw new Error('Could not delete diagram!', `diagramId: ${id}`, err)
    }

    var s3params = {
        Bucket: process.env.BUCKET_NAME,
        Key: row.Item.objectKey
    };

    try {
        await s3.deleteObject(s3params)
    }
    catch (err) {
        console.log('Could not delete diagram object', `bucket: ${process.env.BUCKET_NAME}, objectKey: ${row.Item.objectKey}`, err)
    }


    s3params.Bucket = process.env.THUMBS_BUCKET
    s3params.Key = row.Item.thumbNail

    try {
        await s3.deleteObject(s3params)
    }
    catch (err) {
        console.log('Could not delete thumb nail object', `bucket: ${process.env.THUMBS_BUCKET}, objectKey: ${row.Item.thumbNail}`, err)
    }


})

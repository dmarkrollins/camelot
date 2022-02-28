import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";

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
        Exists: true,
        Key: {
            nameGroup: 'camelot',
            diagramId: id
        }
    }

    return await dynamoDb.delete(params)

})

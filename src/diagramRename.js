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

    let data

    try {
        data = JSON.parse(event.body)
    }
    catch (err) {
        console.log(err)
        throw new Error('Could not parse document body!')
    }

    console.log('Data', data)

    try {
        const updParams = {
            TableName: process.env.TABLE_NAME,
            Key: {
                nameGroup: 'camelot',
                diagramId: id
            },
            UpdateExpression: "SET diagramName = :n, description = :d",
            ExpressionAttributeValues: {
                ":n": data.diagramName,
                ":d": data.diagramDesc
            }
        }
        return await dynamoDb.update(updParams)
    }
    catch (err) {
        console.log(err)
        throw new Error('Diagram not found!')
    }

})

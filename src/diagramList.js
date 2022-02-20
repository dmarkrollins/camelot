import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";

export const main = handler(async (event) => {

    const querystring = event.queryStringParameters;

    let searchVal = ''

    if (querystring && querystring.search) {
        searchVal = querystring.search
    }

    // ExpressionAttributeValues: {
    //     ':search': { S: searchVal }
    // },
    // KeyConditionExpression: 'begins_with ( diagramName, :search )'

    const params = {
        TableName: process.env.TABLE_NAME
    }

    const result = await dynamoDb.scan(params)

    if (result.Items) {

        return result.Items.sort((a, b) => (a.name > b.name) ? 1 : -1)
    }

    return []

});
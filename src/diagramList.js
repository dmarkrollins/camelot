import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";

export const main = handler(async (event) => {

    const querystring = event.queryStringParameters;

    let searchVal = ''

    if (querystring && querystring.search) {
        searchVal = querystring.search
    }

    console.log('Search Val', searchVal)

    // ExpressionAttributeValues: {
    //     ':search': { S: searchVal }
    // },
    // KeyConditionExpression: 'begins_with ( diagramName, :search )'

    // const params = {
    //     TableName: process.env.TABLE_NAME,
    //     Limit: 50,
    // }

    const params = {
        TableName: process.env.TABLE_NAME,
        IndexName: 'nameIndex',
        ConsistentRead: false,
        KeyConditionExpression: "#name_group = 'camelot' and begins_with(#diagram_name, :search)",
        ExpressionAttributeNames: {
            "#diagram_name": "diagramName",
            "#name_group": "nameGroup"
        },
        ExpressionAttributeValues: {
            ":search": searchVal
        },
        Limit: 50
    }

    const result = await dynamoDb.query(params)

    if (result.Items) {

        // return result.Items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        return result.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return []

});
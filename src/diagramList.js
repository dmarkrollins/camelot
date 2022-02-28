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

    // 

    const params = {
        TableName: process.env.TABLE_NAME,
        Limit: 50
    }

    // params.ExpressionAttributeNames = {
    //     "#diagram_name": "diagramName",
    //     "#name_group": "nameGroup"
    // }

    if (searchVal > '') {
        params.IndexName = 'nameIndex'
        params.ConsistentRead = false
        params.KeyConditionExpression = "nameGroup = :group and begins_with(searchName, :search)"
        params.ExpressionAttributeValues = {
            ":search": searchVal.toLowerCase(),
            ":group": 'camelot'
        }
    }
    else {
        params.IndexName = 'dateIndex'
        params.ConsistentRead = false
        params.KeyConditionExpression = "nameGroup = :group"
        params.ScanIndexForward = false // descending
        params.ExpressionAttributeValues = {
            ":group": 'camelot'
        }
    }

    const result = await dynamoDb.query(params)

    if (result.Items) {

        // return result.Items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        return result.Items //.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    }

    return []

});
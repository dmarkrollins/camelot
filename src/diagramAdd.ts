import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";
import s3 from "./util/s3";
import { v4 as uuidv4 } from 'uuid';

export const main = handler(async (event) => {

    let data

    console.log('The Body', event.body)

    try {
        data = JSON.parse(event.body)
    }
    catch (err) {
        console.log(err.message)
        throw new Error("Could not parse body content!");
    }

    const diagramId = uuidv4()
    const version = 10000
    const objectKey = `${process.env.STAGE}/${diagramId}.json`

    const d = new Date()

    const dbparams = {
        TableName: process.env.TABLE_NAME,
        Item: {
            diagramId,
            diagramName: data.name || 'A Diagram',
            dateVal: d.getTime(),
            description: data.description || '',
            createdAt: d.toISOString(),
            nameGroup: 'camelot',
            version,
            objectKey
        }

    }

    // store reference
    await dynamoDb.put(dbparams)

    const s3params = {
        Bucket: process.env.BUCKET_NAME,
        Key: objectKey,
        Body: JSON.stringify(data.drawing),
        ContentType: 'application/json'
    }

    console.log('Before putting object', process.env.BUCKET_NAME, s3params)

    // store diagram
    await s3.putObject(s3params)

    console.log('After putting object', process.env.BUCKET_NAME)

    const tagParams = {

        Bucket: process.env.BUCKET_NAME,
        Key: objectKey,
        Tagging: {
            TagSet: [
                {
                    Key: "diagramId",
                    Value: diagramId
                },
                {
                    Key: "version",
                    Value: `${version}`
                }
            ]
        }
    }

    // tag bucket with link back id
    await s3.putObjectTagging(tagParams)

    console.log('After setting tags', process.env.BUCKET_NAME)

});
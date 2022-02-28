import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";
import s3 from "./util/s3";
import { v4 as uuidv4 } from 'uuid';
import { GetSignedUrlForFile } from "./util/getSignedUrlForFile";

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
    const thumbNail = `${process.env.STAGE}/${diagramId}.jpg`

    const d = new Date()

    const name = data.name || 'A Diagram'

    const dbparams = {
        TableName: process.env.TABLE_NAME,
        Item: {
            diagramId,
            diagramName: name,
            searchName: name.toLowerCase(),
            dateVal: d.getTime(),
            description: data.description || '',
            createdAt: d.toISOString(),
            nameGroup: 'camelot',
            thumbNail,
            thumbsBucket: process.env.THUMBS_BUCKET,
            diagramBucket: process.env.BUCKET_NAME,
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

    // store diagram
    console.log('Before putting dialog object', process.env.BUCKET_NAME, s3params)
    await s3.putObject(s3params)

    console.log('After putting all objects')

    // const tagParams = {

    //     Bucket: process.env.BUCKET_NAME,
    //     Key: objectKey,
    //     Tagging: {
    //         TagSet: [
    //             {
    //                 Key: "diagramId",
    //                 Value: diagramId
    //             },
    //             {
    //                 Key: "version",
    //                 Value: `${version}`
    //             }
    //         ]
    //     }
    // }

    // // tag bucket with link back id
    // await s3.putObjectTagging(tagParams)

    // tagParams.Bucket = process.env.THUMBS_BUCKET

    // await s3.putObjectTagging(tagParams)

    // console.log('After setting tags')

    const url = await GetSignedUrlForFile({ bucket: process.env.THUMBS_BUCKET, fileName: thumbNail })

    console.log('The Url', url)

    return {
        url,
        diagramId,
        diagramName: name
    }

});
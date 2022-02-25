import AWS from "aws-sdk";

const client = new AWS.S3()

export default {
    formatKey: (name) => {
        name.replace(' ', '-')
    },
    putObject: (params) => client.putObject(params).promise(),
    getObject: (params) => client.getObject(params).promise(),
    getObjectList: (params) => client.getObjectList(params).promise(),
    putObjectTagging: (params) => client.putObjectTagging(params).promise()
};
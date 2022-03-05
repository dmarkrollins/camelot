import * as sst from "@serverless-stack/resources";
import { Table, TableFieldType } from "@serverless-stack/resources";
import { BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from 'aws-cdk-lib'
// import { Script } from "@serverless-stack/resources";

export default class StorageStack extends sst.Stack {
    table
    siteBucket
    diagramBucket
    thumbsBucket

    constructor(scope, id, props) {
        super(scope, id, props);

        // Create a Table
        this.table = new Table(this, "Diagrams2", {
            fields: {
                diagramId: TableFieldType.STRING,
                searchName: TableFieldType.STRING,
                dateVal: TableFieldType.NUMBER,
                nameGroup: TableFieldType.STRING
            },
            primaryIndex: { partitionKey: "nameGroup", sortKey: "diagramId" },
            localIndexes: {
                nameIndex: { sortKey: "searchName" },
                dateIndex: { sortKey: "dateVal" },
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY
        });

        // with CORS to support uploading from cross origin
        this.siteBucket = new sst.Bucket(this, "sitebucket", {
            s3Bucket: {
                cors: [
                    {
                        maxAge: 3000,
                        allowedOrigins: ["*"],
                        allowedHeaders: ["*"],
                        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"]
                    }
                ]
            }
        });

        // with CORS to support uploading from cross origin
        this.diagramBucket = new sst.Bucket(this, "diagrambucket", {
            s3Bucket: {
                versioned: true,
                cors: [
                    {
                        maxAge: 3000,
                        allowedOrigins: ["*"],
                        allowedHeaders: ["*"],
                        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"]
                    }
                ],

            }
        });

        this.thumbsBucket = new sst.Bucket(this, "thumbsbucket", {
            s3Bucket: {
                versioned: true,
                publicReadAccess: true,
                cors: [
                    {
                        maxAge: 3000,
                        allowedOrigins: ["*"],
                        allowedHeaders: ["*"],
                        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"]
                    }
                ],

            }
        });

    }
}
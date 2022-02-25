import * as sst from "@serverless-stack/resources";
import { Table, TableFieldType } from "@serverless-stack/resources";
import { BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from 'aws-cdk-lib'
// import { Script } from "@serverless-stack/resources";

export default class StorageStack extends sst.Stack {
    table
    siteBucket
    diagramBucket

    constructor(scope, id, props) {
        super(scope, id, props);

        // Create a Table
        this.table = new Table(this, "Diagrams", {
            fields: {
                diagramId: TableFieldType.STRING,
                diagramName: TableFieldType.STRING,
                dateVal: TableFieldType.NUMBER,
                nameGroup: TableFieldType.STRING
            },
            primaryIndex: { partitionKey: "nameGroup", sortKey: "dateVal" },
            localIndexes: {
                nameIndex: { sortKey: "diagramName" },
                idIndex: { sortKey: "diagramId" },
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY
        });

        // preload diagrams
        // new Script(this, "Script", {
        //     defaultFunctionProps: {
        //         environment: { tableName: this.table.tableName },
        //         permissions: [this.table],
        //     },
        //     onCreate: "src/seedDatabase.main",
        // });

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

    }
}
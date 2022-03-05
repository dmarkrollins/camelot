import * as sst from "@serverless-stack/resources";
// import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

export default class ApiStack extends sst.Stack {
    api;

    constructor(scope, id, props) {
        super(scope, id, props);

        const { bucket, table, stage, thumbs } = props;

        const params = {
            // defaultAuthorizationType: "AWS_IAM",
            defaultThrottlingRateLimit: 5,
            defaultThrottlingBurstLimit: 5,
            defaultFunctionProps: {
                environment: {
                    TABLE_NAME: table.tableName,
                    BUCKET_NAME: bucket.bucketName,
                    THUMBS_BUCKET: thumbs.bucketName,
                    THUMBS_BASE_URL: thumbs.url,
                    STAGE: stage
                },
            },
            defaultCorsPreflightOptions: {
                allowOrigins: ['"*"'],
            },
            routes: {
                "POST    /diagrams": "src/diagramAdd.main",
                "GET     /diagrams": "src/diagramList.main",
                "PUT     /diagrams/{id}": "src/diagramModify.main",
                "PUT     /rename/{id}": "src/diagramRename.main",
                "DELETE  /diagrams/{id}": "src/diagramRemove.main",
                "GET     /diagrams/{id}": "src/diagramItem.main"
            }
        }

        // if (this.stage === 'prod') {
        //     params.customDomain = {
        //         domainName: "bbm.6thcents.com",
        //         certificate: Certificate.fromCertificateArn(this, "bbm-cert", process.env.REACT_APP_CERT_ARN),
        //     }
        // }

        this.api = new sst.Api(this, "Api", params);

        this.api.attachPermissions([table, bucket, thumbs]);

        this.addOutputs({
            ApiEndpoint: this.api.url
        });
    }
}
import * as sst from "@serverless-stack/resources";
import * as cognito from "aws-cdk-lib/aws-cognito";

export default class ApiStack extends sst.Stack {
    auth

    constructor(scope, id, props) {
        super(scope, id, props);

        this.auth = new sst.Auth(this, "Auth", {
            cognito: {
                userPool: {
                    signInAliases: { email: true },
                    selfSignUpEnabled: false,
                    signInCaseSensitive: false,
                },
                userPoolClient: {
                    supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.COGNITO],
                    authFlows: { userPassword: true }
                }
            }
        })

        this.addOutputs({
            UserPoolId: this.auth.cognitoUserPool.userPoolId,
            UserPoolClientId: this.auth.cognitoUserPoolClient.userPoolClientId,
        });
    }
}

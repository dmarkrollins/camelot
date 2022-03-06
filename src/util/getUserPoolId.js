
export function GetUserPoolId(event) {
    const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
    const parts = authProvider.split(':');
    const userPoolIdParts = parts[parts.length - 3].split('/');

    const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
    const userPoolUserId = parts[parts.length - 1];

    return {
        poolId: userPoolId,
        userId: userPoolUserId
    }
}
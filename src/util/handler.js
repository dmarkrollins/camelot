export default function handler(lambda) {
    return async function (event, context) {
        let body, statusCode;

        try {
            // Run the Lambda
            body = await lambda(event, context);
            statusCode = 200;
        } catch (e) {
            console.error(e); // local during test - cloudwatch in prod
            body = { error: e.message };
            statusCode = 500;
        }

        // Return HTTP response with CORS support headers
        return {
            statusCode,
            body: JSON.stringify(body),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            }
        };
    };
}
const config = {
    // Backend config
    s3: {
        REGION: process.env.REACT_APP_REGION,
        BUCKET: process.env.REACT_APP_BUCKET
    },
    apiGateway: {
        REGION: process.env.REACT_APP_REGION,
        URL: process.env.REACT_APP_API_URL
    }
};

export default config;
import ApiStack from "./apiStack";
import StorageStack from "./storageStack";
import FrontendStack from "./frontendStack";
import AuthStack from "./authStack";

export default function main(app) {
    // Set default runtime for all functions
    app.setDefaultFunctionProps({
        runtime: 'nodejs14.x'
    });

    const storageStack = new StorageStack(app, 'storage')

    const apiStack = new ApiStack(app, 'api', {
        table: storageStack.table,
        bucket: storageStack.diagramBucket,
        thumbs: storageStack.thumbsBucket,
        stage: app.stage
    })


    const authStack = new AuthStack(app, 'auth', {
        api: apiStack.api
    })

    new FrontendStack(app, 'frontend', {
        api: apiStack.api,
        bucket: storageStack.siteBucket,
        thumbs: storageStack.thumbsBucket,
        auth: authStack.auth
    })
}

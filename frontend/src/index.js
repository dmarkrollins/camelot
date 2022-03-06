import React from 'react';
import ReactDOM from 'react-dom';
import 'foundation-sites/dist/css/foundation.min.css'
import 'animate.css'
import './index.css';
import './App.scss'
import App from './App';
import { Amplify } from 'aws-amplify'
import config from './config';
// import reportWebVitals from './reportWebVitals';
import 'foundation-sites'
import $ from 'jquery'
import { BrowserRouter } from "react-router-dom"

Amplify.configure({
    // Auth: {
    //     mandatorySignIn: true,
    //     region: config.cognito.REGION,
    //     userPoolId: config.cognito.USER_POOL_ID,
    //     identityPoolId: config.cognito.IDENTITY_POOL_ID,
    //     userPoolWebClientId: config.cognito.APP_CLIENT_ID
    // },
    Storage: {
        region: config.s3.REGION,
        bucket: config.s3.BUCKET
        // identityPoolId: config.cognito.IDENTITY_POOL_ID
    },
    API: {
        endpoints: [
            {
                name: "camelot",
                endpoint: config.apiGateway.URL,
                region: config.apiGateway.REGION
            },
        ]
    }
});

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>, document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

$(document).foundation();
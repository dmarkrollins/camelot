import React from 'react';
// import Navigation from './navigation'

import SignIn from './signIn'
import Navigation from './navigation'

const SignInWrapper = () => {

    const backgroundClass = () => {
        // const className = BBM.LocalStorage.get(BBM.Keys.BackgroundClass, 'default-background')
        // return `${className} react-target animate__animated animate__fadeIn`
        return `react-target animate__animated animate__fadeIn`
    }

    return (
        <div className={backgroundClass()}>
            <Navigation />
            <div className="verticalCenter camelot-dialog">
                <SignIn />
            </div>
        </div>
    )
}

export default SignInWrapper;
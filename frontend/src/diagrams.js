import React from 'react';
// import Navigation from './navigation'

import DiagramList from './diagramList'
import Navigation from './navigation'

const Diagrams = ({ signOut, user }) => {

    const backgroundClass = () => {
        // const className = BBM.LocalStorage.get(BBM.Keys.BackgroundClass, 'default-background')
        // return `${className} react-target animate__animated animate__fadeIn`
        return `react-target animate__animated animate__fadeIn`
    }

    return (
        <div className={backgroundClass()}>
            <Navigation signOut={signOut} user={user} />
            <div className="row">
                <div className="twelve columns text-center" style={{ minWidth: '300px' }}>
                    <DiagramList />
                </div>
            </div>
        </div>
    )
}

export default Diagrams;





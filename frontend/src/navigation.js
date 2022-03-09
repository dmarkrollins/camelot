/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Auth } from "aws-amplify";
import CamContext from './utils/camelotContext'
import { useNavigate } from "react-router-dom";


const Navigation = ({ signOut, user }) => {
    const context = useContext(CamContext)
    const navigate = useNavigate();

    const formatUser = (email) => {
        return email.split('@')[0]
    }

    return (

        <div className="grid-x" style={{ marginTop: '12px' }}>
            <div className="cell small-12 medium-10 large-6" style={{ margin: '0 auto', height: '45px', borderBottom: '1px solid #999' }}>

                <div style={{ padding: '7px', float: 'left' }}>
                    <img src="/logo.png" width="150" alt="" />
                </div>

                {/* <button type="button" style={{ marginRight: '12px', float: 'right', position: 'relative', top: '12px' }} ><GiHamburgerMenu style={{ fontSize: '1.5em', color: '#A55640' }} /></button> */}

                <button class="clear button primary float-right" onClick={signOut}>Sign out {formatUser(user.attributes.email)}</button>
                {/* } */}

            </div>
        </div >

    )
}

export default Navigation


import React, { useState, useContext } from "react";
import { Auth } from "aws-amplify";
import CamContext from './utils/camelotContext'
import { Oval } from 'react-loader-spinner'
import { useNavigate } from "react-router-dom";

export default function SignIn() {
    let oldPassword = ''
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const context = useContext(CamContext)
    const [isLoading, setIsLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('')
    const [showChallenge, setShowChallenge] = useState(false)
    const navigate = useNavigate();

    const emailChange = (event) => {
        setEmail(event.target.value)
    }

    const pwChange = (event) => {
        setPassword(event.target.value)
    }

    const newPwChange = (event) => {
        setNewPassword(event.target.value)
    }

    const handleSignIn = async (e) => {

        e.preventDefault();

        setErrMessage('')

        if (!email || !password) {
            setErrMessage('Email address and password required!')
            return
        }

        try {
            setIsLoading(true)
            const user = await Auth.signIn(email, password)
            const user2 = await Auth.currentAuthenticatedUser()
            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                oldPassword = password
                setShowChallenge(true)
            }
            else {
                context.hasAuthenticated(true)
                navigate('/diagrams')
            }
        } catch (e) {
            console.log(e)
            setErrMessage('User name not found or password is invalid!')
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleChallenge = async (e) => {

        e.preventDefault()

        try {
            setIsLoading(true)
            const user = await Auth.currentAuthenticatedUser()
            await Auth.changePassword(user, password, newPassword)
            context.hasAuthenticated(true)
            navigate('/diagrams')
        }
        catch (e) {
            setErrMessage(e)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid-container animate__animated animate__fadeIn">
            <div className="grid-x" >
                {isLoading ? <Oval
                    ariaLabel="loading-indicator"
                    height={100}
                    width={100}
                    strokeWidth={5}
                    color="#A55640"
                    secondaryColor="#efefef"
                    wrapperClass="spinner"
                /> : ''}
                <div className="camelot-dialog verticalCenter ">
                    <div className="grid-x ">
                        {showChallenge ?
                            <form>
                                <div className="cell small-12" >
                                    <h4>Change Password</h4>
                                </div>
                                <div className="cell small-12">
                                    <div className="grid-x">
                                        <div className="cell small-12 text-left" style={{ paddingRight: '7px' }}>
                                            <label>Email Address:</label>
                                        </div>
                                        <div className="cell small-12">
                                            <input id="email-address" style={{ width: '100%', padding: '5px', height: '38px', border: '1px solid #ccc' }} readOnly={true} maxLength="20" value={email} />
                                        </div>
                                    </div>
                                </div>
                                <div className="cell small-12">
                                    <div className="grid-x">
                                        <div className="cell small-12 text-left" style={{ paddingRight: '7px' }}>
                                            <label>Old Password:</label>
                                        </div>
                                        <div className="cell small-12">
                                            <input id="password" type="password" placeholder="Password" maxLength="20" onChange={pwChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="cell small-12">
                                    <div className="grid-x">
                                        <div className="cell small-12 text-left" style={{ paddingRight: '7px' }}>
                                            <label>New Password:</label>
                                        </div>
                                        <div className="cell small-12">
                                            <input id="newPassword" type="password" placeholder="Password" maxLength="20" onChange={newPwChange} />
                                        </div>
                                    </div>
                                </div>

                                <div id="errorMsg" style={{ minHeight: '0px', width: '100%', color: '#990000', textAlign: 'center', fontSize: '.8em' }}>
                                    {errMessage}
                                </div>

                                <div className="cell small-12 text-center save-button" style={{ marginTop: '7px' }}>
                                    <button id="btnNewPassword" type='button' onClick={handleChallenge}>Save New Password</button>
                                </div>
                            </form>

                            :
                            <form>
                                <div className="cell small-12" >
                                    <h4>Sign In</h4>
                                </div>
                                <div className="cell small-12">
                                    <div className="grid-x">
                                        <div className="cell small-12 text-left" style={{ paddingRight: '7px' }}>
                                            <label>Email Address:</label>
                                        </div>
                                        <div className="cell small-12">
                                            <input id="email-address" type="text" placeholder="Email Address" maxLength="20" onChange={emailChange} value={email} />
                                        </div>
                                    </div>
                                </div>
                                <div className="cell small-12">
                                    <div className="grid-x">
                                        <div className="cell small-12 text-left" style={{ paddingRight: '7px' }}>
                                            <label>Password:</label>
                                        </div>
                                        <div className="cell small-12">
                                            <input id="password" type="password" placeholder="Password" maxLength="20" onChange={pwChange} />
                                        </div>
                                    </div>
                                </div>

                                <div id="errorMsg" style={{ minHeight: '0px', width: '100%', color: '#990000', textAlign: 'center', fontSize: '.8em' }}>
                                    {errMessage}
                                </div>

                                <div className="cell small-12 text-center save-button" style={{ marginTop: '7px' }}>
                                    <button id="btnSignin" type='button' onClick={handleSignIn}>Sign In</button>
                                </div>
                            </form>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}
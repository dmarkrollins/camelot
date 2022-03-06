import React from 'react'
import Modal from 'react-foundation-modal'
import { IoAlertCircleOutline, IoInformationCircleOutline } from 'react-icons/io5'
import { BsQuestionCircle } from 'react-icons/bs'

export const ConfirmTypes = {
    QUESTION: 'question',
    ALERT: 'alert',
    INFORM: 'inform'
}

const ConfirmModal = ({ handleResult, returnValue, title = 'Please Confirm Choice', defaultPrompt = 'Are you sure?', confirmType = 'question', showModal = false }) => {

    const proceedFunction = () => {
        setTimeout(() => {
            handleResult(returnValue)
        }, 100)
    }

    const abortFunction = () => {
        setTimeout(() => {
            handleResult(null)
        }, 100)
    }

    const renderIconType = () => {
        switch (confirmType) {
            case ConfirmTypes.ALERT:
                return <IoAlertCircleOutline style={{ color: '#CC0000', fontSize: '1.5em', marginRight: '9px' }} />
            case ConfirmTypes.INFORM:
                return <IoInformationCircleOutline style={{ color: '#0000CC', fontSize: '1.5em', marginRight: '9px' }} />
            default:
                return <BsQuestionCircle style={{ color: '#A55640', fontSize: '1.5em', marginRight: '9px' }} />
        }
    }

    return (

        <Modal
            open={showModal}
            closeModal={abortFunction}
            isModal={true}
            size="dialog-top tiny radius-8 animate__animated animate__zoomIn"
        >
            <div className="grid-container">
                <div className="grid-x" >
                    <div className="cell small-12">
                        <div className="grid-x ">
                            <div className="cell small-12" style={{ marginBottom: '7px' }}>
                                <div className="preferences-title float-left">{renderIconType()}<div style={{ position: 'relative', display: 'inline', top: '-5px', fontSize: '1.2em' }}>{title}</div></div>
                                <button id="btnClose" className="close-button float-right" aria-label="Close modal" type="button" onClick={abortFunction}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="cell small-12" style={{ marginBottom: '7px' }}>
                                <div className="grid-x">
                                    <div className="cell small-12 text-left">
                                        {defaultPrompt}
                                    </div>
                                </div>
                            </div>

                            <div className="cell small-12 text-center save-button" style={{ marginTop: '7px' }}>
                                <button id="btnOK" type='button' style={{ marginRight: '7px' }} data-close="" onClick={proceedFunction}>Yes</button>
                                <button id="btnCancel" type='button' data-close="" onClick={abortFunction}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Modal>
    )
}

export default ConfirmModal

import React, { useContext, useState } from 'react'
import Modal from 'react-foundation-modal'
import { icons } from 'react-icons/lib'
import CamContext from './utils/camelotContext'
import { IoPodiumOutline } from 'react-icons/io5'

const DiagramModal = () => {

    const context = useContext(CamContext)
    const [diagramName, setName] = useState('')
    const [diagramDesc, setDesc] = useState('')
    const [errMessage, setErrMessage] = useState('')

    const hideModal = () => {
        context.hideModal()
    }

    const nameChange = (event) => {
        setName(event.target.value)
    }
    const descChange = (event) => {
        setDesc(event.target.value)
    }

    const saveAndClose = () => {

    }

    return (

        <Modal
            open={context.isModalVisible}
            closeModal={context.hideModal}
            isModal={true}
            size="tiny radius-8 animate__animated animate__zoomIn"
        >
            <div className="grid-container">
                <div className="grid-x" >
                    <div className="cell small-12">
                        <div className="grid-x ">
                            <div className="cell small-12" >
                                <div className="preferences-title float-left"><IoPodiumOutline style={{ color: '#A55640', fontSize: '1.5em', marginRight: '9px' }} /><div style={{ position: 'relative', display: 'inline', top: '-5px', fontSize: '1.2em' }}>Diagram Details</div></div>
                                <button id="btnClose" className="close-button float-right" aria-label="Close modal" type="button" onClick={hideModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="cell small-12">
                                <div className="grid-x">
                                    <div className="cell small-12 text-left" style={{ paddingRight: '7px' }}>
                                        <label>Title:</label>
                                    </div>
                                    <div className="cell small-12">
                                        <input id="diagram-name" type="text" placeholder="Required Diagram Title" onChange={nameChange} value={diagramName} />
                                    </div>
                                </div>
                            </div>
                            <div className="small-12 cell">
                                <div className="grid-x">
                                    <div className="cell small-12 text-left" style={{ paddingRight: '7px' }}>
                                        <label className="right">Description:</label>
                                    </div>
                                    <div className="cell small-12">
                                        <textarea id="diagram-desc" type="text" rows="3" placeholder="Optional Diagram Description" onChange={descChange} value={diagramDesc} />
                                    </div>
                                </div>
                            </div>
                            <div id="errorMsg" style={{ minHeight: '0px', width: '100%', color: '#990000', textAlign: 'center' }}>
                                {errMessage}
                            </div>

                            <div className="cell small-12 text-center">
                                <button id="btnSave" type='button' style={{ width: '75px', border: '1px solid #A55640', fontSize: '1em', borderRadius: '4px', color: '#A55640', cursor: 'pointer' }} data-close="" onClick={saveAndClose}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Modal>
    )
}

export default DiagramModal

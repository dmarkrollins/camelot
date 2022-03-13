import React, { useState, useEffect } from 'react'
import Modal from 'react-foundation-modal'
import { IoPodiumOutline } from 'react-icons/io5'

const DiagramModal = ({ handleSave, defaultName = '', defaultDesc = '', showModal = false, closeModal }) => {

    const [diagramName, setName] = useState('')
    const [diagramDesc, setDesc] = useState('')
    const [errMessage, setErrMessage] = useState('')

    useEffect(() => {
        setName(defaultName)
        setDesc(defaultDesc)
        setErrMessage('')
    }, [defaultName, defaultDesc])

    const nameChange = (event) => {
        setName(event.target.value)
    }

    const descChange = (event) => {
        setDesc(event.target.value)
    }

    const saveAndClose = async () => {
        try {
            setErrMessage('')
            await handleSave({ diagramName, diagramDesc })
            closeModal()
        }
        catch (err) {
            setErrMessage(err.message)
        }
    }

    return (

        <Modal
            open={showModal}
            closeModal={closeModal}
            isModal={true}
            size="dialog-top tiny radius-8 animate__animated animate__zoomIn"
        >
            <div className="grid-container">
                <div className="grid-x" >
                    <div className="cell small-12">
                        <div className="grid-x ">
                            <div className="cell small-12" >
                                <div className="preferences-title float-left"><IoPodiumOutline style={{ color: '#A55640', fontSize: '1.5em', marginRight: '9px' }} /><div style={{ position: 'relative', display: 'inline', top: '-5px', fontSize: '1.2em' }}>Diagram Details</div></div>
                                <button id="btnClose" className="close-button float-right" aria-label="Close modal" type="button" onClick={closeModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="cell small-12">
                                <div className="grid-x">
                                    <div className="cell small-12 text-left" style={{ paddingRight: '7px' }}>
                                        <label>Title:</label>
                                    </div>
                                    <div className="cell small-12">
                                        <input id="diagram-name" type="text" placeholder="Required Diagram Title" maxLength="60" onChange={nameChange} value={diagramName} />
                                    </div>
                                </div>
                            </div>
                            <div className="small-12 cell">
                                <div className="grid-x">
                                    <div className="cell small-12 text-left" style={{ paddingRight: '7px' }}>
                                        <label className="right">Description:</label>
                                    </div>
                                    <div className="cell small-12">
                                        <textarea id="diagram-desc" type="text" rows="3" placeholder="Optional Diagram Description" onChange={descChange} maxLength="255" value={diagramDesc} />
                                    </div>
                                </div>
                            </div>
                            <div id="errorMsg" style={{ minHeight: '0px', width: '100%', color: '#990000', textAlign: 'center' }}>
                                {errMessage}
                            </div>

                            <div className="cell small-12 text-center save-button" style={{ marginTop: '7px' }}>
                                <button id="btnSave" type='button' data-close="" onClick={saveAndClose}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Modal>
    )
}

export default DiagramModal

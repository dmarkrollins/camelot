/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Modal from 'react-foundation-modal'
import { IoLinkOutline } from 'react-icons/io5'
import { Oval } from 'react-loader-spinner'
import { DataManager } from './utils/dataManager'

export const ConfirmTypes = {
    QUESTION: 'question',
    ALERT: 'alert',
    INFORM: 'inform'
}

const ChooseModal = ({ showModal = false, closeModal, selectDiagram, currentDiagram }) => {

    const [search, setSearch] = useState('')
    const [diagrams, setDiagrams] = useState([])
    const [loading, setLoading] = useState(true)


    const getData = async () => {
        let list = []
        try {
            setLoading(true)
            list = await DataManager.getAllDrawings({ search })
        }
        finally {
            setDiagrams(list)
            setLoading(false)
        }
    }

    useEffect(() => {
        getData(search)
    }, [search])

    const doSearch = (e) => {
        const searchVal = e.currentTarget.value
        setSearch(searchVal)
    }

    const diagramSelected = (e) => {
        const id = e.currentTarget.value
        selectDiagram(id)
        closeModal()
    }

    const diagramItems = () => {
        if (diagrams === 'undefined' || !diagrams) {
            return []
        }

        const list = []

        for (let i = 0; i < diagrams.length; i++) {
            if (diagrams[i].diagramId !== currentDiagram) {
                list.push(<option key={diagrams[i].diagramId} value={diagrams[i].diagramId}>{diagrams[i].diagramName}</option>)
            }
        }

        return list
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
                            <div className="cell small-12">
                                <div className="preferences-title float-left"><IoLinkOutline className="preferences-icon"></IoLinkOutline>Link Diagram</div>
                            </div>
                            <button id="btnClose" className="close-button float-right" aria-label="Close modal" type="button" onClick={closeModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="grid-x">
                            <div className="cell small-12 text-left">
                                <input type="text" className="float-left" placeholder="Find Diagrams" onChange={doSearch} style={{ height: '34px', width: '100%' }} />
                            </div>
                            <div className="cell small-12" style={{ marginTop: '7px' }}>
                                {loading ?
                                    <Oval
                                        ariaLabel="loading-indicator"
                                        height={100}
                                        width={100}
                                        strokeWidth={5}
                                        color="#A55640"
                                        secondaryColor="#efefef"
                                        wrapperClass="spinner"
                                    />
                                    :
                                    <>
                                        <select id="Diagrams" size="5" onChange={diagramSelected}>
                                            {diagramItems(diagrams)}
                                        </select >
                                    </>
                                }
                            </div>
                            <div className="cell small-12" style={{ marginTop: '7px' }}>
                                <div className="float-left" style={{ display: 'inline-block', fontSize: '.8em', color: '#aaa' }}>First 50 results shown</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Modal >
    )
}

export default ChooseModal

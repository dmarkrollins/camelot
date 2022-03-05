/* eslint-disable no-restricted-globals */
// save cancel clear export

import React, { useContext, useState } from 'react'
import { IoCheckmarkDoneCircleOutline, IoChevronBackCircleOutline, IoTrashOutline, IoAppsSharp, IoSquareOutline } from 'react-icons/io5'
import { useNavigate } from "react-router-dom";
import CamContext from './utils/camelotContext'
import { exportToBlob } from "@excalidraw/excalidraw";
import Camelot from './utils/camelot'
import { DataManager } from './utils/dataManager'
import DiagramModal from './diagramModal'
// import { v4 as uuidv4 } from 'uuid';
// import ResizeBlob from './utils/resizeBlob'

const DiagramButtons = ({ xRef }) => {
    const navigate = useNavigate()
    const context = useContext(CamContext)

    const [showModal, setShowModal] = useState(false)

    const handleReturn = () => {
        navigate("/");
    }

    const handleClear = () => {
        const value = confirm('Are you sure?')
        if (value) {
            xRef.current.resetScene({ resetLoadingState: true })
        }
    }

    const handleModify = async ({ diagramId = '' }) => {

        const elements = xRef.current.getSceneElements()

        if (elements.length === 0) {
            throw new Error('Nothing drawn nothing to save!')
        }

        if (diagramId.trim() === '') {
            throw new Error('Diagram required to modify existing diagram!')
        }

        const opts = {
            elements,
            appState: xRef.current.getAppState(),
            files: xRef.current.getFiles(),
            mimeType: 'image/jpeg',
            quality: .5
        };

        const blob = await exportToBlob(opts)

        const drawing = {
            elements,
            appState: xRef.current.getAppState(),
            files: xRef.current.getFiles()
        }

        context.setIsSaving(true)

        try {
            await DataManager.modifyDrawing({ diagramId, drawing, image: blob })
            context.setDiagramDrawing(drawing)
        }
        catch (err) {
            console.log(err)
        }
        finally {
            context.setIsSaving(false)
        }
    }

    const saveNewDiagram = async ({ diagramName = '', diagramDesc = '' }) => {

        const elements = xRef.current.getSceneElements()

        if (elements.length === 0) {
            throw new Error('Nothing drawn nothing to save!')
        }

        Camelot.validateDiagramName(diagramName)

        const opts = {
            elements,
            appState: xRef.current.getAppState(),
            files: xRef.current.getFiles(),
            mimeType: 'image/jpeg',
            quality: .5
        };

        const blob = await exportToBlob(opts)

        const drawing = {
            elements,
            appState: xRef.current.getAppState(),
            files: xRef.current.getFiles()
        }

        context.setIsSaving(true)

        try {
            const response = await DataManager.saveDrawing({ diagramName, diagramDesc, drawing, image: blob })
            context.setDiagram({ id: response.diagramId, name: diagramName, desc: diagramDesc, drawing })
        }
        catch (err) {
            console.log(err)
        }
        finally {
            context.setIsSaving(false)
        }
    }

    const handleGrid = () => {
        context.setGridEnabled(!context.gridEnabled)
    }

    const handleSave = async () => {
        if (xRef.current.getSceneElements().length > 0) {

            if (context.diagramId) {
                await handleModify({ diagramId: context.diagramId })
            }
            else {
                setShowModal(true)
            }
        }
    }

    const closeModal = () => {
        setShowModal(false)
    }

    return (
        <div className="camelot-button-wrapper">
            <div className="diagram-name">
                {context.diagramName}
            </div>
            <button type="button" className="camelot-button-active" title="Save Diagram" onClick={handleSave}><IoCheckmarkDoneCircleOutline /><span className="button-title">Save</span></button>
            <button type="button" className="camelot-button-active" title="Return To List" onClick={handleReturn}><IoChevronBackCircleOutline /><span className="button-title">Return</span></button>
            <button type="button" className="camelot-button-active" title="Clear Diagram" onClick={handleGrid}>{context.gridEnabled ? <IoSquareOutline /> : <IoAppsSharp />}<span className="button-title">Grid</span></button>
            <button type="button" className="camelot-button-active" title="Clear Diagram" onClick={handleClear}><IoTrashOutline /><span className="button-title">Clear</span></button>
            <DiagramModal handleSave={saveNewDiagram} showModal={showModal} closeModal={closeModal} />
        </div>
    )
}

export default DiagramButtons
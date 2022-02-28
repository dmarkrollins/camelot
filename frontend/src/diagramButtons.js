/* eslint-disable no-restricted-globals */
// save cancel clear export

import React, { useContext, useState } from 'react'
import { IoCheckmarkDoneCircleOutline, IoChevronBackCircleOutline, IoTrashOutline, IoAppsSharp, IoSquareOutline } from 'react-icons/io5'
import { useNavigate } from "react-router-dom";
import CamContext from './utils/camelotContext'
import { exportToBlob } from "@excalidraw/excalidraw";
// import Camelot from './utils/camelot'
import { DataManager } from './utils/dataManager'
import DiagramModal from './diagramModal'
// import { v4 as uuidv4 } from 'uuid';
// import ResizeBlob from './utils/resizeBlob'

const DiagramButtons = ({ xRef }) => {
    const navigate = useNavigate()
    const context = useContext(CamContext)

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

        }
        catch (err) {
            console.log(err)
        }
        finally {
            context.setIsSaving(false)
        }

    }

    const handleSave = async ({ diagramName = '', diagramDesc = '' }) => {

        const elements = xRef.current.getSceneElements()

        if (elements.length === 0) {
            throw new Error('Nothing drawn nothing to save!')
        }

        if (diagramName.trim() === '' || diagramName.trim().length < 5) {
            throw new Error('Diagram name required and must be 5 characters or more!')
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

        const description = diagramDesc

        const name = diagramName

        if (name) {
            context.setIsSaving(true)
            try {

                const response = await DataManager.saveDrawing({ name, description, drawing, image: blob })

                context.setDiagramId(response.diagramId)
                context.setDiagramName(response.diagramName)
                context.setDiagramDesc(response.diagramDesc)
            }
            catch (err) {
                console.log(err)
            }
            finally {
                context.setIsSaving(false)
            }
        }
    }

    const handleGrid = () => {
        context.setGridEnabled(!context.gridEnabled)
    }

    const showModal = async () => {
        if (xRef.current.getSceneElements().length > 0) {

            if (context.diagramId) {
                return await handleModify(context.diagramId)
            }

            await context.showModal()
        }
    }

    return (
        <div className="camelot-button-wrapper">
            <div className="diagram-name">
                {context.diagramName}
            </div>
            <button type="button" className="camelot-button-active" title="Save Diagram" onClick={showModal}><IoCheckmarkDoneCircleOutline /><span className="button-title">Save</span></button>
            <button type="button" className="camelot-button-active" title="Return To List" onClick={handleReturn}><IoChevronBackCircleOutline /><span className="button-title">Return</span></button>
            <button type="button" className="camelot-button-active" title="Clear Diagram" onClick={handleGrid}>{context.gridEnabled ? <IoSquareOutline /> : <IoAppsSharp />}<span className="button-title">Grid</span></button>
            <button type="button" className="camelot-button-active" title="Clear Diagram" onClick={handleClear}><IoTrashOutline /><span className="button-title">Clear</span></button>
            <DiagramModal handleSave={handleSave} />
        </div>
    )
}

export default DiagramButtons
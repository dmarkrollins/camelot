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

    const handleSave = async (diagramName, diagramDesc) => {

        const elements = xRef.current.getSceneElements()

        if (elements.length === 0) {
            alert('Nothing to do')
            return
        }

        const opts = {
            elements,
            appState: xRef.current.getAppState(),
            files: xRef.current.getFiles(),
            mimeType: 'image/jpeg',
            quality: .5
        };

        const blob = await exportToBlob(opts)

        // const resizedBlob = await ResizeBlob(blob)

        // console.log('The image', blob)

        const drawing = {
            elements,
            appState: xRef.current.getAppState(),
            files: xRef.current.getFiles()
        }

        const description = 'This is a drawing that is being used to describe something very important to a number of people across the place.'

        const name = prompt('Name your drawing')

        if (name) {
            context.setIsSaving(true)
            try {

                // var fd = new FormData()
                // fd.append('image', blob)
                // fd.append('drawing', JSON.stringify(drawing))

                await DataManager.saveDrawing({ name, description, drawing, image: blob })
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

    const showModal = () => {
        if (xRef.current.getSceneElements().length > 0) {
            context.showModal()
        }
    }

    return (
        <div className="camelot-button-wrapper">
            <button type="button" className="camelot-button-active" title="Save Diagram" onClick={showModal}><IoCheckmarkDoneCircleOutline /><span className="button-title">Save</span></button>
            <button type="button" className="camelot-button-active" title="Return To List" onClick={handleReturn}><IoChevronBackCircleOutline /><span className="button-title">Return</span></button>
            <button type="button" className="camelot-button-active" title="Clear Diagram" onClick={handleGrid}>{context.gridEnabled ? <IoSquareOutline /> : <IoAppsSharp />}<span className="button-title">Grid</span></button>
            <button type="button" className="camelot-button-active" title="Clear Diagram" onClick={handleClear}><IoTrashOutline /><span className="button-title">Clear</span></button>
            <DiagramModal handleSave={handleSave} />
        </div>
    )
}

export default DiagramButtons
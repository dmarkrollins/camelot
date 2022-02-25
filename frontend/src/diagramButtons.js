/* eslint-disable no-restricted-globals */
// save cancel clear export

import React, { useContext, useState } from 'react'
import { IoCheckmarkDoneCircleOutline, IoChevronBackCircleOutline, IoTrashOutline, IoAppsSharp, IoSquareOutline } from 'react-icons/io5'
import { useNavigate } from "react-router-dom";
import CamContext from './utils/camelotContext'
import Camelot from './utils/camelot'
import { DataManager } from './utils/dataManager'

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

    const handleSave = async () => {
        const drawing = {
            elements: xRef.current.getSceneElements(),
            appState: xRef.current.getAppState(),
            files: xRef.current.getFiles(),
        }
        if (drawing.elements.length === 0) {
            alert('Nothing to do')
            return
        }

        const description = 'This is a drawing that is being used to describe something very important to a number of people across the place.'

        const name = prompt('Name your drawing')

        if (name) {
            context.setIsSaving(true)
            try {
                await DataManager.saveDrawing({ name, description, drawing })
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

    return (
        <div className="camelot-button-wrapper">
            <button type="button" className="camelot-button-active" title="Save Diagram" onClick={handleSave}><IoCheckmarkDoneCircleOutline /><span className="button-title">Save</span></button>
            <button type="button" className="camelot-button-active" title="Return To List" onClick={handleReturn}><IoChevronBackCircleOutline /><span className="button-title">Return</span></button>
            <button type="button" className="camelot-button-active" title="Clear Diagram" onClick={handleGrid}>{context.gridEnabled ? <IoSquareOutline /> : <IoAppsSharp />}<span className="button-title">Grid</span></button>
            <button type="button" className="camelot-button-active" title="Clear Diagram" onClick={handleClear}><IoTrashOutline /><span className="button-title">Clear</span></button>
        </div>
    )
}

export default DiagramButtons
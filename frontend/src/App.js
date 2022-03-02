import React, { useState } from 'react';
import {
    Route,
    Routes
} from "react-router-dom"
import Draw from './draw'
import Diagrams from './diagrams'
import { CamelotProvider } from './utils/camelotContext'

const App = () => {

    const [drawn, setDrawn] = useState(false)
    const [grid, setGrid] = useState(false)
    const [saving, setSaving] = useState(false)
    const [readonly, setReadonly] = useState(false)
    const [modalvisible, setModalVisible] = useState(false)
    const [currentId, setCurrentId] = useState('')
    const [currentName, setCurrentName] = useState('')
    const [currentDesc, setCurrentDesc] = useState('')
    const [drawing, setCurrentDrawing] = useState('')

    const CamelotFunctions = {
        hasDrawn: drawn,
        gridEnabled: grid,
        isSaving: saving,
        isReadOnly: readonly,
        isModalVisible: modalvisible,
        diagramId: currentId,
        diagramName: currentName,
        diagramDesc: currentDesc,
        drawing: drawing,
        setHasDrawn: (val) => {
            setDrawn(val)
        },
        setGridEnabled: (val) => {
            setGrid(val)
        },
        setIsSaving: (val) => {
            setSaving(val)
        },
        setIsReadOnly: (val) => {
            setReadonly(val)
        },
        showModal: () => {
            setModalVisible(true)
        },
        hideModal: () => {
            setModalVisible(false)
        },
        setDiagramId: (val) => {
            setCurrentId(val)
        },
        setDiagramName: (val) => {
            setCurrentName(val)
        },
        setDiagramDesc: (val) => {
            setCurrentDesc(val)
        },
        setDiagramDrawing: (val) => {
            setCurrentDrawing(val)
        },
        clearDiagram: () => {
            setCurrentId('')
            setCurrentName('')
            setCurrentDesc('')
            setCurrentDrawing('')
        },
        setDiagram: (id, name, desc, drawing) => {
            setCurrentId(id)
            setCurrentName(name)
            setCurrentDesc(desc)
            setCurrentDrawing(drawing)
        }

    }

    return (
        <CamelotProvider value={CamelotFunctions}>
            <Routes>
                <Route path="/" element={<Diagrams />} />
                <Route path="/view/:id" element={<Draw readonly={true} />} />
                <Route path="/draw" element={<Draw />} />
            </Routes>
        </CamelotProvider >
    )
}

export default App;

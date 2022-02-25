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

    const CamelotFunctions = {
        hasDrawn: drawn,
        gridEnabled: grid,
        isSaving: saving,
        isReadOnly: readonly,
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
        }
    }

    return (
        <CamelotProvider value={CamelotFunctions}>
            <Routes>
                <Route path="/" element={<Diagrams />} />
                <Route path="/view/:id" element={<Draw readonly={true} />} />
                <Route path="/draw/:id" element={<Draw />} />
                <Route path="/new" element={<Draw />} />
            </Routes>
        </CamelotProvider >
    )
}

export default App;

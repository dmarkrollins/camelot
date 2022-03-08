import React, { useState, useEffect } from 'react';
import {
    Route,
    Routes
} from "react-router-dom"
import { Authenticator } from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify";
import Draw from './draw'
import Diagrams from './diagrams'
import { CamelotProvider } from './utils/camelotContext'
import Redirector from './redirector'

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
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        try {
            await Auth.currentSession();
            setAuthenticated(true);
        }
        catch (e) {
            setAuthenticated(false);
        }
    }

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
        isAuthenticated: authenticated,
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
            setCurrentId(null)
            setCurrentName('')
            setCurrentDesc('')
            setCurrentDrawing(null)
        },
        setDiagram: ({ id, name, desc, drawing = null }) => {
            setCurrentId(id)
            setCurrentName(name)
            setCurrentDesc(desc)
            setCurrentDrawing(drawing)
        },
        hasAuthenticated: (val) => {
            setAuthenticated(val)
        }

    }

    return (
        <Authenticator
            hideSignUp={true}
            loginMechanisms={['email']}
        >
            {({ signOut, user }) => (
                <CamelotProvider value={CamelotFunctions}>
                    <Routes>
                        <Route path="/" element={<Diagrams signOut={signOut} user={user} />} />
                        <Route path="/draw" element={<Draw />} />
                        <Route path="/draw/:id" element={<Redirector />} />
                        <Route path="/view/:id" element={<Draw readonly={true} />} />
                    </Routes>
                </CamelotProvider >
            )}
        </Authenticator >
    )
}

export default App;

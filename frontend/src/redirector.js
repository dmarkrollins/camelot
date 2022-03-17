import React, { useEffect, useContext } from 'react'
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DataManager } from './utils/dataManager'
import CamContext from './utils/camelotContext'
import { Oval } from 'react-loader-spinner'
import Camelot from './utils/camelot'

const Redirector = () => {

    const navigate = useNavigate();
    const context = useContext(CamContext)
    const { id } = useParams()

    const manageBreadCrumb = (newItem) => {
        const diagrams = Camelot.LocalStorage.get({ key: Camelot.Constants.BREADCRUMB, defaultValue: [], isJson: true })
        const index = diagrams.findIndex((item) => item.diagramId === newItem.diagramId)
        if (index !== -1) {
            diagrams.splice(index, 99)

        }
        diagrams.push({
            diagramId: newItem.diagramId,
            diagramName: newItem.diagramName
        })
        Camelot.LocalStorage.set({ key: Camelot.Constants.BREADCRUMB, value: diagrams, isJson: true })
    }

    useEffect(() => {
        const doNavigation = async () => {
            if (id) {
                const response = await DataManager.getDrawing({ id })
                manageBreadCrumb(response)
                context.setDiagram({ id: response.diagramId, name: response.diagramName, desc: response.diagramDesc, drawing: response.drawing })
                navigate('/draw')
            }
            else {
                navigate('/')
            }
        }
        doNavigation()
    }, [id, context, navigate])

    return (
        <Oval
            ariaLabel="loading-indicator"
            height={100}
            width={100}
            strokeWidth={5}
            color="#A55640"
            secondaryColor="#efefef"
            wrapperClass="spinner"
        />
    )
}

export default Redirector

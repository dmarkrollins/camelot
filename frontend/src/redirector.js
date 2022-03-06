import React, { useEffect, useContext } from 'react'
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DataManager } from './utils/dataManager'
import CamContext from './utils/camelotContext'
import { Oval } from 'react-loader-spinner'

const Redirector = () => {

    const navigate = useNavigate();
    const context = useContext(CamContext)
    const { id } = useParams()

    useEffect(() => {
        const doNavigation = async () => {
            if (id) {
                const response = await DataManager.getDrawing({ id })
                context.setDiagram({ id: response.diagramId, name: response.diagramName, desc: response.diagramDesc, drawing: response.drawing })
                navigate('/draw')
            }
            else {
                navigate('/diagrams')
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

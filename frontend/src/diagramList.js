/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback, useContext } from 'react'
// import { IoWaterSharp, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import { IoCopyOutline, IoCreateOutline, IoAddCircleOutline, IoChevronBackCircleOutline, IoChevronForwardCircleOutline, IoRemoveCircleOutline, IoCogOutline } from 'react-icons/io5'

import { DataManager } from './utils/dataManager'
import { Oval } from 'react-loader-spinner'
import { debounce } from "lodash";
import { ToastContainer, toast } from 'react-toastify'
import moment from 'moment'
import { useNavigate } from "react-router-dom";
import CamContext from './utils/camelotContext'
import ListModal from './diagramModal'
import ConfirmModal, { ConfirmTypes } from './confirmModal'
import { Sleep } from './utils/sleep'
import Camelot from './utils/camelot'

import 'react-toastify/dist/ReactToastify.css'

const DiagramList = () => {

    const navigate = useNavigate()
    const context = useContext(CamContext)

    const [page, setPage] = useState(0)
    const [diagrams, setDiagrams] = useState([])
    const pageSize = 8
    const [pages, setPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [diagramId, setDiagramId] = useState('')
    const [diagramName, setDiagramName] = useState('')
    const [diagramDesc, setDiagramDesc] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)
    const [retVal, setRetVal] = useState(false)

    const searchHandler = useCallback(debounce((val) => {
        setSearch(val)
    }, Camelot.Constants.SEARCH_TIMEOUT, []))

    const notify = () => toast(<span className="camelot-toast-message">Diagram link copied to clipboard!</span>);

    const getData = async () => {
        let p = 0
        let list
        setPage(0)
        setPages(0)
        try {
            setLoading(true)
            list = await DataManager.getAllDrawings({ search })
            p = Math.ceil(list.length / pageSize) - 1
        }
        finally {
            Camelot.LocalStorage.set({ key: Camelot.Constants.BREADCRUMB, value: [], isJson: true })
            setPages(p)
            setDiagrams(list)
            setLoading(false)
        }
    }

    const removeItem = async (id) => {
        try {
            setLoading(true)
            await DataManager.removeDrawing({ id })
            const list = diagrams.filter((i) => i.diagramId !== id)
            const p = Math.ceil(list.length / pageSize) - 1
            setPages(p)
            setDiagrams(list)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [search])

    const prevPage = () => {
        let newPage = page
        if (newPage < 0) {
            newPage = 0
        }
        else {
            newPage = page - 1
        }
        setPage(newPage)
    }

    const nextPage = () => {

        if (page >= pages) {
            return
        }

        let newPage = page + 1

        setPage(newPage)
    }

    const formatDate = (dateStr) => {
        return moment(dateStr).format('YYYY-MM-DD h:mm:ss a')
    }

    const formatVersion = (version) => {
        const vstr = version.toString()

        return `${vstr[0]}.${vstr[1]}.${vstr.substring(vstr.length - 2)}`

    }

    const copyToClipBoard = (e) => {

        const deeplink = `${window.location.href}draw/${e.currentTarget.dataset.id}`

        navigator.clipboard.writeText(deeplink);

        notify()
    }

    const borderClass = (i, end, length) => {
        if (i + 1 === end) {
            return 'grid-x camelot-item-no-border'
        }

        if (i + 1 === length) {
            return 'grid-x camelot-item-no-border'
        }
        return 'grid-x camelot-item'
    }

    const diagramItems = () => {
        if (diagrams === 'undefined' || !diagrams) {
            return []
        }

        const list = []

        const start = page * pageSize
        const end = start + pageSize

        let i = start

        for (i; i < end; i++) {

            if (i > diagrams.length - 1) {
                break
            }

            const timestamp = new Date().getTime();
            const twoMinutesAgo = moment().subtract(2, 'minutes')

            const thumbUrl = moment(diagrams[i].modifiedAt).isAfter(twoMinutesAgo) ? `https://${diagrams[i].thumbsBucket}.s3.amazonaws.com/${diagrams[i].thumbNail}?t=${timestamp}` : `https://${diagrams[i].thumbsBucket}.s3.amazonaws.com/${diagrams[i].thumbNail}`

            list.push(<tr key={diagrams[i].diagramId}>
                <td align="left">
                    <div className={borderClass(i, end, diagrams.length)}>
                        <div className="cell small-9 text-left">
                            <p style={{ fontWeight: '600' }}>{diagrams[i].diagramName}</p>
                            <p>{diagrams[i].description}</p>
                        </div>
                        <div className="cell small-3 text-right">
                            <img src={thumbUrl} width="150" alt='' />
                        </div>
                        <div className="column small-6">
                            <div className='camelot-button-wrapper-inline'>
                                <button type="button" data-id={diagrams[i].diagramId} className="camelot-button-active" title="Copy diagram link to clipboard" onClick={copyToClipBoard}><IoCopyOutline /><div className="button-title">Copy</div></button>
                                <button type="button" data-id={diagrams[i].diagramId} className="camelot-button-active" title="Rename Diagram" onClick={handleRename}><IoCreateOutline /><div className="button-title">Rename</div></button>
                                <button type="button" data-id={diagrams[i].diagramId} className="camelot-button-active" title="Modify Diagram" onClick={handleModify}><IoCogOutline /><div className="button-title">Modify</div></button>
                                <button type="button" data-id={diagrams[i].diagramId} className="camelot-button-active" title="Remove Diagram" onClick={handleRemove}><IoRemoveCircleOutline /><div className="button-title">Remove</div></button>
                            </div>
                        </div>
                        <div className="column small-6 text-right" style={{ fontSize: '.7em' }}>
                            <div style={{ position: 'relative', top: '21px', color: '#ccc' }}>Version {formatVersion(diagrams[i].version)} - {diagrams[i].modifiedAt ? formatDate(diagrams[i].modifiedAt) : formatDate(diagrams[i].createdAt)}</div>
                        </div>
                    </div>

                </td>
            </tr >)
        }

        return list

    }

    const prevStyle = () => {
        let color = '#A55640'

        if (page <= 0) {
            color = '#666'
        }

        return { fontSize: '1.5em', color }
    }

    const nextStyle = () => {
        let color = '#A55640'

        if (page >= pages) {
            color = '#666'
        }

        return { fontSize: '1.5em', color }
    }

    const previousDisabled = () => {
        return page <= 0
    }

    const nextDisabled = () => {
        return page >= pages
    }

    const doSearch = (e) => {
        searchHandler(e.currentTarget.value)
    }

    const newDrawing = () => {
        context.clearDiagram()
        setTimeout(() => {
            navigate('/draw')
        }, 200)
    }

    const handleConfirmResponse = (val) => {
        if (val) {
            removeItem(val)
        }
        setShowConfirm(false)
    }

    const handleRemove = async (e) => {
        const id = e.currentTarget.dataset.id
        setRetVal(id)
        setShowConfirm(true)
    }

    const handleModify = async (e) => {
        const id = e.currentTarget.dataset.id
        setLoading(true)
        try {
            // const response = await DataManager.getDrawing({ id })
            // context.setDiagram({ id: response.diagramId, name: response.diagramName, desc: response.diagramDesc, drawing: response.drawing })
            navigate(`/draw/${id}`)
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }

    const handleRename = async (e) => {
        const id = e.currentTarget.dataset.id
        try {
            setLoading(true)
            const response = await DataManager.getDrawing({ id })
            // console.log(response)
            setDiagramName(response.diagramName)
            setDiagramDesc(response.diagramDesc)
            setDiagramId(id)
            Sleep(200)
            setShowModal(true)
        }
        finally {
            setLoading(false)
        }
    }

    const handleNameChange = async ({ diagramName = '', diagramDesc = '' }) => {

        Camelot.validateDiagramName(diagramName)

        try {
            setLoading(true)
            await DataManager.renameDrawing({ diagramId: diagramId, diagramName, diagramDesc })

            const list = [...diagrams];

            const foundIndex = list.findIndex(x => x.diagramId === diagramId);
            if (foundIndex !== -1) {
                list[foundIndex].diagramName = diagramName
                list[foundIndex].description = diagramDesc
                setDiagrams(list)
            }

            // context.clearDiagram()

            setShowModal(false)
        }
        catch (err) {
            console.log(err)
            throw new Error('Problem occurred saving diagram info!')
        }
        finally {
            setLoading(false)
        }
    }

    const closeModal = () => {
        setShowModal(false)
    }

    return (
        <>
            <div className="grid-x">
                <div className="cell small-10 medium-10 large-6 text-center" style={{ minHeight: '75vh', margin: '0 auto' }}>

                    <div style={{ marginTop: '21px' }} className="save-button">
                        <input type="text" className="float-left" placeholder="Search" onChange={doSearch} style={{ height: '34px', width: '50%' }} />


                        <button type="button" title='New Diagram' className="float-right" style={{ height: '34px' }} onClick={newDrawing}>
                            New <div style={{ display: 'inline-block', position: 'relative', top: '3px' }}><IoAddCircleOutline /></div>
                        </button>
                    </div>

                    <>
                        {loading ? <Oval
                            ariaLabel="loading-indicator"
                            height={100}
                            width={100}
                            strokeWidth={5}
                            color="#A55640"
                            secondaryColor="#efefef"
                            wrapperClass="spinner"
                        /> : ''}
                        <table className="movement-table hover unstriped" style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                            <tbody>
                                {diagramItems(diagrams)}
                            </tbody>
                        </table>
                        <div>
                            <button id="btnPrev" title='Previous Page' aria-label="Next" type="button" disabled={previousDisabled()} onClick={prevPage} style={{ position: 'relative', display: 'inline', top: '7px', marginRight: '12px' }}>
                                <span aria-hidden="true"><IoChevronBackCircleOutline style={prevStyle()} /></span>
                            </button>
                            <span>Page {page + 1} of {pages + 1} </span>
                            <button id="btnNext" title='Next Page' aria-label="Prev" type="button" disabled={nextDisabled()} onClick={nextPage} style={{ position: 'relative', display: 'inline', top: '7px', marginLeft: '12px' }}>
                                <span aria-hidden="true"><IoChevronForwardCircleOutline style={nextStyle()} /></span>
                            </button>
                        </div>
                    </>

                </div>
            </div>

            <ListModal handleSave={handleNameChange} defaultName={diagramName} defaultDesc={diagramDesc} showModal={showModal} closeModal={closeModal} />
            <ConfirmModal handleResult={handleConfirmResponse} confirmType={ConfirmTypes.ALERT} returnValue={retVal} showModal={showConfirm} defaultPrompt='Are you sure you want to PERMANENTLY delete this diagram?' title='Delete Diagram' />
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
            />


        </>

    )
}

export default DiagramList
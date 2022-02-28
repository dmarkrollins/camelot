/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react'
// import { IoWaterSharp, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import { IoAddCircleOutline, IoChevronDownCircleOutline, IoChevronUpCircleOutline, IoRemoveCircleOutline, IoDocumentTextOutline } from 'react-icons/io5'

import { DataManager } from './utils/dataManager'
import { Oval } from 'react-loader-spinner'
import { debounce } from "lodash";
import moment from 'moment'
import { useNavigate } from "react-router-dom";

const DiagramList = () => {

    const navigate = useNavigate()

    const [page, setPage] = useState(0)
    const [diagrams, setDiagrams] = useState([])
    const pageSize = 8
    const [pages, setPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const searchHandler = useCallback(debounce((val) => {
        setSearch(val)
    }, 350, []))

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

            const thumbUrl = `https://${diagrams[i].thumbsBucket}.s3.amazonaws.com/${diagrams[i].thumbNail}`

            list.push(<tr key={diagrams[i].diagramId}>
                <td align="camelot-item">
                    <div className="grid-x camelot-item">
                        <div className="cell small-9 text-left">
                            <p style={{ fontWeight: '600' }}>{diagrams[i].diagramName}</p>
                            <p>{diagrams[i].description}</p>
                        </div>
                        <div className="cell small-3 text-right">
                            <img src={thumbUrl} width="150" alt='' />
                        </div>
                        <div className="column small-6">
                            <div className='camelot-button-wrapper-inline'>
                                <button type="button" data-id={diagrams[i].diagramId} className="camelot-button-active" title="Edit Diagram" onClick={handleModify}><IoDocumentTextOutline /><span className="button-title">Edit</span></button>
                                <button type="button" data-id={diagrams[i].diagramId} className="camelot-button-active" title="Edit Diagram" onClick={handleRemove}><IoRemoveCircleOutline /><span className="button-title">Remove</span></button>
                            </div>
                        </div>
                        <div className="column small-6 text-right" style={{ fontSize: '.7em' }}>
                            <div style={{ position: 'relative', top: '21px', color: '#ccc' }}>Version {formatVersion(diagrams[i].version)} - {formatDate(diagrams[i].createdAt)}</div>
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
        navigate('/draw')
    }

    const handleRemove = (e) => {
        const id = e.currentTarget.dataset.id
        if (confirm('Are you sure?')) {
            removeItem(id)
        }
    }
    const handleModify = (e) => {
        const id = e.currentTarget.dataset.id
    }

    return (
        <div className="grid-x" >

            <div className="cell small-12 medium-10 large-6 text-center" style={{ padding: '7px', minHeight: '75vh', margin: '0 auto' }}>

                <div className="cell small-12" style={{ width: '100%', marginTop: '30px' }}>
                    <button type="button" className="float-left" style={{ position: 'relative', display: 'inline', top: '-27px' }} onClick={newDrawing}>
                        <span aria-hidden="true" style={{ fontSize: '1.5em', color: '#A55640' }}><IoAddCircleOutline /></span>
                    </button>
                    <button id="btnNext" className="float-right" aria-label="Prev" type="button" disabled={nextDisabled()} onClick={nextPage} style={{ position: 'relative', display: 'inline', top: '-27px' }}>
                        <span aria-hidden="true"><IoChevronDownCircleOutline style={nextStyle()} /></span>
                    </button>
                    <button id="btnPrev" className="float-right" aria-label="Next" type="button" disabled={previousDisabled()} onClick={prevPage} style={{ position: 'relative', display: 'inline', top: '-27px', marginRight: '27px' }}>
                        <span aria-hidden="true"><IoChevronUpCircleOutline style={prevStyle()} /></span>
                    </button>
                </div>

                <div className="cell small-12" style={{ marginBottom: '12px' }}>
                    <input type="text" placeholder="Search" onChange={doSearch} style={{ margin: '0 auto' }} />
                </div>

                {loading ? <Oval
                    ariaLabel="loading-indicator"
                    height={100}
                    width={100}
                    strokeWidth={5}
                    color="#A55640"
                    secondaryColor="#efefef"
                    wrapperClass="verticalCenter"
                /> :
                    <>
                        <table className="movement-table hover unstriped" style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                            {/* <thead>
                                <tr style={{ fontSize: '.8em' }}>
                                    <th>Drawing</th>
                                </tr>
                            </thead> */}
                            <tbody>
                                {diagramItems(diagrams)}
                            </tbody>
                        </table>
                        <div>Page {page + 1} of {pages + 1} </div>
                    </>
                }
            </div>

        </div>

    )
}

export default DiagramList
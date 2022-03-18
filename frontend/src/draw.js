import React, { useEffect, useState, useRef, useCallback, useContext, useMemo } from "react";
import Excalidraw from "@excalidraw/excalidraw";
import { Oval } from 'react-loader-spinner'
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import "./App.scss";
import DiagramButtons from './diagramButtons'
import CamContext from './utils/camelotContext'
import Camelot from './utils/camelot'
import ChooseModal from './chooseModal'


const resolvablePromise = () => {
    let resolve;
    let reject;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};

let mouseDown = null
let selectedElement = null

export default function Draw() {
    const navigate = useNavigate()
    const context = useContext(CamContext)
    const [isSpinning, setIsSpinning] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [widget, setWidget] = useState(null)

    const initialStatePromiseRef = useRef({ promise: null });

    if (!initialStatePromiseRef.current.promise) {
        initialStatePromiseRef.current.promise = resolvablePromise();
    }

    const excalidrawRef = useMemo(
        () => ({
            current: {
                readyPromise: resolvablePromise()
            }
        }),
        []
    );

    const isObject = (val) => {
        return val instanceof Object;
    }

    useEffect(() => {

        const getContent = async () => {

            let content = null

            if (context.drawing) {
                // existing diagram

                if (isObject(context.drawing)) {
                    content = context.drawing
                }
                else {
                    content = JSON.parse(context.drawing)
                }
                content.appState = { viewBackgroundColor: "#FFFFFF", currentItemFontFamily: 1 }
            }
            else {

                const savedContent = Camelot.LocalStorage.get({ key: Camelot.Constants.DIAGRAM, defaultValue: null, isJson: true })

                if (!savedContent) {
                    content = {
                        elements: [],
                        appState: { viewBackgroundColor: "#FFFFFF", currentItemFontFamily: 1 }
                    }
                }
                else {
                    content = {
                        elements: savedContent.elements,
                        appState: { viewBackgroundColor: "#FFFFFF", currentItemFontFamily: 1 }
                    }

                    if (savedContent.files) {
                        content.files = savedContent.files
                    }
                }

            }

            content.scrollToContent = true

            const libraries = Camelot.LocalStorage.get({ key: Camelot.Constants.LIBRARIES, defaultValue: null, isJson: true })

            if (libraries) {
                content.libraryItems = libraries
            }

            return content

        }

        excalidrawRef.current.readyPromise.then((api) => {
            initialStatePromiseRef.current.promise.resolve(getContent());
        });


        const onHashChange = () => {
            const hash = new URLSearchParams(window.location.hash.slice(1));
            const libraryUrl = hash.get("addLibrary");
            if (libraryUrl) {
                excalidrawRef.current.importLibrary(libraryUrl, hash.get("token"));
            }
        };
        window.addEventListener("hashchange", onHashChange, false);
        return () => {
            window.removeEventListener("hashchange", onHashChange);
        };
    }, [excalidrawRef, context.drawing]);

    const onLinkOpen = useCallback((element, event) => {
        const link = element.link;
        const { nativeEvent } = event.detail;
        const isNewTab = nativeEvent.ctrlKey || nativeEvent.metaKey;
        const isNewWindow = nativeEvent.shiftKey;

        const isCamelotLink = link.startsWith('camelot:')

        const isInternalLink = link.startsWith("/") || link.includes(window.location.origin);

        if ((isCamelotLink || isInternalLink) && !isNewTab && !isNewWindow) {
            // signal that we're handling the redirect ourselves
            event.preventDefault();

            if (link.startsWith('camelot:')) {
                const parts = link.split('camelot:')
                navigate(`/draw/${parts[1]}`)
            }
            else {
                navigate(link)
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLibraryChange = (items) => {
        Camelot.LocalStorage.set({ key: Camelot.Constants.LIBRARIES, value: items, isJson: true })
    }

    const spinHandler = (val) => {
        setIsSpinning(val)
    }

    const handleMouse = (event) => {

        if (event.button === 'down') {
            mouseDown = new Date()
            selectedElement = null
            console.log(event)
            return
        }

        if (event.button === 'up' && !selectedElement) {
            mouseDown = null
            return
        }

        if (event.button === 'up' && mouseDown) {
            mouseDown = null
            selectedElement = null
            return
        }

        if (event.button === 'up' && selectedElement) {
            setWidget(selectedElement)
            setShowModal(true)
            // alert(`The selected element ${selectedElement}`)
            selectedElement = null
        }
    }

    const debounceChange = debounce((elements, appState, files) => {
        if (!context.diagramId) {
            // save to local storage
            const diagram = {
                elements, appState, files,
            }
            Camelot.LocalStorage.set({ key: Camelot.Constants.DIAGRAM, value: diagram, isJson: true })
        }

        console.log('Change', mouseDown, appState.selectedElementIds)

        if (mouseDown) {
            const keys = Object.keys(appState.selectedElementIds)
            // console.log('Keys', keys)
            const element = elements.filter((item) => item.id === keys[0])[0]
            if (element !== 'undefined') {
                // console.log('Selected', element) //, element.id, element.type)
                selectedElement = element
            }
            else {
                selectedElement = null
            }
            mouseDown = null
        }

    }, Camelot.Constants.CHANGE_TIMEOUT)

    const onChange = useCallback((elements, appState, files) => {
        debounceChange(elements, appState, files)
    }, [debounceChange])

    const closeModal = () => {
        setShowModal(false)
    }

    const diagramSelected = (diagramId) => {

        const elements = excalidrawRef.current.getSceneElements()
        let newArr = []
        if (elements) {
            const element = elements.filter((item) => item.id === widget.id)
            if (element) {
                newArr = elements.map(obj => {
                    if (obj.id === widget.id) {
                        return { ...obj, link: `camelot:${diagramId}` };
                    }
                    return obj;
                });
            }
            excalidrawRef.current.updateScene({
                elements: newArr
            })
        }
        // alert('Selected this diagram', diagramId)
    }

    const diagramList = (diagrams) => {

        if (diagrams.length === 0) {
            return ''
        }

        const list = []

        for (let i = 0; i < diagrams.length; i += 1) {
            if (i === (diagrams.length - 1)) {
                list.push(<span key={diagrams[i].diagramId}>{diagrams[i].diagramName}</span>)
            }
            else {
                list.push(<a key={diagrams[i].diagramId} href={`/draw/${diagrams[i].diagramId}`} alt=''>{diagrams[i].diagramName}</a>)
            }
            if (i < (diagrams.length - 1)) {
                list.push(<div key={i} style={{ display: 'inline-block', position: 'relative', top: '2px', fontSize: '1.5em', marginRight: '7px', marginLeft: '7px' }}> &#8250; </div>)
            }
        }

        return list
    }

    const renderFooter = () => {
        const diagrams = Camelot.LocalStorage.get({ key: Camelot.Constants.BREADCRUMB, defaultValue: [], isJson: true })
        return (
            <div className="draw-footer">
                {diagramList(diagrams)}
            </div>
        )
    };

    return (
        <div className="App">
            <DiagramButtons xRef={excalidrawRef} handleSpinner={spinHandler} />
            {isSpinning ? <Oval
                ariaLabel="loading-indicator"
                height={100}
                width={100}
                strokeWidth={5}
                color="#A55640"
                secondaryColor="#efefef"
                wrapperClass="verticalCenterTop"
            /> : ''}
            <div className="excalidraw-wrapper">
                <Excalidraw
                    ref={excalidrawRef}
                    initialData={initialStatePromiseRef.current.promise}
                    onPointerUpdate={handleMouse}
                    onChange={onChange}
                    libraryReturnUrl={window.location.href}
                    onLibraryChange={handleLibraryChange}
                    viewModeEnabled={context.isReadOnly}
                    gridModeEnabled={context.gridEnabled}
                    name="Custom name of drawing"
                    UIOptions={{ canvasActions: { loadScene: false } }}
                    onLinkOpen={onLinkOpen}
                    renderFooter={renderFooter}
                />
            </div>
            <ChooseModal showModal={showModal} closeModal={closeModal} selectDiagram={diagramSelected} currentDiagram={context.diagramId} />
        </div>
    );
}
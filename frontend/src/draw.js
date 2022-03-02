import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import Excalidraw, {
    exportToCanvas,
    exportToSvg,
    exportToBlob
} from "@excalidraw/excalidraw";
import { Oval } from 'react-loader-spinner'
import InitialData from "./initialData";
import "./App.scss";
import DiagramButtons from './diagramButtons'
import CamContext from './utils/camelotContext'
import Camelot from './utils/camelot'

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

export default function Draw() {
    const excalidrawRef = useRef(null);
    const context = useContext(CamContext)
    // const [diagram, setDiagram] = useState({})
    // const [viewModeEnabled, setViewModeEnabled] = useState(false);
    // const [zenModeEnabled, setZenModeEnabled] = useState(false);
    // const [gridModeEnabled, setGridModeEnabled] = useState(context.gridEnabled);
    // const [blobUrl, setBlobUrl] = useState(null);
    // const [canvasUrl, setCanvasUrl] = useState(null);
    // const [exportWithDarkMode, setExportWithDarkMode] = useState(false);
    // const [theme, setTheme] = useState("light");

    const initialStatePromiseRef = useRef({ promise: null });
    if (!initialStatePromiseRef.current.promise) {
        initialStatePromiseRef.current.promise = resolvablePromise();
    }
    useEffect(() => {
        // const fetchData = async () => {
        //     const res = await fetch("/rocket.jpeg");
        //     const imageData = await res.blob();
        //     const reader = new FileReader();
        //     reader.readAsDataURL(imageData);

        //     reader.onload = function () {
        //         const imagesArray = [
        //             {
        //                 id: "rocket",
        //                 dataURL: reader.result,
        //                 mimeType: "image/jpeg",
        //                 created: 1644915140367
        //             }
        //         ];

        //         initialStatePromiseRef.current.promise.resolve(InitialData);
        //         excalidrawRef.current.addFiles(imagesArray);
        //     };
        // };
        // fetchData();

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
    }, []);

    const onLinkOpen = useCallback((element, event) => {
        const link = element.link;
        const { nativeEvent } = event.detail;
        const isNewTab = nativeEvent.ctrlKey || nativeEvent.metaKey;
        const isNewWindow = nativeEvent.shiftKey;
        const isInternalLink =
            link.startsWith("/") || link.includes(window.location.origin);
        if (isInternalLink && !isNewTab && !isNewWindow) {
            // signal that we're handling the redirect ourselves
            event.preventDefault();
            // do a custom redirect, such as passing to react-router
            // ...
        }
    }, []);

    const handleLibraryChange = (items) => {
        Camelot.LocalStorage.set({ key: Camelot.Keys.LIBRARIES, value: items, isJson: true })
    }

    return (
        <div className="App">
            <DiagramButtons xRef={excalidrawRef} />
            {context.isSaving ? <Oval
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
                    // initialData={initialStatePromiseRef.current.promise}
                    // onChange={handleChange}
                    libraryReturnUrl={window.location.href}
                    onLibraryChange={handleLibraryChange}
                    viewModeEnabled={context.isReadOnly}
                    gridModeEnabled={context.gridEnabled}
                    name="Custom name of drawing"
                    UIOptions={{ canvasActions: { loadScene: false } }}
                    onLinkOpen={onLinkOpen}
                />
            </div>
        </div>
    );
}
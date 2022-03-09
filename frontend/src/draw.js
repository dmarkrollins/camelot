import React, { useEffect, useState, useRef, useCallback, useContext, useMemo } from "react";
import Excalidraw from "@excalidraw/excalidraw";
import { Oval } from 'react-loader-spinner'
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
    const context = useContext(CamContext)
    const [isSpinning, setIsSpinning] = useState(false)

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
                // new diagram
                content = {
                    elements: [],
                    appState: { viewBackgroundColor: "#FFFFFF", currentItemFontFamily: 1 }
                }
            }

            content.scrollToContent = true

            const libraries = Camelot.LocalStorage.get({ key: Camelot.Keys.LIBRARIES, defaultValue: null, isJson: true })

            if (libraries) {
                content.libraryItems = libraries
            }

            return content

        }

        excalidrawRef.current.readyPromise.then((api) => {
            initialStatePromiseRef.current.promise.resolve(getContent());
            // api.updateScene(getContent())
        });
        // }, [excalidrawRef, context.drawing]);

        // useEffect(() => {

        //     setTimeout(() => {
        //         let content = null

        //         if (context.drawing) {
        //             content = JSON.parse(context.drawing)
        //             content.scrollToContent = true
        //             content.appState = { viewBackgroundColor: "#FFFFFF", currentItemFontFamily: 1 }
        //         }

        //         initialStatePromiseRef.current.promise.resolve(content);
        //     }, 250);

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

    const spinHandler = (val) => {
        setIsSpinning(val)
    }

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
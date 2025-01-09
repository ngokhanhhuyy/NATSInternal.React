// @ts-check
/// <reference lib="webworker" />


/**
 * @typedef {object} RequestMessage
 * @property {string} requestId
 * @property {string} pathName
 * @property {string} method
 * @property {{ [key: string]: string }} headers
 * @property {string | null | undefined} body
 * @property {RequestCredentials | undefined} credentials
 */

/**
 * @typedef {object} ResponseMessage
 * @property {string} requestId
 * @property {number} status
 * @property {{ [key: string]: string }} headers
 * @property {string | null | undefined} body
 */

/**
 * Send the message to the websocket server and receive the response.
 * 
 * @callback RequestSender
 * @param {string} pathName 
 * @param {string} method 
 * @param {{ [key: string]: string }} headers 
 * @param {string | null | undefined} body 
 * @param {any | undefined} credentials 
 * @returns {Promise<Response>}
 */

/**
 * Send the message to the websocket server for main.js script and receive the response
 * containing the script as ArrayBuffer format.
 * 
 * @callback MainJsAsArrayBufferRequestSender
 * @param {string} pathName 
 * @param {{ [key: string]: string }} headers
 * @param {any | undefined} credentials 
 * @returns {Promise<Response>}
 */

/**
 * @typedef {object} WebSocketClient
 * @property {number} readyState
 * @property {boolean} isConnected
 * @property {RequestSender} requestAsync
 * @property {MainJsAsArrayBufferRequestSender} requestMainJsAsArrayBufferAsync
 */

/**
 * @typedef {object} Config
 * @property {"IncludeAuthCalls" | "ExcludeAuthCalls" | false} interceptApiCalls
 * @property {"MainJsAsArrayBuffer" | "MainJsAsString" | "ExcludeMainJs" | false} interceptScriptRequests
 * @property {number} webSocketOpeningTimeout
 * @property {number} requestTimeout
 */

// @ts-ignore
const /** @type {ServiceWorkerGlobalScope} */ currentContext = self;

/** @type {WebSocketClient} */
let wsClient;
let wsServerUrl = `${self.location.origin.replace(/^http/, "ws")}/proxyWebsocket`

/** @type {Config} */
const config = {
    interceptApiCalls: "IncludeAuthCalls",
    interceptScriptRequests: "MainJsAsArrayBuffer",
    webSocketOpeningTimeout: 5_000,
    requestTimeout: 15_000,
};

// @ts-ignore
self.addEventListener("activate", (/** @type {ExtendableEvent} */ event) => {
    console.log("Service Worker activated.");
    useWebSocket(wsServerUrl).then(client => wsClient = client);
    // @ts-ignore
    event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
    /** @type {{ type: "getConfig" | "resetWsConnection" } | { type: "changeConfig", config: Config }} */
    const data = event.data;
    switch (data.type) {
        case "getConfig":
            event.source?.postMessage({ type: data.type, config });
            break;
        case "changeConfig":
            console.log(data.config);
            config.interceptApiCalls = data.config.interceptApiCalls ?? false;
            config.interceptScriptRequests = data.config.interceptScriptRequests ?? false;
            config.webSocketOpeningTimeout = data.config.webSocketOpeningTimeout ?? 5,
            config.requestTimeout = data.config.requestTimeout ?? 15
            console.log("Config changed", config);
            break;
        case "resetWsConnection":
            useWebSocket(wsServerUrl).then(client => {
                wsClient = client;
                console.log("WS connection re-established");
            });
    }
});

// @ts-ignore
self.addEventListener("fetch", (/** @type {FetchEvent} */ event) => {
    const request = event.request;
    const requestUrl = new URL(event.request.url);
    const requestOrigin = requestUrl.origin;
    const requestPathName = requestUrl.pathname;
    const isTheSameOrigin = requestOrigin === self.location.origin;

    if (!isTheSameOrigin || requestPathName.startsWith("/ws")) {
        return;
    }

    console.log(requestPathName);
    
    if (!wsClient?.readyState) {
        return;
    }

    const isScript = [".js", ".ts", ".vue"]
        .some(extension => requestPathName.endsWith(extension));
    if (isScript) {
        return;
        const isMainScript = /\/main\.([A-Za-z0-9]+)\.js/.test(requestPathName);
        if (isMainScript) {
            console.log(config.interceptScriptRequests);
            if (config.interceptScriptRequests === "ExcludeMainJs") {
                console.log("ExcludeMainJs");
                return;
            }

            if (config.interceptScriptRequests === "MainJsAsArrayBuffer") {
                console.log("MainJsAsArrayBuffer");
                return event.respondWith((async () => {
                    return wsClient.requestMainJsAsArrayBufferAsync(
                        requestPathName,
                        Object.fromEntries(request.headers.entries()),
                        request.credentials);
                })());
            }
        }

        console.log("Intercepting script:", requestPathName);
        return event.respondWith((async () => {
            return wsClient.requestAsync(
                requestPathName,
                request.method,
                Object.fromEntries(request.headers.entries()),
                await request.json().catch(() => ""),
                request.credentials)
            })());
    }
    
    if (requestPathName.startsWith("/api") && config.interceptApiCalls) {
        const isAuthCall = requestPathName.startsWith("/api/authentication/");
        if (isAuthCall && config.interceptApiCalls !== "IncludeAuthCalls") {
            return;
        }

        console.log("Intercept api call:", requestPathName);
        event.respondWith((async () => {
            return wsClient.requestAsync(
                requestPathName,
                request.method,
                Object.fromEntries(request.headers.entries()),
                await request.json().catch(() => ""),
                request.credentials)
            })());
    }
});

/**
 * Establish a new websocket connection to the specified server.
 * 
 * @param {string} serverAddress The address of the websocket server.
 * @returns {Promise<WebSocketClient>}
 * An object containing the method the send request as asynchronous operation.
 */
async function useWebSocket(serverAddress) {
    const /** @type {Map<string, (response: Response) => void>} */ pendingRequests = new Map();
    let /** @type {((response: Response) => void) | null} */ pendingMainJsResolve = null;
    return new Promise((connectionResolve, connectionReject) => {
        let socket = new WebSocket(serverAddress);
        
        socket.onopen = () => {
            console.log("Connected to WebSocket server:", serverAddress);
            const /** @type {WebSocketClient} */ client = {
                get readyState() {
                    return socket.readyState;
                },

                get isConnected() {
                    return socket.readyState === WebSocket.OPEN;
                },
    
                async requestAsync(pathName, method, headers, body, credentials) {
                     /** @type {string} */
                    const requestId = crypto.randomUUID();

                    /** @type {Promise<Response>} */
                    const responsePromise = new Promise((resolve, reject) => {
                        pendingRequests.set(requestId, resolve);
                        setTimeout(() => {
                            if (pendingRequests.has(requestId)) {
                                reject("Request timeout");
                            }
                        }, config.requestTimeout);
                    });
                    
                    send(JSON.stringify({
                        requestId,
                        pathName,
                        method,
                        headers,
                        body,
                        credentials }));
                    return responsePromise;
                },

                async requestMainJsAsArrayBufferAsync(pathName, headers, credentials) {
                    console.log("MainJsAsArrayBuffer");
                    /** @type {string} */
                    const requestId = "MainJsAsArrayBuffer";
                    
                    /** @type {Promise<Response>} */
                    const responsePromise = new Promise((resolve, reject) => {
                        pendingMainJsResolve = resolve;
                        setTimeout(() => {
                            if (pendingRequests.has(requestId)) {
                                reject("Request timeout");
                            }
                        }, config.requestTimeout);
                    });
                    
                    
                    send(JSON.stringify({
                        requestId,
                        pathName,
                        method: "GET",
                        headers,
                        body: null,
                        credentials }));
                    return responsePromise;
                }
            }
    
            return connectionResolve(client);
        };
    
        socket.onmessage = (/** @type {MessageEvent} */event) => {
            if (typeof event.data === "string") {
                const /** @type {ResponseMessage} */ responseMessage = JSON.parse(event.data);
                if (responseMessage?.requestId && pendingRequests.has(responseMessage.requestId)) {
                    const responseResolve = pendingRequests.get(responseMessage.requestId);
                    // @ts-ignore
                    responseResolve(new Response(responseMessage.body, {
                        status: responseMessage.status,
                        headers: new Headers(responseMessage.headers),
                    }));
                    pendingRequests.delete(responseMessage.requestId);
                }
                return;
            }

            const startTime = Date.now();
            const /** @type {ArrayBuffer} */ fileBuffer = event.data;
            const response = new Response(fileBuffer);
            console.log(Date.now() - startTime);
            // @ts-ignore
            pendingMainJsResolve(response);
            pendingMainJsResolve = null;
        };
    
        socket.onerror = (event) => {
            console.error("WebSocket error:", event);
        };
    
        socket.onclose = () => {
            console.warn("WebSocket closed. Attempting to reconnect ");
            let retryCount = 0;
            const interval = setInterval(() => {
                if (socket.readyState !== WebSocket.OPEN) {
                    console.log(`Attempting to reconnect (attepmt ${retryCount + 1}) ...`);
                    socket = new WebSocket(serverAddress);
                    retryCount++;
                } else {
                    clearInterval(interval);
                }
            }, 3000);
        };

        setTimeout(() => {
            if (socket.readyState !== WebSocket.OPEN) {
                socket.close();
                connectionReject("Connection timeout");
            }
        }, config.webSocketOpeningTimeout);
    
        const send = (/** @type {string} */ message) => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(message);
            } else {
                console.warn("WebSocket is not open. Message not sent.");
            }
        }
    });
}
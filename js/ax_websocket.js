/**
 * Copyright 2021-2022 AVerMedia Technologies Inc. and respective authors and developers.
 * This source code is licensed under the MIT-style license found in the LICENSE file.
 *
 * https://github.com/AVerMedia-Technologies-Inc/CreatorCentralSDK/blob/main/RegistrationFlow.md
 */

window.AVT_CREATOR_CENTRAL;

WebSocket.prototype.sendJSON = function(json) {
    this.send(JSON.stringify(json));
};

class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return () => this.removeListener(event, listener);
    }
    
    removeListener(event, listener) {
        if (typeof this.events[event] === 'object') {
            const idx = this.events[event].indexOf(listener);
            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }
    
    emit(event, ...args) {
        if (typeof this.events[event] === 'object') {
            this.events[event].forEach(listener => listener.apply(this, args));
        }
    }
    
    once(event, listener) {
        const remove = this.on(event, (...args) => {
            remove();
            listener.apply(this, args);
        });
    }
};

const AVT_CREATOR_CENTRAL_API_V2 = {
    send: function (apiType, payload, widget, uuid) {
        let context = uuid != null ? uuid: AVT_CREATOR_CENTRAL.uuid;
        let pl = {
            event : apiType,
            context : context
        };
        if (payload) {
            pl.payload = payload;
        }
        if (widget) {
            pl.widget = widget;
        }

        AVT_CREATOR_CENTRAL.connection && AVT_CREATOR_CENTRAL.connection.sendJSON(pl);
    },

    setWidgetSettings: function(widget, uuid, payload) {
        AVT_CREATOR_CENTRAL_API_V2.send('setWidgetSettings', payload, widget, uuid);
    },
    setPackageSettings: function(pkg, payload) {
        let settings = {"settings":payload};
        AVT_CREATOR_CENTRAL_API_V2.send('setPackageSettings', settings, null, pkg);
    },
    getPackageSettings: function() {
        AVT_CREATOR_CENTRAL_API_V2.send('getPackageSettings');
    },
    changeActionEffect: (widget, uuid, effect, image) => {
        let payload = { "type": effect };
        if (image != null) payload["image"] = image;
        AVT_CREATOR_CENTRAL_API_V2.send('changeActionEffect', payload, widget, uuid);
    },
    setWidgetEnabled: (widget, uuid, enabled) => {
        //console.log(`[${widget}][${uuid}] setWidgetEnabled: ${enabled}`);
        AVT_CREATOR_CENTRAL_API_V2.changeActionEffect(widget, uuid, enabled ? "clear" : "invalid");
    },
    setWidgetPressed: (widget, uuid, pressed) => {
        //console.log(`[${widget}][${uuid}] setWidgetPressed: ${pressed}`);
        AVT_CREATOR_CENTRAL_API_V2.changeActionEffect(widget, uuid, pressed ? "press" : "clear");
    },
    sendToPropertyView: (widget, uuid, payload) => {
        AVT_CREATOR_CENTRAL_API_V2.send('sendToPropertyView', payload, widget, uuid);
    },
    sendToPackage: (widget, payload) => {
        AVT_CREATOR_CENTRAL_API_V2.send('sendToPackage', payload, widget);
    },
    openUrl: (url) => {
        let payload = {"url": url};
        AVT_CREATOR_CENTRAL_API_V2.send('openUrl', payload);
    },
    
    // below are callbacks waiting to be implemented
    onPackageSettings: (payload) => {
        console.log(`[package] settings: ${JSON.stringify(payload)}`);
    },
    onWidgetSettings: (widget, uuid, payload) => {
        console.log(`[widget] settings: ${widget}(${uuid}): ${JSON.stringify(payload)}`);
    },
    onWidgetStart: (widget, uuid, state) => {
        console.log(`[widget] start: ${widget}(${uuid}) (state=${state})`);
    },
    onWidgetStop: (widget, uuid, state) => {
        console.log(`[widget] stop: ${widget}(${uuid}) (state=${state})`);
    },
    onWidgetActionDown: (widget, uuid, state) => {
        console.log(`DOWN ${widget}(${uuid})(state=${state})`);
    },
    onWidgetActionUp: (widget, uuid, state) => {
        console.log(`UP ${widget}(${uuid})(state=${state})`);
    },
    onWidgetTrigger: (widget, uuid, state) => {
        console.log(`CLICK ${widget}(${uuid})(state=${state})`);
    },
    onPackageMessage: (widget, uuid, payload) => {
        console.log(`onPackageMessage: ${widget}(${uuid}): ${JSON.stringify(payload)}`);
    },
    onPropertyMessage: (widget, uuid, payload) => {
        console.log(`onPropertyMessage: ${widget}(${uuid}): ${JSON.stringify(payload)}`);
    },
    
    // add this at the bottom, internal connection callback
    onAppConnected: (port, uuid, packageInfo, widgetInfo) => {
        console.log(`create a new WebSocket with port ${port} to ${uuid}`);
    }
};

// main
AVT_CREATOR_CENTRAL = (function() {
    function parseJson (jsonString) {
        if (typeof jsonString === 'object') return jsonString;
        try {
            const o = JSON.parse(jsonString);
            if (o && typeof o === 'object') {
                return o;
            }
        } catch (e) {}
        return false;
    }

    function init() {
        let inPort, inUuid, inEvent, inPackageInfo, inWidgetInfo;
        let websocket = null;
        let events = new EventEmitter();
        let timer = 0; // AME-4552

        function connect(port, uuid, event, info, widgetInfo) {
            inPort = port;
            inUuid = uuid;
            inEvent = event;
            inPackageInfo = info;
            inWidgetInfo = widgetInfo;
            
            websocket = new WebSocket(`ws://localhost:${inPort}`);

            websocket.onopen = function() {
                if (timer != 0) clearTimeout(timer); // clear timeout when connected

                let json = {
                    event : inEvent,
                    uuid: inUuid
                };
                websocket.sendJSON(json);
                
                AVT_CREATOR_CENTRAL.uuid = inUuid;
                AVT_CREATOR_CENTRAL.connection = websocket;
                
                events.emit('webSocketConnected', {
                    port: inPort,
                    uuid: inUuid,
                    pkgInfo: inPackageInfo,
                    widget: inWidgetInfo,
                    connection: websocket
                });
            };

            websocket.onerror = function(evt) {
                console.warn('WEBSOCKET ERROR', evt, evt.data);
            };

            websocket.onclose = function(evt) {
                console.warn('error', evt); // Websocket is closed
                delete websocket;
                websocket = null;
                timer = setTimeout(reconnect, 5000); // set reconnection check
            };

            websocket.onmessage = function(evt) {
                if (evt.data) {
                    let jsonObj = parseJson(evt.data);
                    events.emit(jsonObj.event, jsonObj);
                }
            };
        }

        // AME-4552, not a good solution. FIXME: use event trigger, not polling.
        function reconnect() {
            timer = setTimeout(reconnect, 5000); // add another timeout check
            console.log(`try to reconnect WebSocket (${timer})`);
            return connect(inPort, inUuid, inEvent, inPackageInfo, inWidgetInfo); // connect again
        }

        return {
            connect: connect,
            on: (event, callback) => events.on(event, callback),
            emit: (event, callback) => events.emit(event, callback)
        };
    }

    return init();
})();

/**
 * WebSocket connected
 */
AVT_CREATOR_CENTRAL.on('webSocketConnected', data => {
    let port = data["port"];
    let uuid = data["uuid"];
    let pkgInfo = data["pkgInfo"];
    let widgetInfo = data["widget"];
    AVT_CREATOR_CENTRAL_API_V2.onAppConnected(port, uuid, pkgInfo, widgetInfo);
});

/**
 * Event received after sending the getWidgetSettings event to retrieve 
 * the persistent data stored for the widget.
 */
AVT_CREATOR_CENTRAL.on('didReceiveWidgetSettings', data => {
    let widget = data["widget"];
    let uuid = data["context"];
    let payload = data["payload"];
    AVT_CREATOR_CENTRAL_API_V2.onWidgetSettings(widget, uuid, payload);
});

/**
 * Event received after sending the getPackageSettings event to retrieve 
 * the persistent data stored for the Package.
 */
AVT_CREATOR_CENTRAL.on('didReceivePackageSettings', data => {
    let payload = {};
    if (data["payload"] != null && data["payload"]["settings"] != null) {
        payload = data["payload"]["settings"];
    } 
    AVT_CREATOR_CENTRAL_API_V2.onPackageSettings(payload);
});

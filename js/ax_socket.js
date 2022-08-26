window.AVT_CREATOR_CENTRAL;
window.REQUEST_SEQ_ID = 0;
window.PLUGIN_UUID;
window.WIDGET = '';
window.Utils = {};

Utils.parseJson = function(jsonString) {
  if (typeof jsonString === 'object') return jsonString;
  try {
    const o = JSON.parse(jsonString);
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {}
  return false;
};

function connectCreatorCentral(port, UID, inRegisterEvent, inInfo, inActionInfo) {
  PLUGIN_UUID = UID;
  if(inActionInfo) {
    WIDGET = inActionInfo.widget;
    AVT_CREATOR_CENTRAL.connect(port, UID, inRegisterEvent, inInfo, inActionInfo);
  }else{
    AVT_CREATOR_CENTRAL.connect(port, UID, inRegisterEvent, inInfo);
  }
}

WebSocket.prototype.sendJSON = function(jsn, log) {
  if (log) {
    console.log('SendJSON', this, jsn);
  }
  this.send(JSON.stringify(jsn));
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

const AVT_CREATOR_CENTRAL_API = {
  queue : {},
  send: function (apiType, payload, widget) {
    console.log(PLUGIN_UUID);
    let pl = {
      event : apiType,
      context : PLUGIN_UUID
    };
    if(payload) {
      pl.payload = payload;
    }
    if(widget) {
      pl.widget = widget;
    }

    AVT_CREATOR_CENTRAL.connection && AVT_CREATOR_CENTRAL.connection.sendJSON(pl);
  },
  setWidgetSettings : function(payload) {
    AVT_CREATOR_CENTRAL_API.send('setWidgetSettings', payload);
  },
  getWidgetSettings: function() {
    AVT_CREATOR_CENTRAL_API.send('getWidgetSettings');
  },
  setPackageSettings : function(payload) {
    AVT_CREATOR_CENTRAL_API.send('setPackageSettings', payload);
  },
  getPackageSettings: function() {
    AVT_CREATOR_CENTRAL_API.send('getPackageSettings');
  },
  changeTitle : function(payload) {
    AVT_CREATOR_CENTRAL_API.send('changeTitle', payload);
  },
  changeImage: function (payload) {
    AVT_CREATOR_CENTRAL_API.send('changeImage', payload);
  },
  changeState: (payload) => {
    AVT_CREATOR_CENTRAL_API.send('changeState', payload);
  },
  sendToPackage: (payload) => {
    AVT_CREATOR_CENTRAL_API.send('sendToPackage', payload, WIDGET);
  },
  sendToPropertyView: (payload) => {
    AVT_CREATOR_CENTRAL_API.send('sendToPropertyView', payload);
  },
};

function debugLog(data) {
  if(typeof data !== 'string') {
    console.log(JSON.stringify(data, null, 10).replace(/"/g,'\''))
  }else{
    console.log(data);
  }
}

//main
AVT_CREATOR_CENTRAL = (function() {

  function init() {
    let inPort,
      inUUID,
      inMessageType,
      websocket = null;

    let events = new EventEmitter();
    function connect(port, UID, inRegisterEvent, inInfo, inWidgetInfo) {
      inPort = port;
      inUUID = UID;
      inMessageType = inRegisterEvent;
      websocket = new WebSocket('ws://127.0.0.1:' + inPort);

      websocket.onopen = function() {
        var json = {
          event : inRegisterEvent,
          uuid: inUUID
        };
        AVT_CREATOR_CENTRAL_API.queue[REQUEST_SEQ_ID] = inMessageType + '.result';
        websocket.sendJSON(json);
        AVT_CREATOR_CENTRAL.uuid = inUUID;
        AVT_CREATOR_CENTRAL.connection = websocket;
        events.emit('connected', {
          connection: websocket,
          port: inPort,
          uuid: inUUID
        });
      };

      websocket.onerror = function(evt) {
        console.warn('WEBOCKET ERROR', evt, evt.data);
      };

      websocket.onclose = function(evt) {
        // Websocket is closed
        console.warn('error', evt);
      };

      websocket.onmessage = function(evt) {
        if(evt.data) {
          let jsonObj = Utils.parseJson(evt.data);
          events.emit(jsonObj.event, jsonObj);
        }
      };

    }

    return {
      connect: connect,
      uuid: inUUID,
      on: (event, callback) => events.on(event, callback),
      emit: (event, callback) => events.emit(event, callback),
      connection: websocket
    };
  }

  return init();
})();

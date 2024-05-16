const express = require('express');
const ws = require('ws');

let websocket_sv_main = {}

websocket_sv_main.start = async function(){
  websocket_sv_main.router = express.Router();
}

websocket_sv_main.init = function(app , collection){
    websocket_sv_main.wss = new ws.WebSocketServer(app);
    wss.on('connection', function connection(ws) {
        ws.on('message', function message(data) {
            console.log('received: %s', data);
        });
        
        ws.send('something');
    });
}

module.exports = websocket_sv_main;




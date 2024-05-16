const express = require('express');
const ws = require('ws');

let websocket_sv_main = {
    data : []
}

// actid : 0-handshake , 1-tick
// evid : 0-send message

websocket_sv_main.start = async function(){
  websocket_sv_main.router = express.Router();
}

websocket_sv_main.init = function(app , collection){
    websocket_sv_main.wss = new ws.WebSocketServer({port : 5001});
    websocket_sv_main.wss.on('connection', function connection(ws) {

        websocket_sv_main.data.push({
            ws : ws,
            tick : new Date()
        })

        console.table(websocket_sv_main.data)

        ws.on('message', function message(data) {
            data = JSON.parse(data);

            // handshake
            if(data.actid == 0){
                for(const inst of websocket_sv_main.data){
                    if (inst.ws == ws) {
                        const userInfo = collection['user_session_helper.js'].fetchUserDataFromSession({
                            collection : collection,
                            user_session_tkn : data['user_session_tkn']
                        })[0][0]
                        if(!userInfo){
                            ws.close();
                            return
                        }
                        inst.userInfo = userInfo
                        break;
                    }
                }
                return;
            }

            // tick
            if(data.actid == 1){
                for(const inst of websocket_sv_main.data){
                    if (inst.ws == ws) {
                        inst.tick = new Date();
                        break;
                    }
                }
            }

            // event
            if(data.actid == 2){
                if(data.evid == 0){
                    
                    return;
                }
            }
            
        });
    });

    setInterval(() => {
        for (const [index, inst] of websocket_sv_main.data.entries()) {
            if (Math.floor((new Date() - inst.tick) / 1000) > 1) {
                inst.ws.close();
                websocket_sv_main.data.splice(index, 1); // Remove the entry from the array
            }
        }        

        console.table(websocket_sv_main.data)
    }, 1000);
}

module.exports = websocket_sv_main;




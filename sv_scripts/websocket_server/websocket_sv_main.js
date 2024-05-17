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


        ws.on('message', async function message(data) {

            try{
                data = JSON.parse(data);
            }catch(err){
                ws.close();
                return;
            }
            
            // handshake
            if(data.actid == 0){
                for(const inst of websocket_sv_main.data){
                    if (inst.ws == ws) {
                        try {
                            const userInfo = await collection['user_session_helper.js'].fetchUserDataFromSession({
                                collection : collection,
                                user_access_tkn : data['user_access_tkn']
                            })
                            if(!userInfo){
                                ws.close();
                                return
                            }
                            inst.userInfo = userInfo[0][0];
                            inst.receptor = data.receptor;
                        }catch(err){
                            ws.close();
                        }
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

            // message
            if(data.actid == 2){
                try{
                    for(const inst1 of websocket_sv_main.data){
                        if (inst1.ws == ws) {
                            for(const inst2 of websocket_sv_main.data){
                                console.log(123);
                                if (inst1.receptor == inst2.userInfo.username) {
                                    console.log("mesaj");
                                    inst2.ws.send(JSON.stringify({msg : data.msg}))
                                    break;
                                }
                            }
    
                            break;
                        }
                    }
                }catch{

                }
                return;
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




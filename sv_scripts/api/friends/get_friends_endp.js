const express = require('express');

let get_friends_endp = {}

get_friends_endp.start = async function(){
  get_friends_endp.router = express.Router();
}

get_friends_endp.init = function(app , collection){

  get_friends_endp.router.get('/get', async function(req, res){
    if(!req.cookies['user_access_tkn']) return res.status(404).send({err:'nousr'});
    try{ 

        let cuserinfo = await collection['user_session_helper.js'].fetchUserDataFromSession({
            collection : collection,
            user_access_tkn : req.cookies['user_access_tkn']
        })
        cuserinfo = cuserinfo[0][0];

        let response = [];

        let usernodes = await collection['dbhelper.js'].conn.execute(
            'SELECT * FROM `user_nodes` WHERE `u1` = ? AND `status` = 1',
            [cuserinfo.id]
        )
        usernodes = usernodes[0]

        for (let node of usernodes) {
            let requestingUserData = await collection['dbhelper.js'].conn.execute(
                'SELECT * FROM `user_data` WHERE `id` = (?)',
                [node.u2]
            );
            requestingUserData = requestingUserData[0][0];
            requestingUserData.password = undefined;
            requestingUserData.email = undefined;
            response.push(requestingUserData);
        }
        
        usernodes = await collection['dbhelper.js'].conn.execute(
          'SELECT * FROM `user_nodes` WHERE `u2` = ? AND `status` = 1',
          [cuserinfo.id]
        )
        usernodes = usernodes[0]

        for (let node of usernodes) {
          let requestingUserData = await collection['dbhelper.js'].conn.execute(
              'SELECT * FROM `user_data` WHERE `id` = (?)',
              [node.u1]
          );
          requestingUserData = requestingUserData[0][0];
          requestingUserData.password = undefined;
          requestingUserData.email = undefined;
          console.log(requestingUserData);
          response.push(requestingUserData);
        }

        res.status(200).send(response);
        
    }catch(err){
        console.log(err.message);
        res.status(500).end();
    }
  })
  
  app.use("/api/friends" , get_friends_endp.router)
}

module.exports = get_friends_endp;




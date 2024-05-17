const express = require('express');

let get_friend_requests = {}

get_friend_requests.start = async function(){
  get_friend_requests.router = express.Router();
}

get_friend_requests.init = function(app , collection){

  get_friend_requests.router.get('/getrequests', async function(req, res){
    if(!req.cookies['user_access_tkn']) return res.status(404).send({err:'nousr'});
    try{ 

        let cuserinfo = await collection['user_session_helper.js'].fetchUserDataFromSession({
            collection : collection,
            user_access_tkn : req.cookies['user_access_tkn']
        })
        cuserinfo = cuserinfo[0][0];


        let usernodes = await collection['dbhelper.js'].conn.execute(
            'SELECT * FROM `user_nodes` WHERE `u2` = (?) AND `status` = 0',
            [cuserinfo.id]
        )
        usernodes = usernodes[0]

        let response = [];
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
  
  app.use("/api/friends" , get_friend_requests.router)
}

module.exports = get_friend_requests;




const express = require('express');

let add_friends_endp = {}

add_friends_endp.start = async function(){
  add_friends_endp.router = express.Router();
}

add_friends_endp.init = function(app , collection){

  add_friends_endp.router.post('/add', async function(req, res){
    console.log(req.body.targetUser);

    let valid = true;
    if(!req.cookies['user_access_tkn']) valid = false;
    if(!req.body.targetUser) valid = false;
    if(!valid){
        res.status(401).send();
        return;
    }  
    try
    {
        let userData = await collection['user_session_helper.js'].fetchUserDataFromSession({
            user_access_tkn : req.cookies['user_access_tkn'],
            collection : collection
        });
        if(!userData) return res.status(404).send({
            msg : 'not authed'
        });

        let targetUserData = await collection['dbhelper.js'].conn.execute(
            'SELECT * FROM `user_data` WHERE `username` = (?)',
            [req.body.targetUser]
        )

        if(!targetUserData) return res.status(404).send({
            msg : 'not found user'
        });

        let cNode = await collection['dbhelper.js'].conn.execute(
            'SELECT * FROM `user_nodes` WHERE (`u1` = (?) AND `u2` = (?)) OR (`u1` = (?) AND `u2` = (?))',
            [userData[0][0].id , targetUserData[0][0].id, targetUserData[0][0].id ,userData[0][0].id]
        );

        console.log(userData[0][0].id , targetUserData[0][0].id);
        console.log(cNode);

        if(!cNode[0][0]){// send request
            cNode = await collection['dbhelper.js'].conn.execute(
                'INSERT INTO `user_nodes` (`u1` , `u2`) VALUES (?,?)',
                [userData[0][0].id , targetUserData[0][0].id]
            );
            res.end();
            return
        }else{
            if(cNode[0][0].u2 == userData[0][0].id){ // accept request
                await collection['dbhelper.js'].conn.execute(
                    'UPDATE `user_nodes` SET `status` = 1 WHERE `id` = ?',
                    [cNode[0][0].id]
                );
            }
        }

        res.end();

    }catch(err){
        console.log(err.message);
        res.status(500).end();
    }
  })
  
  app.use("/api/friends" , add_friends_endp.router)
}

module.exports = add_friends_endp;




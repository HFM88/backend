const express = require('express');
const bcrypt = require('bcrypt')

let user_info_endp = {}

user_info_endp.start = async function(){
  user_info_endp.router = express.Router();
}

user_info_endp.init = function(app , collection){

  user_info_endp.router.get('/get', async function(req, res){
    let valid = true;
    if(!req.body.username) valid = false; 
    if(!valid){ res.status(400).send('Invalid request'); return;}
    //401 for invalid creds
    try{
        let result = await collection['dbhelper.js'].conn.execute(
            'SELECT * FROM `user_data` WHERE `username` = (?)',
            [req.body.username]
        )
        if(!result[0]){res.status(404).send('not found'); return;}
        res.send({
            displayname : result[0][0].displayname,
            username : result[0][0].username,
            joindate : result[0][0].joindate,
            rank : result[0][0].rank,
            feed : result[0][0].feed,
        })
    }catch(err){
        res.status(500).send(JSON.stringify({
            message: 'Internal server error',
            err : err.message
        }));
    }
  })

  user_info_endp.router.post('/setfeed', async function(req, res){
    let valid = true;
    if(!req.body.value) valid = false; 
    if(!req.cookies['user_access_tkn']) valid = false;
    if(!valid){ res.status(400).send('Invalid request'); return;}
    //401 for invalid creds
    try{
       let result = await collection['user_session_helper.js'].fetchUserDataFromSession({
        collection : collection,
        user_access_tkn : req.cookies['user_access_tkn']
       })
       console.log(result);
       if(result[0][0]){
        collection['dbhelper.js'].conn.execute(
            'UPDATE `user_data` SET `feed` = ? WHERE id = ?',
            [req.body.value , result[0][0].id]
        )
        res.status(200).send({msg : 'success'})
       }else {
        res.status(404).send({err : 'no user'})
       }
    }catch(err){
        res.status(500).send(JSON.stringify({
            message: 'Internal server error',
            err : err.message
        }));
    }
  })

  user_info_endp.router.post('/setdisplayname', async function(req, res){
    let valid = true;
    if(!req.body.value) valid = false; 
    if(!req.cookies['user_access_tkn']) valid = false;
    if(!valid){ res.status(400).send('Invalid request'); return;}
    //401 for invalid creds
    try{
       let result = await collection['user_session_helper.js'].fetchUserDataFromSession({
        collection : collection,
        user_access_tkn : req.cookies['user_access_tkn']
       })
       console.log(result);
       if(result[0][0]){
        collection['dbhelper.js'].conn.execute(
            'UPDATE `user_data` SET `displayname` = ? WHERE id = ?',
            [req.body.value , result[0][0].id]
        )
        res.status(200).send({msg : 'success'})
       }else {
        res.status(404).send({err : 'no user'})
       }
    }catch(err){
        res.status(500).send(JSON.stringify({
            message: 'Internal server error',
            err : err.message
        }));
    }
  })
  
  app.use("/api/user" , user_info_endp.router)
}

module.exports = user_info_endp;




const express = require('express');
const bcrypt = require('bcrypt');

let user_register_endp = {}

user_register_endp.start = async function(){
  user_register_endp.router = express.Router();
}

user_register_endp.init = function(app , collection){
  user_register_endp.router.post('/register', async (req, res) => {
    // VALIDATION
    let valid = true;
    if(!req.body.email) valid = false;  if(!req.body.username) valid = false; if(!req.body.password) valid = false;
    if(!valid){ res.status(400).send('Invalid request'); return;}
    try{
      // CHECK FOR USERNAME COEXISTENCE
      const result = await collection['dbhelper.js'].conn.execute('SELECT * FROM `user_data` WHERE username = ?' , [req.body.username]);
      if(result[0].length != 0) {
        res.status(409).send(JSON.stringify({
          message: 'Data conflict'
        }));
        return;
      }
    }catch(err){
      res.status(500).send(JSON.stringify({
        message: 'Internal server error',
        err : err.message
      }));
      return;
    }
    // ACCOUNT CREATION
    try{
      let result = await collection['dbhelper.js'].conn.execute(
        'INSERT INTO `user_data`(`email`, `username`, `password` , `displayname`) VALUES (?, ?, ?, ?)', 
        [req.body.email , req.body.username, await bcrypt.hash(req.body.password , 10) , req.body.username]
      );
      await collection['user_session_helper.js'].appendSessionUser({
        collection : collection,
        id : result[0].insertId,
        res : res
      })
      res.status(200).end();
    }catch(err){
      res.status(500).send(JSON.stringify({
        message: 'Internal server error',
        err : err.message
      }));
    } 
  })
  
  app.use("/api/user" , user_register_endp.router)
}

module.exports = user_register_endp;




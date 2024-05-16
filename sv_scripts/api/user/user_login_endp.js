const express = require('express');
const bcrypt = require('bcrypt')

let user_login_endp = {}

user_login_endp.start = async function(){
  user_login_endp.router = express.Router();
}

user_login_endp.init = function(app , collection){

  user_login_endp.router.post('/login', async function(req, res){
    let valid = true;
    if(!req.body.username) valid = false; if(!req.body.password) valid = false;
    if(!valid){ res.status(400).send('Invalid request'); return;}
    //401 for invalid creds
    try{
        let result = await collection['dbhelper.js'].conn.execute(
            'SELECT * FROM `user_data` WHERE `username` = (?)',
            [req.body.username]
        )
        if(!result[0]){res.status(401).send('Unauthorized'); return;}
        console.log(await bcrypt.compare(req.body.password , result[0][0].password) );
        console.log(result[0][0].password , req.body.password)
        if( ! await bcrypt.compare(req.body.password , result[0][0].password) ){res.status(401).send('Unauthorized'); return;}
        await collection['user_session_helper.js'].appendSessionUser({
          collection : collection,
          id : result[0][0].id,
          res : res
        })
        res.cookie('username' , req.body.username)
        res.status(200).send({
          msg: 'logged in successfuly'
        });
    }catch(err){
        res.status(500).send(JSON.stringify({
            message: 'Internal server error',
            err : err.message
        }));
    }
  })
  
  app.use("/api/user" , user_login_endp.router)
}

module.exports = user_login_endp;




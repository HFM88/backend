const express = require('express');
let user_logout_endp = {}

user_logout_endp.start = async function(){
  user_logout_endp.router = express.Router();
}

user_logout_endp.init = function(app , collection){

  user_logout_endp.router.post('/logout', async function(req, res) {
    if( !req.cookies['user_access_tkn'] ){
        res.status(401).send(JSON.stringify({
            message: 'Unauthorized',
        }));
        return;
    }
    try{
        let user_info = await collection['user_session_helper.js'].fetchUserDataFromSession(
          {
            user_access_tkn : req.cookies['user_access_tkn'],
            collection : collection
          }
        );
        if (!user_info){
          res.status(401).send({
            msg: 'unauthorized'
          })
          return;
        }
        await collection['dbhelper.js'].conn.execute(
            'DELETE FROM `user_sessions` WHERE `target` = (?)',
            [user_info[0][0].id]
        )
        res.clearCookie('user_access_tkn');
        res.status(200).send({
          msg: 'logged out successfully'
        })
        return;
    }catch(ex){
        res.status(500).send({
          msg: 'internal server errors',
          err: ex.message
        })
    }
  })
  
  app.use("/api/user" , user_logout_endp.router)
}

module.exports = user_logout_endp;




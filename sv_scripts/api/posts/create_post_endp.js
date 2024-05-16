const express = require('express');

let create_post_endp = {}

create_post_endp.start = async function(){
  create_post_endp.router = express.Router();
}

create_post_endp.init = function(app , collection){

  create_post_endp.router.post('/create', async function(req, res){
    let valid = true;
    if(!req.body.content) valid = false; if(!req.body.filename) valid = false; if(!req.cookies['user_access_tkn']) valid = false;
    if(!valid){ res.status(400).send('Invalid request'); return;}
    try{
        let cuserinfo = await collection['user_session_helper.js'].fetchUserDataFromSession({
            collection : collection,
            user_access_tkn : req.cookies['user_access_tkn']
        })
        cuserinfo = cuserinfo[0][0];

        await collection['dbhelper.js'].conn.execute(
            'INSERT INTO `user_posts` (`content` , `filename`, `byid`) VALUES (?,?,?)',
            [req.body.content , req.body.filename, cuserinfo.id]
        );

        res.send({msg : "nice"});

    }catch(err){
        res.status(500).send(JSON.stringify({
            message: 'Internal server error',
            err : err.message
        }));
    }
  })
  
  app.use("/api/posts" , create_post_endp.router)
}

module.exports = create_post_endp;




const express = require('express');

let user_get_posts = {}

user_get_posts.start = async function(){
  user_get_posts.router = express.Router();
}

user_get_posts.init = function(app , collection){

  user_get_posts.router.get('/get/:targetUser', async function(req, res){
    
    try{

        let cuserinfo = await collection['dbhelper.js'].conn.execute(
           'SELECT * FROM `user_data` WHERE `username` = (?)',
           [req.params.targetUser]
        );
        cuserinfo = cuserinfo[0][0];

        let postsinfo = await collection['dbhelper.js'].conn.execute(
            'SELECT * FROM `user_posts` WHERE `byid` = (?)',
            [cuserinfo.id]
         );
         postsinfo = postsinfo[0];

        res.send(postsinfo);
    }catch(err){
        res.status(500).send(JSON.stringify({
            message: 'Internal server error',
            err : err.message
        }));
    }
  })
  
  app.use("/api/posts" , user_get_posts.router)
}

module.exports = user_get_posts;




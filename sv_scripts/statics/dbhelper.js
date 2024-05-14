const mysql = require('mysql2/promise');

let dbhelper = {}

dbhelper.start = async function(){
  try{
    dbhelper.conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'main_db'
    });
    console.log("Database connected to with id " + dbhelper.conn.threadId);
  }catch{
    console.warn("Database connection failed")
  }
}

dbhelper.init = function(){}

module.exports = dbhelper;
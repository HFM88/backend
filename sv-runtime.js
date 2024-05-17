// PACKAGES
const express = require('express')
const cookie_parser = require('cookie-parser');
const body_parser = require('body-parser');
const cors = require('cors')

const fs = require('fs');
const path = require('path');

const app = express()
const port = 5000

// MIDDLEWARES
app.use(cookie_parser());
app.use(body_parser.json({ limit: '10mb' }));
app.use(body_parser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the client running on port 3000
  credentials: true, // Allow cookies to be sent
}));
app.use('/cdn' , express.static(path.join(__dirname , '/media')))



// SV SCRIPTS INIT
async function __main(){
  let sv_scripts_col = {};
  async function __init_sv_scripts(path__){
    const sv_scripts_read = fs.opendirSync(path__); let dirent;
    while ((dirent = sv_scripts_read.readSync()) !== null) {
        const entryPath = path.join(dirent.path, dirent.name);
        const stats = fs.statSync(entryPath);
        if (stats.isFile()) {
            let script_class = require(path.join(dirent.path, dirent.name));
            await script_class.start();
            sv_scripts_col[dirent.name] = script_class;
        }else{
            await __init_sv_scripts(path.join(dirent.path, dirent.name));
        }
    }
    sv_scripts_read.closeSync();
  } await __init_sv_scripts(path.join(__dirname , 'sv_scripts'));
  for(const script_classname in sv_scripts_col){
    sv_scripts_col[script_classname].init(app , sv_scripts_col);
  }
} __main();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
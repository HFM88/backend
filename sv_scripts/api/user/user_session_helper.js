let user_session_helper = {}
user_session_helper.start = function(){}
user_session_helper.init = function(app , collection){}

user_session_helper.fetchUserDataFromSession = async function(args){
    //Args : collection , sessid
    let result = await args.collection['dbhelper.js'].conn.execute(
        'SELECT * FROM `user_sessions` WHERE `value` = (?)',
        [args.user_access_tkn]
    )
    if (!result[0][0]) return null;
    result = await args.collection['dbhelper.js'].conn.execute(
        'SELECT * FROM `user_data` WHERE `id` = (?)',
        [result[0][0].target]
    )
    return result;
}

user_session_helper.appendSessionUser = async function(args){
    //Args collection , res , id
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let token = '';
    for (let i = 0; i < 40; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    await args.collection['dbhelper.js'].conn.execute(
        'INSERT INTO `user_sessions` (`target` , `value`, `valid`) VALUES (? , ?, ?)',
        [args.id , token, new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)]
    )
    args.res.cookie('user_access_tkn' , token);
    console.log('send cookie')
    return token;
}

module.exports = user_session_helper;




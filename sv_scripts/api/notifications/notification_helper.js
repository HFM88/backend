let notification_helper = {}
notification_helper.start = function(){}
notification_helper.init = function(app , collection){}

notification_helper.castNotification = async function(args){
    //Args : collection , sessid
    if(args.username && args.forid == undefined) {
        args.forid = await args.collection['dbhelper.js'].conn.execute(
            'SELECT * FROM `user_data` WHERE `username` = (?)',
            [args.username]
        )
        args.forid = args.forid[0][0].id;
    }

    let result = await args.collection['dbhelper.js'].conn.execute(
        'INSERT INTO `user_notifications` (`title` , `content` , `forid`) VALUES (?)',
        [args.title , args.content , args.forid]
    )
 
    return result;
}

module.exports = notification_helper;




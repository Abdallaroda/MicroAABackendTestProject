/*
The helpers file include functions regularly used by 'service.js'
*/

const db = require('../database/db');

module.exports = {
    ignoreHash,
    searchUser
};

//return user without hash
function ignoreHash(user) {
    const { hash, ...otherUserData} = user;
    return otherUserData
}

//return searched user
async function searchUser(emailParams) {
    const user = await db.User.findOne({ where: { email: emailParams } });
    
    if(!user){
        throw `Email: "${emailParams}" is not registered!`;
    }
    else {
        return user;
    }
}
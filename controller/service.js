const db = require('../database/db');
const bcrypt = require('bcrypt');
const config = require('../config.json');
const jsonwebtoken = require('jsonwebtoken');
const helpers = require('./helpers');

module.exports = {
    register,
    authenticate,
    search,
    _delete,
    update
};

async function register(userParams) {
    //check if user already exists
    if(await db.User.findOne({ where: { email: userParams.email } })) {
        throw `Email: "${userParams.email}" is already registered!`
    }
    
    //hash password
    if(userParams.password) {
        userParams.hash = await bcrypt.hash(userParams.password, 10)
    }

    //add user to database
    await db.User.create(userParams);
}

async function authenticate({ email, password}) {
    //get (user + hash) with 'email' from database
    const user = await db.User.scope('includeHash').findOne({ where: { email } });

    //check if email/password is correct
    if(!user || !(await bcrypt.compare(password, user.hash))) {
        throw 'Incorrect email or/and password!'
    }

    //sign token and return (user + token)
    const token = jsonwebtoken.sign({ id: user.id }, config.secret, { expiresIn: '14d' });
    return { ...helpers.ignoreHash(user.get()), token }
}

async function search(emailParams) {
    return await helpers.searchUser(emailParams);
}

async function _delete(emailParams, tokenParams) {
    const user = await helpers.searchUser(emailParams);

    //check if user have admin privileges
    if(tokenParams.role !== 'administrator') {
        throw 'You do not have the user rights to performe this action!'
    }

    await user.destroy();
}

async function update(emailParams, userParams, tokenParams) {
    //get authorized user
    const user = await db.User.findOne({ where: { email: tokenParams.email } });

    //check if url param is present while user is unauthorized
    if(emailParams && user.role !== 'administrator') {
        throw 'Unauthorized'
    }
    
    //hash password if inputed
    if(userParams.password) { 
        userParams.hash = await bcrypt.hash(userParams.password, 10);
    }
    
    //check if user wants to change email
    if(userParams.email){
        //search for inputed email in database
        const otherEmail = db.User.findOne({ where: { email: userParams.email } });

        //check if: email is an argument and not already in use
        const newEmail = userParams.email;

        if(newEmail && (emailParams || user.email) !== newEmail && await otherEmail) {
            throw `Email: "${newEmail}" is already registered by another user!`;
        }
    }

    //check if url param is present and user is authorized
    if(emailParams && user.role == 'administrator') {
        //get target user
        const tgtUser = await helpers.searchUser(emailParams);

        //assign old user new crendentials
        Object.assign(tgtUser, userParams)
        await tgtUser.save();

        return helpers.ignoreHash(tgtUser.get());
    }
    //else if no url param is present
    else {
        //assign old user new crendentials
        Object.assign(user, userParams)
        await user.save();

        return helpers.ignoreHash(user.get());
    }
}

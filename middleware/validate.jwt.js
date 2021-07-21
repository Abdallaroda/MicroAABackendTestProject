const jwt = require("express-jwt");
const { secret } = require('../config.json');
const db = require('../database/db');

module.exports = validateJwt;

function validateJwt() {
    return [
        //authenticate jwt
        jwt({ secret, algorithms: ['HS256'] }),

        //check if user with id exists 
        async (req, res, next) => {
            const user = await db.User.findByPk(req.user.id);

            if(!user) {
                return res.status(401).json({ message: 'Unauthorized'});
            }
            else {
                req.user = user.get();
                next();
            }
            
        }
    ];
}
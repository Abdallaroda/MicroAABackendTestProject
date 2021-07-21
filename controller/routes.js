const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateReq = require('../middleware/validate.req');
const validateJwt = require('../middleware/validate.jwt');
const service = require('./service');
const config = require('../config.json');

//routes
router.post('/register', registerValidation, register);
router.post('/authenticate', authenticateValidation, authenticate);
router.get('/profile', validateJwt(), profile);
router.get('/search/:email', validateJwt(), search);
router.delete('/delete/:email', validateJwt(), _delete);
router.put('/update', validateJwt(), updateValidation, update);
router.put('/update/:email', validateJwt(), updateValidation, update);

module.exports = router;

//validate input from request
function registerValidation(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        role: Joi.string().valid(...config.roles).required(),
        password: Joi.string().min(6).required()
    });
    validateReq(req, next, schema);
}

function authenticateValidation(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    validateReq(req, next, schema);
}

function updateValidation(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        email: Joi.string().email().empty(''),
        role: Joi.string().valid(...config.roles).empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateReq(req, next, schema);
}

//execute query
function register(req, res, next) {
    service.register(req.body)
        .then(() => res.json({ message: `Email: "${req.body.email}" was successfully registered!` }))
        .catch(next);
}

function authenticate(req, res, next) {
    service.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function profile(req, res, next) {
    res.json(req.user)
}

function search(req, res, next) {
    service.search(req.params.email)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    service._delete(req.params.email, req.user)
        .then(() => res.json({ message: `Email: "${req.params.email}" was successfully deleted!` }))
        .catch(next);
}

function update(req, res, next) {
    service.update(req.params.email, req.body, req.user)
        .then(user => res.json(user))
        .catch(next);
}
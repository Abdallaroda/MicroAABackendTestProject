module.exports = validateReq;

function validateReq(req, next, schema) {
    const options = {
        abortEarly: false,  //include all errors
        allowUnknown: true, //ignore unknown keys
        stripUnknown: true  //remove unknown keys
    };

    //validate schema
    const { error, value } = schema.validate(req.body, options);

    if(error) {
        next(error.details.map(errArry => errArry.message).join(', '));
    }
    else {
        req.body = value;
        next();
    }
}
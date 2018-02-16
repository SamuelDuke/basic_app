const jwt = require('jsonwebtoken');
const configMain = require('../config/main');

const User = require('../data_models/user');
const hf = require('../config/helperFunctions');


const generateToken = (user) => {
    return jwt.sign(user, configMain.jwtSecret, {
        expiresIn: configMain.jwtExpiration // in seconds
    });
};

exports.createUser = (req, res, next) => {
    //ToDo add validation on email, password, etc
    User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
    }).save()
        .then(user => {
            res.status(201).json(hf.jsonResponse.success(null))
        })
        .then(null, err => {
            const response = hf.mongoError.handler(err);
            if (response !== null){
                return res.status(422).json(hf.jsonResponse.fail(response))
            }
            return next(err);
        })
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}).exec()
        .then(user => {
            if (user === null) {
                res.status(422).json(hf.jsonResponse.error({email: 'That is not a valued email.'}));
            }
            if (user.validPassword(req.body.password)) {
                const responseData = {
                    token: 'Bearer ' + generateToken(user.infoToSend()),
                    user: user.infoToSend()
                };
                res.status(200).json(hf.jsonResponse.success(responseData));
            } else {
                res.status(422).json(hf.jsonResponse.error({password: 'The password was not entered correctly'}));
            }
        }).then(null, err => { return next(err); })
};
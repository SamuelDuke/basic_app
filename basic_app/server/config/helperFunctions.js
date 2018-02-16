const _ = require('lodash');

const objectToSend = (err) => {
    let objectToSend = {};
    const errors = err.errors;

    for (let error in errors) {
        _.assign(objectToSend, {
            [error]: errors[error].message
        });
    }

    return objectToSend;
};

const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';


module.exports = {
    jsonResponse: {
        success: (data) => {
            let response = {
                status: SUCCESS,
                data: data
            };
            return response;
        },
        fail: (failureReasons) => {
            let response = {
                status: FAIL,
                data: failureReasons
            };
            return response;
        },
        error: (errorMessage) => {
            let response = {
                status: ERROR,
                message: errorMessage
            };
            return response;
        }
    },
    mongoError: {
        handler: (err) => {
            let errorResponse = {};

            switch (err.name) {
                case 'ValidationError':
                    errorResponse = objectToSend(err);
                    break;

                // todo See if there is another time this error will happen not dealing with email.
                case 'BulkWriteError':
                    errorResponse = {email: "That email is already in the system."};
                    break;

                default:
                    errorResponse = null;
            }
            return errorResponse;
        }
    }

};
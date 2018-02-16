const express = require('express');
const passport = require('passport');

const passportStrategy = require('./config/passport');
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {
    passportStrategy(app);

    const authRoutes = express.Router();
    const apiRoutes = express.Router();
    const userRoutes = express.Router();

    const AuthController = require('./controllers/auth');
    const UserController = require('./controllers/user');

    // Auth Routes
    authRoutes.post('/login', AuthController.login);
    authRoutes.post('/register', AuthController.createUser);
    app.use('/auth', authRoutes);

    // User Routes

    userRoutes.get('/', UserController.getAllUsers);
    userRoutes.post('/', UserController.createUser);
    userRoutes.get('/:id', UserController.getUser);

    apiRoutes.use('/users', userRoutes);

    // Error Handlers
    apiRoutes.use((req, res, next) => {
        res.status(404);
    return res.json({status: 'error', message: 'No resource with that ID'});
});

    //todo Rewrite error routes
    apiRoutes.use((err, req, res, next) =>{
        switch (err.name) {
    case 'CastError':
        res.status(400);
        console.log(" The Error is: ", err);
        return res.json({status: 'error', message: err.message});

    case 'MongoError':

    default:
        res.status(500);
        console.log(" The Error is: ", err);
        return res.json({status: 'error', message: err.message});
    }
});

    app.use('/api', requireAuth, apiRoutes);
};
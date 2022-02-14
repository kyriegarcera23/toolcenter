const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

exports.authentication = (req, res, next) => {
    if (!req.session.jwt)
    {
        return res.status(401).send({ authenticated: false, message: 'Failed Authentication.' });
    }

    try {
        jwt.verify(req.session.jwt, process.env.SECRET_KEY, function(err, decoded) {
            if (err)
            {
                return res.status(500).send({ authenticated: false, message: 'Failed Authentication.' });
            }
            else
            {
                res.locals.decoded = decoded;
            }
        });
    } catch (err) {
        // No current action
    }

    next();
}
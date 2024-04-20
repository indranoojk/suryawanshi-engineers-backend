require('dotenv').config();
var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const fetchadmin = (req, res, next) => {
    // Get the user from the token and add id to req object
    const token = req.header('auth-token');
    if(!token){
        // Status 401 : Access Denied
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.admin = data.admin;
        next();
    } catch(error) {
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
}

module.exports = {fetchadmin};
const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyToken = (req, res, next) => {

    const token = req.headers['x-auth-token'];
    // console.log(token);
    
  

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {

        if(err){
            console.log(err);
            
            res.status(403).json(err);
        }else{
            req.user = payload;
            next();
        }
    })
}

module.exports = verifyToken;
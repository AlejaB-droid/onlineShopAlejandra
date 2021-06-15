const jwt = require("jsonwebtoken");

const auth = async(req, res, next) => {
    let jwtTk = req.header("Authorization");
    if(!jwtTk){
        return res.status(402).send("Invalid process: there is no token");
    };

    jwtTk = jwtTk.split(" ")[1];
    if(!jwtTk){
        return res.status(402).send("Invalid process: there is no token");
    };

    try{
        const payload = await jwt.verify(jwtTk, process.env.SECRET_KEY_JWT);
        req.user = payload;
        next();
    }catch(error){
        res.status(402).send("Invalid process: invalid token");
    };
};

module.exports = auth;
const upload = (req, rez, next) => {
    if(req.files.image.type){
        let type = req.files.image.type;
        if(
            type !== "image/png" &&
            type !== "image/jpg" &&
            type !== "image/jpeg"
        ){
            return res.status(401).send("The accepted formats are .png, .jpg & jpeg");
        }else{
            next();
        };
    }else{
        next();
    };
};

module.exports = upload;
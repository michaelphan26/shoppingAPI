function errorHandler(err, req, res, next){
    if(err.statusCode==500){
        res.status(500).send("Something is wrong");
    }
    else res.status(err.statusCode).send(err.message)
}

module.exports=errorHandler
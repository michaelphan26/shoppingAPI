function AsyncMiddleware(handler){
    return async (req, res, next)=>{
        try{
            await handler(req, res);
        }
        catch(err){
            next(err)
        }
    }
}

modules.exports=AsyncMiddleware
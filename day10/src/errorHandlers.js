const badRequestHandler = (err,req,res,next)=>{
    if(err.httpStatusCode === 400){
        res.status(400).send(err.mesage)
    }
    next(err)
}


const forbiddenHandler = (err,req,res,next)=>{
  if(err.httpStatusCode===403){
      res.status(403).send(err.mesage||"Forbidden")
  }
  next(err)  
}

const notFoundHandler = (err,req,res,next)=>{
    if (err.httpStatusCode === 404){
     res.status(404).send(err.mesage || "Resource not found!")   
    }
    next(err)
}

const genericErrorHandler = (err,req,res,next)=>{
if(!res.headersSent){
res.status(err.httpStatusCode||500).send(err.mesage)
}
} 


module.exports={
badRequestHandler,
forbiddenHandler,
notFoundHandler,
genericErrorHandler
}



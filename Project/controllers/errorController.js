const mongoose=require("mongoose")
const appError = require("../utils/appErrors");
//for developers
function sendDevData(res, err) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Failed";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
  });
}
//for clients
function sendProdData(res, err) {
  
  //operational errors are errors set by custom appError
  if (err.isOperational) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Failed";
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //programmatical errors are errors thrown by mongoose required fields like rating must be less than 10
  else {
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Failed";
    res.status(err.statusCode).json({
      status: err.status,
      message: err,
    });
  }
}

//CastError by DB like in id route giving 'llllll' instead of mongoose id gives below error.
// "Cast to ObjectId failed for value \"lllllll\" (type string) at path \"_id\" for model \"tour\"" is the default message.so we are manipulating error object
//our custom appError.then we return the custom error ad store it in error and sending it to globalErrorHandler to send the response to client.
function handleCastErrorDB(error) {
  let message = `Invalid value ${error.value} for ${error.path}`;
  return new appError(message, 400);
}

//Duplicate Error
function handleDuplicateErrorDB(error) {
  const duplicatedField = Object.keys(error.keyValue)[0];
  let message = `${duplicatedField} already exists for value ${error.keyValue[duplicatedField]}`;
  return new appError(message, 400);
}

//Validation Error
function handleValidationErrorDB(error)
{
    
    let message=Object.values(error.errors);
    message=message.map((item)=>{
        return item.message;
    })
    return new appError(message, 400);
}
//JsonWebTokenError 
function handleJsonWebTokenError(error)
{
    let message='Data Token Manipulated';
    return new appError(message,401);
}
//JwtTokenExpiredError
function handleJwtTokenExpiredError(error)
{
    let message='Timer Expired,Please Login again';
    return new appError(message,401);
}

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendDevData(res, err);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);
    //Cast errors
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    //Duplicate errors
    else if (error.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }
    //Validation Error
    else if(error.name==='ValidationError')
    {
        error=handleValidationErrorDB(error);
    }
    else if(error.name==='JsonWebTokenError')
    {
       error=handleJsonWebTokenError(error);
    }
    else if(error.name==='TokenExpiredError')
    {
       error=handleJwtTokenExpiredError(error);
    }
  
    

    sendProdData(res, error);
  }
};


//Normal way of handling errors
 // if (error instanceof mongoose.Error.ValidationError) {
    //     return res.json({Validationerror: error.message});
    // } else if (error instanceof mongoose.Error.CastError) {
    //       return res.json({Casterror: error.message});
    // } else if (error.code === 11000) {
    //       return res.json({Duplicatekeyerror: error.message});
    // } else {
    //     return res.json({Othererror: error});
    //   }
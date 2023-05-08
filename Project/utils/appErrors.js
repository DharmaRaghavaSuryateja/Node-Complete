class appError extends Error
{
    constructor(message,statusCode)
    {
      super(message);
      this.statusCode=statusCode;
      this.isOperational=true;
      this.status=(statusCode+'').startsWith('4')?'Client Error':'Failed'
    }
}
module.exports=appError;
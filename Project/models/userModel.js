const mongoose = require("mongoose");
const crypto=require('crypto');
const bcrypt=require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: {
      value: true,
      message: "A User must have a Name",
    },
    minlength: [5, "Name Must be greater than 5 characters"],
    maxlength: [15, "Name Must be less than 15 characters"],
  },
  email: {
    type: String,
    trim: true,
    required: {
      value: true,
      message: "A User must have a E-mail",
    },
    unique: true,
    validate: {
      validator: function (value) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(value);
      },
      message: "Email should match abc@def.ghi",
    },
    minlength: [5, "Email Must be greater than 5 characters"],
    maxlength: [25, "Email Must be less than 25 characters"],
  },
  photo: String,
  role:
  {
    type:String,
    enum:{
        values:['admin','user','lead-guide','guide'],
        message:'Must be admin or user or tourguide or lead-tourguide'
    },
    default:'user'
  },
  password: {
    type: String,
    required: [true, "Password is Must"],
    trim: true,
    validate: {
      validator: function (value) {
        return /^(?=.*[!@#$%^&*()_+{}:"<>?|[\]\\;',./`~])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+{}:"<>?|[\]\\;',./`~]{8,20}$/.test(
          value
        );
      },
      message:
        "Password must have atleast a special character,an upper-case alphabet and a number",
    },
    minlength: [5, "Password Must be greater than 5 characters"],
    maxlength: [15, "Password Must be less than 25 characters"],
    //It will store in db, but it will not show when in the response.To view password also we use User.find({}).select('+password')
    //here + is used to view the field which is marked as select=false in schema definition.
    select:false
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm Password is Must"],
    trim: true,
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: "It should match with the password",
    },
  },
  active:{
    type:Boolean,
    default:true,
    select:false
  },
  passwordChangedAt:{
    type:Date,
  },
  passwordResetToken:{
    type:String,
  },
  passwordResetTokenExpiresIn:{
    type:Date
  }
});


//bcrypt is a asynchronous function.so we use await and salt=10 is the cpu intensity.iF salt increases,the security increases and time to hash the password also increases.
//ideally salt=12.we have 'this' as defined since we are creating documents.
userSchema.pre('save',async function(next)
{
    console.log('in pre user')
   if(!this.isModified('password')) return next();

   this.password=await bcrypt.hash(this.password,12);
   //deleting the confirmPassword field by assigning it to undefined(trick).
   this.confirmPassword=undefined;
   next();
})

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    //deducting 1sec because sometimes jwt token is created first and then passwordCahngedAt will be stored then.So to avoid this we are deducting 1s.
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });

  userSchema.pre(/^find/,function(next)
  {
    this.find({active:true});
    next();
  })

//to check the password while logging in
userSchema.methods.correctPassword=async function(password)
{
    //since if we dont send password in req.body then password is undefined ,bcrypt.compare will throw error because it accepts only strings.
   if(!password)
   {
    return false;
   }
   //here this refers the the user instance object (user.correctPassword(arguments) in authController.js) by which we called this method.It is different from 'this' in save method.
   return bcrypt.compare(password,this.password);
}

//returns true if password is changed after creation of token,then we send custom error.
userSchema.methods.passwordChanged=function(issuedAt)
{
    //if passwordChangedAt field exists then compare token iat with passwordChangedAt or else return false.
    if(this.passwordChangedAt){
  return (parseInt(this.passwordChangedAt.getTime()/1000))>issuedAt;
    }
    return false;
}

userSchema.methods.createPasswordResetToken=function()
{
    const token = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    this.passwordResetToken=hashedToken;
    this.passwordResetTokenExpiresIn=Date.now()+10*60*1000;
    return token;
}
const User = new mongoose.model("User", userSchema);
module.exports = User;

const asyncWrapper=require('../utils/asyncWrapper');
const User=require('../models/userModel')

function filterFields(inputObj,inputArr)
{
    let requiredObj={};
    Object.keys(inputObj).map((item)=>{
        if(inputArr.includes(item))
        {
            requiredObj[item]=inputObj[item];
        }
    })
    return requiredObj;
}
//------------------------------------------------------------------For Admins----------------------------------------------------------------
exports.getAllUsers = async (req, res) => {
    let users=await User.find();
    res.status(500).json({
        status:'success',
       data:users
    })
};
exports.createUser = asyncWrapper(async(req, res,next) => {
    const user=new User(req.body);
   let data=await user.save();
   res.status(201).json({
    user:data
   })
})
exports.getUser = async (req, res) => {
    const user=await  User.findById(req.params.id);
    res.status(201).json({
        message:"success",
        data:{
            data:user
        }
     
    })
};
exports.updateUser =asyncWrapper( async (req, res) => {
    const user=await User.findByIdAndUpdate(req.params.id,req.body,{
        runValidators:true
    });
    res.status(201).json({
        message:"success",
        data:{
            data:user
        }
    })
})
exports.deleteUser = async (req, res) => {
    const user=await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
        message:"success",
        data:{
            data:null
        }
    })
};
//---------------------------------------------------------For Users------------------------------------------------------------------------------
//used to update only name and email
exports.updateBio=asyncWrapper(async function(req,res,next)
{
   const fields=['name','email'];
   const filterObj=filterFields(req.body,fields);
   const user=await User.findByIdAndUpdate(req.user._id,filterObj,{
    new:true,
    runValidators:true
   })

   return res.status(200).json({
    message:"success",
    user
   })
})

exports.deleteMe=asyncWrapper(async function(req,res,next)
{
    await User.findByIdAndUpdate(req.user._id,{active:false})
    return res.status(201).json({
        message:"success",
        data:null
    })
})
//------------------------------------------------------------------------------------------------------------------------------------------------------
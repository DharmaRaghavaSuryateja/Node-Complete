const Review=require('../models/reviewModel');
const asyncWrapper=require('../utils/asyncWrapper');

//this route is like a dynamic route,not syntax but inside logic.It may fetch all the reviews of all tours or all the reviews of a specific tour.
//localhost:8000/api/v1/reviews  ->fetches all reviews of all tours (from app.use('api/v1/routes',reviewRouter))
//localhost:8000/api/v1/tours/:tourId/reviews   ->fetches all reviews of a particular tour ( from app.use(':tourId/reviews',reviewRouter) in tourRouter.js)
//so this getAllReviews Controller is used for 2 different routes.

exports.getAllReviews=asyncWrapper(async function(req,res,next)
{
    let filter={};
       if(req.params.tourId) filter['tour']=req.params.tourId;
       const reviews=await Review.find(filter);
       return res.status(200).json({
        message:"success",
        results:reviews.length,
        data:{
            reviews
        }
       })
})

exports.createReview=asyncWrapper(async function(req,res,next)
{
    if(!req.body.tour) req.body.tour=req.params.tourId;
    if(!req.body.user) req.body.user=req.user._id;
     const newReview=await Review.create(req.body);
     return res.status(200).json({
        message:"success",
        data:{
            newReview
        }
       })
})

exports.getReview=asyncWrapper(async function(req,res,next)
{
   const reviews=await Review.findById(req.params.id);
   return res.status(201).json({
    message:"success",
    data:{
        data:reviews
    }
   })
})

exports.updateReview=asyncWrapper(async function(req,res,next)
{
    const review=await Review.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    return res.status(201).json({
        message:"success",
        data:{
            data:review
        }
       })
})
exports.deleteReview=asyncWrapper(async function(req,res,next)
{
    const review=await Review.findByIdAndDelete(req.params.id);
    return res.status(204).json({
        message:"success",
        data:{
            data:null
        }
       })
})
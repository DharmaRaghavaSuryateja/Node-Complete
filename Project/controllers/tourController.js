const Tour = require("../models/tourModel");
const features = require("../utils/apiFeatures");
const asyncWrapper = require("../utils/asyncWrapper");
const appError=require('../utils/appErrors');
// //TODO: Param Middle-ware
// exports.checkID = async (req, res, next, id) => {
//   if (id*1=== 0) {
//     return res.status(404).json({
//       status: "Fail",
//       message: "Invalid ID",
//     });
//   }
//   next();
// };
// //TODO: User Defined Middle-ware while creating a tour in post method
// exports.checkBody=async(req,res,next)=>{
//     if(!req.body.name)
//     {
//         return res.status(404).json({
//             status: "Fail",
//             message: "Give name",
//           });
//     }
//     next();
// }

//Middleware
exports.aliasTours = (req, res, next) => {
  req.query.limit = 5;
  (req.query.sort = "-ratingsAverage price"),
    (req.query.fields = "name price ratingsAverage summary duration");
  next();
};
exports.getAllTours = asyncWrapper(async (req, res) => {
  //here we dont use await.if we use await,then it will execute Tour.find().so we are not using await.
  //the below line just stores Tour.find() in query because we can perform update query in future and chain further queries to the query.
  console.log(req.query)
  let query = new features(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let allTourData = await query.mongooseQuery;
  res.status(201).json({
    status: "success",
    data: allTourData,
  });
});
exports.createTour = asyncWrapper(async (req, res) => {
  let tourData = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: tourData,
  });
});
exports.getTour = asyncWrapper(async (req, res,next) => {
  let tourData = await Tour.findById(req.params.id).populate('reviews');
  if(!tourData)
  {
    return next(new appError("Not a Valid Id",404));
  }
  res.status(201).json({
    status: "success",
    data: tourData,
  });
});
exports.updateTour = asyncWrapper(async (req, res,next) => {
  //returns the new updated object when new is set to true and we can pass one value also like name or price instead of all the values
  //run validators check the input data against the minLength,maxLength,required when operations like updating...so on.when run validators is false,it will not check the required,min,max..so on
  let updatedTourData = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if(!updatedTourData)
  {
    return next(new appError("Not a Valid Id",404));
  }
  res.status(201).json({
    status: "success",
    data: updatedTourData,
  });
});
exports.deleteTour = asyncWrapper(async (req, res,next) => {
  //Generally dont send deleted data to client in rest api
  let deletedTourData = await Tour.findByIdAndDelete(req.params.id);
  if(!deletedTourData)
  {
    return next(new appError("Not a Valid Id",404));
  }
  res.status(201).json({
    status: "success",
    data: deletedTourData,
  });
});

//Aggregation Pipeline
exports.tourStats = asyncWrapper(async (req, res) => {
  const tourStatistics = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //     $match:{
    //         _id:{$ne:'easy'}
    //     }
    // }
  ]);

  res.status(201).json({
    status: "success",
    data: tourStatistics,
  });
});

exports.getMonthlyStats = asyncWrapper(async (req, res) => {
  const year = req.params.id * 1;
  const startMonth = new Date(year, 1, 1);
  const endMonth = new Date(year, 12, 31);
  const monthlyTourData = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: startMonth,
          $lte: endMonth,
        },
      },
    },
    {
      $group: {
        _id: {
          $month: "$startDates",
        },
        numTours: { $sum: 1 },
        AllTours: {
          $push: "$name",
        },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTours: -1,
      },
    },
  ]);

  res.status(201).json({
    status: "success",
    data: monthlyTourData,
  });
});

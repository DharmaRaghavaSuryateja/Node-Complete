const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


//to prevent duplicate of both as a single (tour+user) by indexing we can achieve using index.
//a user cannot pust multiple reviews for a particular tour.
reviewSchema.index({tour:1,user:1},{unique:true});

reviewSchema.pre(/^find/, function (next) {
  console.log("in virtiual");
  //the tour field in reviewModel has no use to populate because we are having virtual population in tourSchema where we store reviews of particular tour on that
  //particular tour itself without actually storing but using virtual population.
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRating = async function (tourId) {
  //aggregate is a array in () that takes objects..
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post("save", function () {
  //this.constructor refers to Review...since we cannot call Review directly since we have not initialized review yet...
  //this refers to entire object data like this.tour,this.rating,this.review,this.user... so on
  //this.constructor refers to Review
  //TODO: call statics by Review.method_name if method name is reviewSchema.statics.method_name.
  //TODO: call methods by instance review.method_name if method name is reviewSchema.methods.method_name.
  //console.log(this.constructor)
  this.constructor.calcAverageRating(this.tour);
});

//for update and delete,{confusing,refer chatgpt}
reviewSchema.post(/^findOneAnd/, async function(doc) {
  await doc.constructor.calcAverageRating(doc.tour);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

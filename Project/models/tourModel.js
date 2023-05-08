const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //required can only have validators
      required: [true, "A Tour must have a name"],
      unique: true,
      trim: true,
      minlength: [10, "name must be greater than 10 chars"],
      maxlength: [40, "name must be less than 40 chars"],
      //CHAT GPT User Defined Validation.It can be applied for any.
      validate: {
        validator: function (value) {
          return /^[A-Za-z\s]+$/.test(value);
        },
        message: "Name must contain Alphabets and spaces only",
      },
    },
    slugString: String,
    secret: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      required: [true, "A Tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A Tour must have a Group Size"],
    },
    difficulty: {
      type: String,
      required: [true, "A Tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be Easy,Medium or Difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0, "Rating must be greater than or equal to Zero"],
      max: [5, "Rating must be less than or equal to 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A Tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          console.log(this.price);
          return val < this.price;
        },
        message: "Discount must be less than {VALUE}",
      },
    },
    summary: {
      type: String,
      required: [true, "A Tour must have a summary"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A Tour must have a image Cover"],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: {
      type: [Date],
    },
    startLocation: {
      // GeoJSON,here outer type is not keyword.It is a normal name.
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  //virtual properties are displayed in postman.
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//indexes for better searching of records
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slugString: 1 });
//getters..these are virtual properties...We cannot query durationWeeks as it is not a Schema Property.It will be just displayed.
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//virtual population
tourSchema.virtual('reviews',{
  ref:'Review',
  foreignField:'tour',
  localField:'_id'
})
// DOCUMENT MIDDLEWARE: runs before .save() and .create() because create is also implemented using save in internal
tourSchema.pre("save", function (next) {
  this.slugString = slugify(this.name, { lower: true });
  next();
});

// QUERY(means mongoose query not query string) MIDDLEWARE: runs before any method that starts with 'find' String and here this keyword refers to the query
tourSchema.pre(/^find/, function (next) {
  console.log("In Pre Method Models");
  this.find({ secret: { $ne: true } });
  next();
});

//query middleware for query starting with 'find' that are used to populate the guides.
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});
//AGGREGATION MIDDLEWARE .By using this middleware,the secret key is filtered when we use aggregate methods because it is not catched by find methods when using aggregate methods.
//unshift add an object to aggregate method above
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});

//TODO: The above two(query and aggregation) middlewares are used to hide secret tour from search results.

//it has one argument next and it runs before we save a document to database
// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

//post function has two arguments doc and next where doc is the entire saved or created object.It executes after we save the document to database.
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

const Tour = new mongoose.model("Tour", tourSchema);
module.exports = Tour;

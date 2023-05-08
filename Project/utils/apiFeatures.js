class APIFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
      let reqObj = { ...this.queryString };
      const excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach((el) => {
        delete reqObj[el];
      });

      reqObj = JSON.stringify(reqObj);
      reqObj = reqObj.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      reqObj = JSON.parse(reqObj);
      console.log(reqObj);
      this.mongooseQuery=this.mongooseQuery.find(reqObj);
    return this;
  }
  sort() {
    //TODO:SORTING
    if (this.queryString.sort) {
      //here in route we suppose give ?sort=price,ratingsAverage.
      //we can use query.sort(price ratingsAverage) with spaces between price and ratingsAverage but not with comma(,).
      //so we convert the comma in route to space by below split and join
      let sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery.sort("price");
    }
    return this;
  }

  limitFields() {
    //TODO: PROJECTION
    if (this.queryString.fields) {
      const selected = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery.select(selected);
    } else {
      this.mongooseQuery.select("-__v");
    }
    return this;
  }
  paginate() {
    //TODO: PAGINATION
  
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 10;
      this.mongooseQuery = this.mongooseQuery
        .skip((page - 1) * limit)
        .limit(limit);
      // const totalTours=await Tour.countDocuments();
      // if(page>totalTours/limit)
      // {
      //     throw new Error({message:"Invalid page"})
      // }
    
    return this;
  }
}
module.exports = APIFeatures;

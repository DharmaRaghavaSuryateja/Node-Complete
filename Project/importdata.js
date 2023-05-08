const fs=require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env`});
const Tour=require('./models/tourModel');
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Connected to DB");
});
const tourData=fs.readFileSync(`${__dirname}/jsonData.json`,'utf-8');
const tour=JSON.parse(tourData);
async function fun(){
const data=await Tour.create(tour);
console.log(data);
}
fun()

const dotenv = require("dotenv");
const path=require("path");
dotenv.config({path:path.join(__dirname,'config.env')});
const app = require("./app");
const port = process.env.PORT;
app.listen(port, () => {
  console.log("Running on " + `${port}`);
});

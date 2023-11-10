const express = require("express");
const dotenv = require("dotenv");
// const helmet = require('helmet');
const cors = require("cors");
const crmRoutes = require("./src/route/data");
const employeeRoutes = require("./src/route/employee");
const connectDb = require("./src/config/config");
const userRoutes = require("./src/route/user");

const dataRoutes = require("./src/route/data");

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDb();

//Middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/data", crmRoutes);
app.use("/data", employeeRoutes);
app.use("/data", userRoutes);
// app.use(helmet());
// app.use((req,res,next) =>{
//   logger.info(`${req.method} ${req.url} ${req.ip} ${req.hostname} ${new Date()} ${req.get('User-Agent')}`);
//   next();
// })
app.use((req, res, next) => {
  const timezone = process.env.TIMEZONE || "UTC";
  req.timezone = timezone;
  next();
});

app.get("", (req, res) => {
  console.log("Server Started at 8080 ");
});

// Routes
// app.use('/roles',roleRoutes);
// app.use('/users',userRoutes);
// app.use('/auth',authRoutes);
// app.use('/restaurant',restaurantRoutes);
// app.use('/category',categoryRoutes);
// app.use('/product',productRoutes);
// app.use('/order',orderRoutes);
// app.use('/campus', campusRoutes);
// app.use('/cart',cartRoutes);
app.use("/data", dataRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

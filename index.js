//importing express library         
const express = require("express");
const app = express();
const mongoose = require("mongoose")

// used this because of deprecation warning : the 'strictQuery'
mongoose.set('strictQuery', false); 

//import for hiding secret key
const dotenv =require("dotenv");

const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")

dotenv.config();


mongoose
.connect(process.env.MONGO_URL)
.then(()=>console.log("DBconnection Successful!"))
.catch((err)=>{
    console.log(err);
});

//so our app can process any json file.
app.use(express.json())

// whenever we'll go to api and user our application will use "userRoute". And inside userRoute we can write other endpoints
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/products",productRoute);
app.use("/api/carts",cartRoute);
app.use("/api/orders",orderRoute);


//if there is no port number in our env file use this number. 5000 in this case. so in future we can change port number
app.listen(process.env.PORT || 5000,()=>{                
    console.log("Backend server is running!");
});
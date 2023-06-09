const User = require("../models/User");
const { verifyToken,
        verifyTokenAndAuthorization, 
        verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//UPDATE

router.put("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, 
            process.env.PASS_SEC)
            .toString();
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
             { new:true }
        );

        res.status(200).json(updatedUser);

    }catch(err){
        res.status(500).json(err);
    }
});


//DELETE

router.delete("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")

    }catch(err){
        res.status(500).json(err)

    }
})


//GET USER

router.get("/find/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
       const user = await User.findById(req.params.id)
       const{ password, ...others }= user._doc;
        res.status(200).json(others);

    }catch(err){
        res.status(500).json(err)

    }
})


//GET ALL USER

//We can also use query

router.get("/",verifyTokenAndAdmin,async (req,res)=>{
    const query = req.query.new

    try{
       const users = query 
       ? await User.find().sort({_id:-1}).limit(5)   //will give 5 latest users(?new=true)
       : await User.find();
        res.status(200).json(users);

    }catch(err){
        res.status(500).json(err)

    }
})

//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res)=> {
    // this stats returns total number of user per month

    //creates current date
    const date = new Date();
    
    //gives the last year
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));

    try{// to get user statistics per month we must group our items. mongoDB aggregate

        const data = await User.aggregate([
            {$match: { createdAt: { $gte: lastYear } } },

            {// to take month numbers
                $project: { 
                    month:{$month: "$createdAt"}, //it will take month from 'createdAt' from mongodb and assign it to month
                },
            },
            {
                $group:{
                     _id: "$month",
                    total: {$sum: 1}, // gives total number of user   
                },
            },

        ]);
        res.status(200).json(data)


    }catch(err){

        res.status(500).json(err);

    }
})

module.exports = router;
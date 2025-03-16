import Product from "../../models/Product.model.js";
import User from "../../models/User.model.js";

export const getAllProducts = async(req, res) => {
    try{
        const {userId} = req.params;
        const user = await User.findById(userId);
        console.log(`User: ${user}`);
        const products = await Product.find({})
            .populate({path:'userId', select:'Name email contact address location'})
            .exec();

        if(!products) return res.status(404).json({message:"Products not found"});

        return res.status(200).json({
            success:true,
            data:products,
        });
    }catch(err){
        return res.status(500).json({message:`Internal error: ${err.message}`});
    }
};
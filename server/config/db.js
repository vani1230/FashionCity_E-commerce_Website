import mongoose from "mongoose";

const dbConnect = (req,res) =>{
    try {
        mongoose.connect(process.env.MONGO_URL,{dbName:"E-commerce_Website"})
                .then(()=>console.log('Database Connected'))
                .catch((err)=>console.log(err))
    } catch (error) {
        console.log(error)
    }
}

export default dbConnect
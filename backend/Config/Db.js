import mongoose from "mongoose"

export const connectdb=async()=>{
    try{
        const connection=await mongoose.connect(process.env.MONGO_URI)
        {console.log("Connected successfully")}
        
    }
    catch(error){
        console.log(error)
    }

}
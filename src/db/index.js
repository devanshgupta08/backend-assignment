import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        const connectionInstance =await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}?retryWrites=true&w=majority`)
        console.log(`connection successful, HOST:${connectionInstance.connection.host}`);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;
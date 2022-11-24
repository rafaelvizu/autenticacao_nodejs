import mongoose from "mongoose";
import 'dotenv/config';


const MONGOURL = process.env.MONGOURL;

await mongoose.connect(`${MONGOURL}/test`)
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

export default mongoose;
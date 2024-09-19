// import mongoose from 'mongoose';
// import { DB_NAME } from './constants';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import {app} from './app.js'

dotenv.config({
    path: './.env'
})
const port = process.env.PORT || 7000
connectDB()
.then(() => {
    app.on('error', (err) => {
        console.error('App encountered an error:', err);
      });

    app.listen(port, () => {console.log(`Server is running on port ${port}`)})
})
.catch((err) => {
    console.log("MONGO db Connection FAILED",err)
    process.exit(1)
})










//this is the basic way to connect to the database
// ( async () => {
//   try {
//    await mongoose.connect(`${process.env.MONGO_URI}/{DB_NAME}`)
//    app.on("error",(error) => {
//     console.log("ERROR:", error)
//     throw error   })
//   } catch (error) {
//     console.log("ERROR:", error)
//     throw error
//   }

//   })()
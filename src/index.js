// import mongoose from 'mongoose';
// import { DB_NAME } from './constants';

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
// const app = express()

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 6000, () => {console.log(`Server is running on port ${process.env.PORT}`)})
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
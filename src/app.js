import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({limit: "20kb"}));  //to accepyt the json data
app.use(express.urlencoded({extended: true, limit: "20kb"}));
//to accept the url data, url se jo data ata h wo change hotah as per encoding thats why we need this , extended means andr andr 
app.use(express.static("public"));
app.use(cookieParser());  //from my server to user ki cookie access kar pao or set kar pao, basically cookie pe crud kar pao

export {app};  


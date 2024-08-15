import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({limit: "20kb"}));  //to accepyt the json data
app.use(express.urlencoded({extended: true, limit: "20kb"})); //to accept the url data
app.use(express.static("public"));
app.use(cookieParser());
export {app}  


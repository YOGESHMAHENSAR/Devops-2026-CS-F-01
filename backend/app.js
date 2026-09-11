import "dotenv/config"
import express from "express";
import mongoose from "mongoose";
const app = express();
const port = 3000;

const dbUrl = process.env.ATLAS_DB_URL;

//mongoose connection
main().then((res)=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
    // console.log("Database Host:", mongoose.connection.host); 
    // console.log("Database Name:", mongoose.connection.name);
}

app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit: "40kb",extended: true}));

app.get("/home", (req, res)=>{
    return res.json({"hello": "good to go"});
})

app.listen(port, () =>{
    console.log(`listening to port ${port}`)
});
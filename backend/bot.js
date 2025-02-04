require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api")
const express = require("express")
const multer = require("multer")
const cloudinary = require("cloudinary"
).v2;
const mongoose = require("mongoose")
const bot = new TelegramBot(process.env.TOKEN , {polling : true});
const app = express()

mongoose.connect(process.env.DB).then(()=>console.log("DB Connected")).catch((err)=>console.log(err));
const upload = multer({dest : "uploads/"})
cloudinary.config({
    cloud_name : process.env.CLOUD,
    api_key : process.env.KEY,
    api_secret : process.env.SECRET
});
const fileSchema = new mongoose.Schema({
    fileId : String,
    fileUrl : String,
    fileType : String,
    userId : String,
    fileName : String
},{
    timestamps : true
});
const File = mongoose.model("File" , fileSchema);

bot.on('document',async(msg)=>{
    const chatId = msg.chat.id;
    const fileId = msg.document.file_id;
    const user = msg.from.id;
    const fileName = msg.document.file_name;
    bot.sendMessage(chatId , "📤 Uploading Your File.....");
    try{
        const fileLink = await bot.getFileLink(fileId);
        const uploadFile = await cloudinary.uploader.upload(fileLink , {resource_type : "auto"});
        const newFile =new File({fileId , fileUrl : uploadFile.secure_url , fileType : msg.document.mime_type,userId : user,fileName : fileName});
        await newFile.save();
        bot.sendMessage(chatId , `✅ File Uploaded successfully. To access the file \n\n Link - ${uploadFile.secure_url}.`)
    }catch(error){
        console.log("Upload Error" , error);
        bot.sendMessage(chatId , "File Upload Failed");
    }
})
console.log("📂 Telegram File Uploader Bot is running...");

app.get("/gallery" , async(req,res)=>{
    try {
        const data = req.body;
        const userId = data.id;
       
        if(!userId){
          return res.status(404).json({"Message" : "User Not Found"});
        }
        const userFile = await File.find({userId : userId});
        if(userFile.length === 0){
            return res.status(404).json({"Message" : "No Files Uploaded"});
        }
        return res.status(200).json({"Files" : userFile});
    } catch (error) {
        console.error("Error fetching files: ", error);
        res.status(500).send("Internal Server Error");
    }
})

app.listen(5000 , ()=>{
    console.log("Server Runnig")
})
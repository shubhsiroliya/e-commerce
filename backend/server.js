const app=require('./app');

const {connection}=require('./config/database');
const cloudinary =require('cloudinary');

// handling uncaught exception
process.on('uncaughtException',(error)=>{
    console.log(`Error:${Error.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})

// configuration
if(process.env.NODE_ENV!=="PRODUCTION"){
    require('dotenv').config({path:"backend/config/config.env"});
}

// connection to databse
connection();
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const server =app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`);
})

// unhandled promise rejection
process.on('unhandledRejection',(error)=>{
    console.log(`error:${error.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    });
})
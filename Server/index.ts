const dotenv = require('dotenv').config();
import colors = require('colors');
colors.enabled = true;
if (dotenv.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key".red);
    process.exit(-1);
} else if( !process.env.JWT_SECRET ) {
    console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found".red);
    process.exit(-1);
}
import * as mongoose from 'mongoose';
const express = require('express');
import * as http from "http";

const app = express();
mongoose.connect('mongodb://mymongo:27017/taw-app2023').then(()=>{
    let server = http.createServer(app);
    server.listen(8080, () => console.log("HTTP Server started on port 8080".green));
});

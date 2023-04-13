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
const cors = require('cors');
const bodyParser =  require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.get('/', function (req : any, res : any) {
    res.status(200).json({api_version: '1.0', author: 'BassHound'});
});
//TODO: storing uri in .env
// checking port in containers
mongoose.connect('mongodb://mongo:27018/taw-app2023').then(()=>{
    let server = http.createServer(app);
    server.listen(8080, () => console.log("HTTP Server started on port 8080".green));
}).catch(err => console.log(err));

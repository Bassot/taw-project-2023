import {newUser} from "./Models/User";

const dotenv = require('dotenv').config();
import colors = require('colors');

colors.enabled = true;
if (dotenv.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key".red);
    process.exit(-1);
} else if (!process.env.JWT_SECRET) {
    console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found".red);
    process.exit(-1);
}
import * as mongoose from 'mongoose';

const express = require('express');
import * as http from "http";

const cors = require('cors');
const bodyParser = require('body-parser');
import * as user from './Models/User';


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.get('/', function (req: any, res: any) {
    res.status(200).json({api_version: '1.0', author: 'BassHound'});
});
app.post('/users', (req: any, res: any, next: any) => {

    var u = user.newUser(req.body);
    if (!req.body.password) {
        return next({statusCode: 404, error: true, errormessage: "Password field missing"});
    }
    u.setPassword(req.body.password);

    u.save().then((data: any) => {
        return res.status(200).json({error: false, errormessage: "", id: data._id});
    }).catch((reason: any) => {
        if (reason.code === 11000)
            return next({statusCode: 404, error: true, errormessage: "User already exists"});
        return next({statusCode: 404, error: true, errormessage: "DB error: " + reason.errmsg});
    })

});
// the ENV var DBHOST is set only if the server is running inside a container
const dbHost = process.env.DBHOST || '127.0.0.1';
mongoose.connect('mongodb://' + dbHost + ':27017/taw-app2023').then(() => {
    let server = http.createServer(app);
    server.listen(8080, () => console.log("HTTP Server started on port 8080".green));
}).then(() => {
    let s = 'Connected to mongoDB, dbHost: ' + dbHost;
    console.log(s.bgGreen);
    return user.getModel().findOne( {email:"bass@hound.it"} );
}).then((admin)=>{
    if(admin){
        console.log('The admin user already exists');
        return;
    }
    console.log('Creating a new admin user...');
    // newUser returns a user mongoose model in wich we can call the method save
    var u = newUser({
        username: 'BassHound',
        email: 'bass@hound.it'
    });
    u.setAdmin();
    u.setModerator();
    u.setPassword("1234");
    return u.save();
}).catch(err => console.log(err));



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
const { expressjwt: jwt } = require('express-jwt');
import jsonwebtoken = require('jsonwebtoken');  // JWT generation
import * as user from './Models/User';
import {userRouter} from "./Routes/user.routes";




const app = express();
let auth = jwt( {
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
} );
app.use(cors());
app.use(bodyParser.json());





app.get('/', function (req, res) {
    res.status(200).json({api_version: '1.1', author: 'BassHound'});
});

/*
app.post('/users', (req, res, next) => {

    var u = user.newUser(req.body);
    if (!req.body.password) {
        return next({statusCode: 404, error: true, errormessage: "Password field missing"});
    }
    u.setPassword(req.body.password);

    u.save().then((data: any) => {
        return res.status(200).json({error: false, errormessage: "", id: data._id});
    }).catch((reason) => {
        if (reason.code === 11000)
            return next({statusCode: 404, error: true, errormessage: "User already exists"});
        return next({statusCode: 404, error: true, errormessage: "DB error: " + reason.errmsg});
    })
});

*/
app.post('/login', (req, res, next)=>{
    let username = req.body.username;
    let password = req.body.password;
    console.log("New login attempt from ".green + username );

    user.getModel().findOne( {username: username}).then((user)=> {
        if (!user) {
            return next({statusCode: 500, error: true, errormessage: "Invalid user"});
        }
        if (user.validatePassword(password)) {
            let tokendata = {
                // TODO define token
            };

            console.log("Login granted. Generating token");
            let token_signed = jsonwebtoken.sign(
                tokendata,
                process.env.JWT_SECRET as jsonwebtoken.Secret,
                { expiresIn: '1h'}
            );

            // https://jwt.io
            return res.status(200).json({
                error: false,
                errormessage: "",
                id: user._id,
                token: token_signed
            });
        }
        return next({statusCode: 500, error: true, errormessage: "Invalid password"});
    });
});



// the ENV var DBHOST is set only if the server is running inside a container
const dbHost = process.env.DBHOST || '127.0.0.1';
mongoose.connect('mongodb://' + dbHost + ':27017/taw-app2023').then(() => {
    let server = http.createServer(app);
    app.use("/users", userRouter);
    server.listen(8080, () => console.log("HTTP Server started on port 8080".green));
}).then(() => {
    let s = 'Connected to mongoDB, dbHost: ' + dbHost;
    console.log(s.bgGreen);
}).catch(err => console.log(err));

/*
 var u = newUser({
        username: 'BassHound',
        email: 'bass@hound.it',
        role: 'Admin'
    });
    u.setPassword("1234");
    u.save();
 */






/*
import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import {expressjwt as jwt} from "express-jwt";
import bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as http from "http";
import {userRouter} from "./Routes/user.routes";
import colors = require('colors');

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const app = express();

app.use("/users", userRouter);
app.use(cors());
app.use(bodyParser.json());

// the ENV var DBHOST is set only if the server is running inside a container
const dbHost = process.env.DBHOST || '127.0.0.1';
mongoose.connect('mongodb://' + dbHost + ':27017/taw-app2023').then(() => {
    let server = http.createServer(app);
    server.listen(8080, () => console.log("HTTP Server started on port 8080".green));
}).then(() => {
    let s = 'Connected to mongoDB, dbHost: ' + dbHost;
    console.log(s.bgGreen);
}).catch(err => console.log(err));


 */

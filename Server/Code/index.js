"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const dotenv = require('dotenv').config();
const colors = require("colors");
colors.enabled = true;
if (dotenv.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key".red);
    process.exit(-1);
}
else if (!process.env.JWT_SECRET) {
    console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found".red);
    process.exit(-1);
}
const mongoose = __importStar(require("mongoose"));
const express = require('express');
const http = __importStar(require("http"));
const cors = require('cors');
const bodyParser = require('body-parser');
const { expressjwt: jwt } = require('express-jwt');
const jsonwebtoken = require("jsonwebtoken"); // JWT generation
const user = __importStar(require("./Models/User"));
const app = express();
const auth = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
});
app.use(cors());
app.use(bodyParser.json());
app.get('/', function (req, res) {
    res.status(200).json({ api_version: '1.1', author: 'BassHound' });
});
app.post('/login', (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log("New login attempt from ".green + email);
    user.getModel().findOne({ email: email }).then((user) => {
        if (!user) {
            return next({ statusCode: 500, error: true, errormessage: "Invalid user" });
        }
        if (user.validatePassword(password)) {
            let tokendata = { isadmin: user.isAdmin() };
            console.log("Login granted. Generating token");
            let token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' });
            // https://jwt.io
            return res.status(200).json({
                error: false,
                errormessage: "",
                id: user._id,
                token: token_signed
            });
        }
        return next({ statusCode: 500, error: true, errormessage: "Invalid password" });
    });
});
//SIGNUP API, no auth needed
app.post("/signup", (req, res) => {
    console.log('Ok0');
    let u = user.newUser(req.body);
    u.setPassword(req.body.password);
    u.setAdmin(false);
    console.log('Ok1');
    u.save().then((data) => {
        return res.status(200).json({ error: false, errormessage: "", id: data._id });
    }).catch((reason) => {
        if (reason.code === 11000)
            return res.status(404).json({ error: true, errormessage: "User already exists" });
        return res.status(404).json({ error: true, errormessage: "DB error: " + reason.errmsg });
    });
});
// other routes
exports.userRouter = express.Router();
app.use("/users", exports.userRouter);
exports.userRouter.use(auth);
// the ENV var DBHOST is set only if the server is running inside a container
const dbHost = process.env.DBHOST || '127.0.0.1';
mongoose.connect('mongodb://' + dbHost + ':27017/taw-app2023').then(() => {
    let s = 'Connected to mongoDB, dbHost: ' + dbHost;
    console.log(s.bgGreen);
    return user.getModel().findOne({ email: "bass@hound.it" });
}).then((data) => {
    if (!data) {
        console.log("Creating admin user");
        let u = user.newUser({
            username: "bassHound",
            email: "bass@hound.it",
            role: "Cashier"
        });
        u.setPassword("hound");
        u.setAdmin(true);
        return u.save();
    }
    else {
        console.log("Admin user already exists");
    }
}).then(() => {
    let server = http.createServer(app);
    server.listen(8080, () => console.log("HTTP Server started on port 8080".green));
}).catch(err => console.log(err));

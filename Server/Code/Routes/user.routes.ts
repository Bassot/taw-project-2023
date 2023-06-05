import * as express from "express";
import * as user from "../Models/User";
import {expressjwt as jwt} from "express-jwt";
const dotenv = require('dotenv').config();

if (dotenv.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key".red);
    process.exit(-1);
} else if (!process.env.JWT_SECRET) {
    console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found".red);
    process.exit(-1);
}
export const userRouter = express.Router();
let auth = jwt( {
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
} );
userRouter.use(express.json());
userRouter.use(auth);
userRouter.use(function (req: any, res) {
    if (!req.auth.isadmin) return res.sendStatus(401);
    res.sendStatus(200);
});


userRouter.get("/", async (req, res) => {
    try {
        let users = await user.getModel().find({});
        res.status(200).send(JSON.stringify(users));
        }
    catch (error :any) {
        res.status(500).send(error.message);
    }
});

userRouter.get("/:id", async (req, res) => {
    try {
        const username = req?.params?.id;
        let usertoupdate = await user.getModel().findOne({username: username});

        if (usertoupdate) {
            res.status(200).send(usertoupdate);
        } else {
            res.status(404).send(`Failed to find the user: ${username}`);
        }

    } catch (error) {
        res.status(404).send(`Failed to find the user: ${req?.params?.id}`);
    }
});

userRouter.put("/:username", async (req, res) => {
    const username = req?.params?.username;
    const updateduser = req.body;
    try {
        let users = await user.getModel().findOneAndUpdate({username: username}, {$set: updateduser});
        res.status(200).send(JSON.stringify(users));
    }
    catch (error :any) {
        res.status(500).send(error.message);
    }
});

userRouter.delete("/:username", async (req, res) => {
    const username = req?.params?.username;
    try {
        let users = await user.getModel().deleteOne({username: username});
        res.status(200).send(JSON.stringify(users));
    }
    catch (error :any) {
        res.status(500).send(error.message);
    }
});

userRouter.post("/", async (req, res) => {
    let u = user.newUser(req.body);
    u.setPassword("1234");
    u.save().then((data: any) => {
        return res.status(200).json({error: false, errormessage: "", id: data._id});
    }).catch((reason) => {
        if (reason.code === 11000)
            return res.status(404).json({error: true, errormessage: "User already exists"});
        return res.status(404).json({error: true, errormessage: "DB error: " + reason.errmsg});
    })
    console.log(req.body);

});


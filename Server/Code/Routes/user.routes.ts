import * as express from "express";
import * as mongodb from "mongodb";
import * as user from "../Models/User";

export const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get("/", async (_req, res) => {
    try {
        const users = await user.getModel().find();
        res.status(200).send(users);
    } catch (error :any) {
        res.status(500).send(error.message);
    }
});

userRouter.post("/", async (req, res) => {
    let u = user.newUser(req.body);
    u.setPassword(req.body.password);
    u.save().then((data: any) => {
        return res.status(200).json({error: false, errormessage: "", id: data._id});
    }).catch((reason) => {
        if (reason.code === 11000)
            return res.status(404).json({error: true, errormessage: "User already exists"});
        return res.status(404).json({error: true, errormessage: "DB error: " + reason.errmsg});
    })
});
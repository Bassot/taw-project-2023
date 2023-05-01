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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express = __importStar(require("express"));
const user = __importStar(require("../Models/User"));
exports.userRouter = express.Router();
exports.userRouter.use(express.json());
exports.userRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield user.getModel().find({});
        res.status(200).send(JSON.stringify(users));
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.userRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let u = user.newUser(req.body);
    u.setPassword("1234");
    u.save().then((data) => {
        return res.status(200).json({ error: false, errormessage: "", id: data._id });
    }).catch((reason) => {
        if (reason.code === 11000)
            return res.status(404).json({ error: true, errormessage: "User already exists" });
        return res.status(404).json({ error: true, errormessage: "DB error: " + reason.errmsg });
    });
    console.log(req.body);
}));

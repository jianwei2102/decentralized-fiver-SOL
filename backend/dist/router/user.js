"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// user.ts
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "kirat123"; // to do - move to .env
const router = (0, express_1.Router)();
const prismaClient = new client_1.PrismaClient();
// Sign in with wallet
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hardcodedWalletAdapter = "HB56SU6Rb55MKKGsg962tqsRnZmriMM2Sej3FeFCzQxb";
    const existingUser = yield prismaClient.user.findFirst({
        where: {
            address: hardcodedWalletAdapter,
        },
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            userId: existingUser.id,
        }, JWT_SECRET);
        res.json({
            token,
        });
    }
    else {
        const newUser = yield prismaClient.user.create({
            data: {
                address: hardcodedWalletAdapter,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            userId: newUser.id,
        }, JWT_SECRET);
        res.json({
            token,
        });
    }
}));
// Test route
router.get("/test", (req, res) => {
    res.json({
        message: "This is a test route",
    });
});
exports.default = router;

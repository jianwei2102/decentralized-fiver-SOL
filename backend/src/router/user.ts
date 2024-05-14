// user.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client();

const JWT_SECRET = "kirat123"; // to do - move to .env

const router = Router();
const prismaClient = new PrismaClient();

router.get("/presignURL", async (req, res) => {
  const command = new PutObjectCommand({
    Bucket: "decentralized-fiver-jw ",
    Key: "/fiver",
  });

  const preSignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  res.json({
    preSignedUrl,
  });
});

// Sign in with wallet
router.post("/signin", async (req, res) => {
  const hardcodedWalletAdapter = "HB56SU6Rb55MKKGsg962tqsRnZmriMM2Sej3FeFCzQxb";

  const existingUser = await prismaClient.user.findFirst({
    where: {
      address: hardcodedWalletAdapter,
    },
  });

  if (existingUser) {
    const token = jwt.sign(
      {
        userId: existingUser.id,
      },
      JWT_SECRET
    );

    res.json({
      token,
    });
  } else {
    const newUser = await prismaClient.user.create({
      data: {
        address: hardcodedWalletAdapter,
      },
    });

    const token = jwt.sign(
      {
        userId: newUser.id,
      },
      JWT_SECRET
    );

    res.json({
      token,
    });
  }
});

// Test route
router.get("/test", (req, res) => {
  res.json({
    message: "This is a test route",
  });
});

export default router;

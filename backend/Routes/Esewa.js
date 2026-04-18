import express from "express";
import CryptoJS from "crypto-js";
import { authenticate } from "../Auth/Middleware.js";
import Paymentmodel from "../Model/GymPayment.js";
import mongoose from "mongoose";
const router = express.Router();


const generateSignature = (
  total_amount,
  transaction_uuid,
  product_code,
  secret
) => {
  const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const hash = CryptoJS.HmacSHA256(hashString, secret);
  return CryptoJS.enc.Base64.stringify(hash);
ent};


router.get("/getPayment", authenticate, async (req, res) => {
  try {
    const userid = req.user.id;

    const userPayment = await Paymentmodel.findOne({ user: userid })
      .sort({ createdAt: -1 });


    if (!userPayment) {
      return res.json({ active: false, message: "No payment found" });
    }

    const now = new Date();


    if (userPayment.expire_at < now) {

      return res.json({
        active: false,
        expired: true,
        message: "Your subscription has expired",
      });
    }


    return res.json({
      active: true,
      expired: false,
      data: userPayment,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/paymentverify/:data", authenticate, async (req, res) => {
  try {
    const userid = req.user.id;
    const duration = req.body.duration;
    const { data } = req.params;


    const decodedString = Buffer.from(data, "base64").toString("utf8");
    const decoded = JSON.parse(decodedString);


    const hashString = `transaction_code=${decoded.transaction_code},status=${decoded.status},total_amount=${decoded.total_amount},transaction_uuid=${decoded.transaction_uuid},product_code=${decoded.product_code},signed_field_names=${decoded.signed_field_names}`;

    const secret = "8gBm/:&EnhH.1/q";
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    const serverSig = CryptoJS.enc.Base64.stringify(hash);

    if (serverSig === decoded.signature) {

      const existingPayment = await Paymentmodel.findOne({
        payment_transaction_uuid: decoded.transaction_uuid,
      });

      if (existingPayment) {
    
        return res.json({
          success: true,
          data: existingPayment,
          message: "Payment already recorded",
        });
      }


     const payment = await Paymentmodel.findOneAndUpdate(
  { payment_transaction_uuid: decoded.transaction_uuid },
  {
    $setOnInsert: {
      user: userid,
      payment_amount: decoded.total_amount,
      payment_status: "PAID",
      duration: duration,
      payment_transaction_uuid: decoded.transaction_uuid,
    },
  },
  {
    new: true,
    upsert: true,
  }
);
      await paymentmodel.save();

      return res.json({ success: true, data: decoded });
    } else {
      return res.json({ success: false, message: "INVALID SIGNATURE" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/payment-history", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Paymentmodel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },

    
      {
        $sort: { created_at: -1 },
      },

  
      {
        $group: {
          _id: "$payment_transaction_uuid",
          doc: { $first: "$$ROOT" },
        },
      },

  
      {
        $replaceRoot: { newRoot: "$doc" },
      },


      {
        $sort: { created_at: -1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;

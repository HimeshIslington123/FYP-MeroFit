import express from "express";
import CryptoJS from "crypto-js";
import { authenticate } from "../Auth/Middleware.js";
import Paymentmodel from "../Model/GymPayment.js";

const router = express.Router();

// Function to generate signature again (same as frontend)
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

    // Get the latest payment for user
    const userPayment = await Paymentmodel.findOne({ user: userid })
      .sort({ createdAt: -1 });

    // No payment found
    if (!userPayment) {
      return res.json({ active: false, message: "No payment found" });
    }

    const now = new Date();

    // Check if expired
    if (userPayment.expire_at < now) {
      // Expired case
      return res.json({
        active: false,
        expired: true,
        message: "Your subscription has expired",
      });
    }

    // Payment still active
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

    // Decode Base64 data
    const decodedString = Buffer.from(data, "base64").toString("utf8");
    const decoded = JSON.parse(decodedString);

    // Build hash string for signature verification
    const hashString = `transaction_code=${decoded.transaction_code},status=${decoded.status},total_amount=${decoded.total_amount},transaction_uuid=${decoded.transaction_uuid},product_code=${decoded.product_code},signed_field_names=${decoded.signed_field_names}`;

    const secret = "8gBm/:&EnhH.1/q";
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    const serverSig = CryptoJS.enc.Base64.stringify(hash);

    if (serverSig === decoded.signature) {
      // Check if this transaction already exists
      const existingPayment = await Paymentmodel.findOne({
        payment_transaction_uuid: decoded.transaction_uuid,
      });

      if (existingPayment) {
        // Already saved, return existing data
        return res.json({
          success: true,
          data: existingPayment,
          message: "Payment already recorded",
        });
      }

      // Create new payment entry
      const paymentmodel = new Paymentmodel({
        user: userid,
        payment_amount: decoded.total_amount,
        payment_status: "PAID",
        duration: duration,
        payment_transaction_uuid: decoded.transaction_uuid,
      });

      await paymentmodel.save();

      return res.json({ success: true, data: decoded });
    } else {
      return res.json({ success: false, message: "INVALID SIGNATURE" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

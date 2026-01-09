import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register_fyp",
    required: true,
  },
  payment_amount: { type: Number, required: true },
  payment_status: { type: String, default: "pending" },
  payment_transaction_uuid: String,

  created_at: { type: Date, default: Date.now },

  duration: { type: Number, required: true }, // in months

  expire_at: {
    type: Date,
    default: function () {
      const months = this.duration || 1; 
      const createdDate = this.created_at || Date.now();
      return new Date(
        createdDate.getTime() + months * 30 * 24 * 60 * 60 * 1000
      );
    },
  },
});

const Paymentmodel = mongoose.model("Paymenttable", paymentSchema);

export default Paymentmodel;

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import esewa from "../assets/esewa_logo.png";

const Payment = ({ amount, label }) => {
  const [formData, setformData] = useState({
    amount: amount || "10000",
    tax_amount: "0",
    total_amount: amount || "10000",
    transaction_uuid: uuidv4(),
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: "http://localhost:5173/paymentsuccess",
    failure_url: "http://localhost:5173/paymentfailure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });

  // generate signature function
  const generateSignature = (
    total_amount,
    transaction_uuid,
    product_code,
    secret
  ) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
    return hashedSignature;
  };

  // useeffect
  useEffect(() => {
    const { total_amount, transaction_uuid, product_code, secret } = formData;
    const hashedSignature = generateSignature(
      total_amount,
      transaction_uuid,
      product_code,
      secret
    );

    setformData({ ...formData, signature: hashedSignature });
  }, [formData.amount]);

  return (
    <form
      className="bg-gray-800 flex flex-col gap-[10px] p-[20px] rounded-2xl"
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
    >
      <h1 className="text-[30px] text-center">Checkout</h1>
      <div className="w-full">
        <div className="flex justify-between">
          <h1>For month</h1>
          <h1>{label}</h1>
        </div>



        <div className="flex justify-between">
          <h1>Amount</h1>
          <h1>{amount}</h1>
        </div>



        <div className="flex justify-between">
          <h1>Total</h1>
          <h1>{amount}</h1>
        </div>
      </div>


      <div className="field">
        <input
          hidden
          type="text"
          id="amount"
          name="amount"
          autoComplete="off"
          value={formData.amount}
          onChange={({ target }) =>
            setformData({
              ...formData,
              amount: target.value,
              total_amount: target.value,
            })
          }
          required
        />
      </div>
      <input
        type="hidden"
        id="tax_amount"
        name="tax_amount"
        value={formData.tax_amount}
        required
      />
      <input
        type="hidden"
        id="total_amount"
        name="total_amount"
        value={formData.total_amount}
        required
      />
      <input
        type="hidden"
        id="transaction_uuid"
        name="transaction_uuid"
        value={formData.transaction_uuid}
        required
      />
      <input
        type="hidden"
        id="product_code"
        name="product_code"
        value={formData.product_code}
        required
      />
      <input
        type="hidden"
        id="product_service_charge"
        name="product_service_charge"
        value={formData.product_service_charge}
        required
      />
      <input
        type="hidden"
        id="product_delivery_charge"
        name="product_delivery_charge"
        value={formData.product_delivery_charge}
        required
      />
      <input
        type="hidden"
        id="success_url"
        name="success_url"
        value={formData.success_url}
        required
      />
      <input
        type="hidden"
        id="failure_url"
        name="failure_url"
        value={formData.failure_url}
        required
      />
      <input
        type="hidden"
        id="signed_field_names"
        name="signed_field_names"
        value={formData.signed_field_names}
        required
      />
      <input
        type="hidden"
        id="signature"
        name="signature"
        value={formData.signature}
        required
      />
<div className="flex justify-end">
  <button
    type="submit"
    className="flex items-center w-full justify-center gap-2 border border-amber-50 px-6 py-2  rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
  >
   
    Pay via  <img src={esewa} alt="eSewa" className="object-contain w-[60px] h-[60px]" />
  </button>
</div>

    </form>
  );
};

export default Payment;

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [search] = useSearchParams();
  const dataQuery = search.get("data");    // <-- eSewa Base64 data
  const token = localStorage.getItem("token");
  const [values, setValues] = useState(null);

  const duration = localStorage.getItem("duration");


  useEffect(() => {
    const verify = async () => {
      const res = await axios.post(
        `http://localhost:4000/esewa/paymentverify/${dataQuery}`,{duration},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setValues(res.data);
    };

    verify();
  }, []);

  if (!values) return <p>Loading…</p>;

  return (
    <div>
      {values.success ? (
        <>
          <h1>Payment Successful</h1>
          <p>Amount: Rs. {values.data.total_amount}</p>
        </>
      ) : (
        <>
          <h1>Payment Failed</h1>
          <p>{values.message}</p>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;

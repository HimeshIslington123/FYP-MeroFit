import React from "react";
import { useParams } from "react-router-dom";
import offerDetails from "../../data/Whatweofferdata";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Whatweoffer = () => {
  const { id } = useParams();

  const findid = offerDetails.find((offer) => offer.id === parseInt(id));
  return (
    <>
      <Header></Header>

      <div className="w-full  md:p-[20px] p-[10px] ">
        <div className="w-full overflow-hidden flex md:flex-row  flex-col gap-[20px] items-center ">
          <img
            className="w-[100%] md:w-[50%] md:h-[500px] h-[300px] object-cover "
            src={findid.image}
          ></img>

          <div className="flex flex-col md:gap-[40px] gap-[20px]">
            <div>
              <h1 className="text-[40px] m-[0]  ">{findid.title}</h1>
              <p className="text-justify">{findid.paragraph}</p>
            </div>

          
              <div>
                <h1 className="text-[30px] ">Special feature we offer:</h1>
                <ul >
                  {findid.features.map((i) => (
                    <li className="list-decimal list-inside ">{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-[20px] text-[20px] mb-[30px] ">
            <h1 className="text-[30px] mb-[10px]">Our package</h1>
        
          <table className="border-2 w-[100%] border-black border-collapse">
            <thead style={{background:'#9CA3AF'}} className=" text-white font-medium">
              <tr>
                <th className="border border-black px-6 py-3">SN</th>
                <th className="border border-black px-6 py-3">For</th>
                <th className="border border-black px-6 py-3">Pricing</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(findid.pricing).map(([period, price], index) => (
                <tr key={index}>
                  <td className="border border-black px-6 py-3">{index + 1}</td>
                  <td className="border border-black px-6 py-3 capitalize">
                    {period}
                  </td>
                  <td className="border border-black px-6 py-3">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
          <Footer></Footer>
      
    </>
  );
};

export default Whatweoffer;

import React from "react";

const Form = () => {
  return (
    <div className="p-[30px] flex justify-center w-full">
      <form className="flex flex-col w-[75%] p-[20px]  rounded-xl bg-gray-300">
        <div>
          <h1 className="text-center text-[35px]">Have a question?</h1>
          <h1 className="text-center text-[27px]">Feel free to Contact us</h1>
        </div>

        <div className="flex p-[50px] w-full justify-between">
          <div className="flex-1">
            <h3>Location:idndd</h3>
            <h3>Email:hiwdndn$@gmail.com</h3>
            <h3>93838337339</h3>
          </div>
          <div className="flex flex-2 flex-col">
            <input
              className=" h-[40px] w-[60%] outline-none bg-orange-50 rounded"
              placeholder="Name"
            ></input>
            <input
              className=" h-[40px]  w-[60%]"
              type="email"
              placeholder="email address"
            ></input>
            <input className=" h-[50px]  w-[60%]" placeholder="message"></input>
            <button className=" w-[60%]">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;

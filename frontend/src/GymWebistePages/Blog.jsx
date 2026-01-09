import React from "react";
import Header from "../Components/Header";
import lady1 from "../assets/lady-1.jpg";
import lady2 from "../assets/lady-2.jpg";
import gym from "../assets/gymImage.jpg";
import Footer from "../Components/Footer";
const Blog = () => {
  return (
    <>
      <Header></Header>
      <h1 className="text-center text-[30px]">Blog</h1>
      <div className="p-[30px]] w-full md:flex-row flex-col flex gap-[50px]  ">
        <div className="w-[100%] md:w-[25%] p-[10px] rounded-xl bg-gray-100">
          <div className="w-full flex justify-center">
            <img className="  rounded-xl" src={gym}></img>
          </div>

          <div className="flex flex-col gap-[10px]">
            <div>
              <p className="text-shadow-gray-900 text-[15px] text-lime-900">
                Gym opening
              </p>
              <h1 className="text-[17px] ">Athelic land 2nd gym opening</h1>
            </div>

            <p className="text-left">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
              sapiente laboriosam ad eaque recusandae expedita quasi quod
              voluptas eveniet deserunt perferendis at ratione quas optio,
              aliquam quia corrupti saepe officia.
            </p>
          </div>
          <div className="flex mt-[20px] gap-[10px] ">
            <img
              className="w-[50px] h-[50px] object-cover rounded-full"
              src={lady2}
            ></img>
            <div className="flex flex-col">
              <h3>Himesh shakya</h3>
              <h4>20 Jan 2025</h4>
            </div>
          </div>
        </div>





                <div className="w-[100%] md:w-[25%] p-[10px] rounded-xl bg-gray-100">
          <div className="w-full flex justify-center">
            <img className="  rounded-xl" src={gym}></img>
          </div>

          <div className="flex flex-col gap-[10px]">
            <div>
              <p className="text-shadow-gray-900 text-[15px] text-lime-900">
                Gym opening
              </p>
              <h1 className="text-[17px] ">Athelic land 2nd gym opening</h1>
            </div>

            <p className="text-left">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
              sapiente laboriosam ad eaque recusandae expedita quasi quod
              voluptas eveniet deserunt perferendis at ratione quas optio,
              aliquam quia corrupti saepe officia. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut quas excepturi unde veniam atque maiores a iure illum. Quaerat molestiae at ab obcaecati molestias dolorum deleniti vel omnis aut sapiente?
            </p>
          </div>
          <div className="flex mt-[20px] gap-[10px] ">
            <img
              className="w-[50px] h-[50px] object-cover rounded-full"
              src={lady2}
            ></img>
            <div className="flex flex-col">
              <h3>Himesh shakya</h3>
              <h4>20 Jan 2025</h4>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Blog;

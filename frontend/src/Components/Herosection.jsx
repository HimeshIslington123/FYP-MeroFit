import React from 'react'
import gymlogo from "../assets/gym_bg.png"

const Herosection = () => {
  return (
    <div className='w-full h-[600px] relative'>
      {/* Background Image */}
      <img src={gymlogo} alt="Gym Background" className='w-full h-full object-cover' />


      {/* Centered Content */}
      <div className='absolute inset-0 flex flex-col justify-end items-center mb-[30px] gap-4'>
      
        <div className='flex gap-4'>
          <button className='bg-orange-500 cursor-pointer text-white px-6 transition py-2 rounded'>Contact us</button>
          <button className='bg-transparent cursor-pointer border text-white px-6 py-2 rounded'>View pricing</button>
        </div>
      </div>
    </div>
  )
}

export default Herosection

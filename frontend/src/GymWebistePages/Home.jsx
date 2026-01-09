import React from 'react'
import Header from '../Components/Header'
import Herosection from '../Components/Herosection'
import WeOffer from '../Components/WeOffer'
import Footer from '../Components/Footer'
import Testimonal from '../Components/Testimonal'
import Form from '../Components/Form'
const Home = () => {
  return (
    <div className='w-full overflow-hidden'>
      <Header></Header>
      <Herosection></Herosection>
      <WeOffer></WeOffer>
      <Testimonal></Testimonal>
      <Form></Form>
      <Footer></Footer>
    </div>
  )
}

export default Home

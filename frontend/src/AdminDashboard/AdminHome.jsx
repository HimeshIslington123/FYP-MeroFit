import React from 'react'
import Navbar from '../AdminDashboardComponent/Navbar'
import AddTrainer from '../AdminDashboardComponent/Addtrainer'

const AdminHome = () => {
  return (
    <div>
      <Navbar></Navbar>
      <h1>Admin dashboard</h1>
      <AddTrainer></AddTrainer>
    </div>
  )
}

export default AdminHome

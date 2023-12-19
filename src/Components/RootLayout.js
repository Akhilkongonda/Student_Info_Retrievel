import React from 'react'
import Signup from './Signup';
import { Outlet } from 'react-router-dom';
function RootLayout() {
  return (
    <div className='m-0'>
      <div className='m-0'>
     
      <Outlet />
      </div>
     
    </div>
  )
}

export default RootLayout
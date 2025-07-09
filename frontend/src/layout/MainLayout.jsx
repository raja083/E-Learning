import Navbar from '@/components/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function mainLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar/>
      <div className='flex-1 mt-16'>
         <Outlet/> {/*  the children components will be displayed in outlet section */}
      </div>
    </div>
  )
}

import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './ShopingHeader'

const Layout = () => {
  return (
    <div className='flex flex-col bg-white overflow-hidden'>
        {/* commo header */}
        <Header/>
        <main className='flex flex-col w-full'>
            <Outlet/>
        </main>
    </div>
  )
}

export default Layout
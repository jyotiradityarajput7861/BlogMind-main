import { Navbar } from '@/components/Nav'

import React from 'react'

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default Layout
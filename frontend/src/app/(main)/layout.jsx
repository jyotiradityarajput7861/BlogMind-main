
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Navbar } from '@/components/Nav';

const Layout = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId="292796034204-q53acc2h0kb4bek977so85hpepc3s0fb.apps.googleusercontent.com">      
      <Navbar />
    {children}</GoogleOAuthProvider>

    
  )
}

export default Layout
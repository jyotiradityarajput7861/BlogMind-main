'use client';

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { Menu, X, Settings, LogOut, HelpCircle, MessageSquare } from "lucide-react"
import { Logout } from "@mui/icons-material"
import useAppContext from "@/context/AppContext"

export function MobileMenu({ items }) {
  const [isOpen, setIsOpen] = useState(false)
  const [personalData, setPersonalData] = useState([])
  const { userLoggedIn, email, logout } = useAppContext();

  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        const email = JSON.parse(localStorage.getItem("user"))?.email; // Get email from localStorage
        if (!email) return; // Prevent unnecessary API call

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getbyemail/${email}`);
        setPersonalData(res.data);
      } catch (error) {
        console.error("Error fetching personal data:", error);
      }
    };

    fetchPersonalData();
  }, []); // Runs only once when the component mounts

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-md text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <X className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-black block px-3 py-2 rounded-md text-base font-medium relative group"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
              </Link>
            ))}
            <Link
              href="/settings"
              className="text-black block px-3 py-2 rounded-md text-base font-medium relative group"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>My Settings</span>
              </div>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/help"
              className="text-black block px-3 py-2 rounded-md text-base font-medium relative group"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>Help</span>
              </div>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/feedback"
              className="text-black block px-3 py-2 rounded-md text-base font-medium relative group"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Feedback</span>
              </div>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </Link>
            <button
              onClick={logout}
              className="w-full text-left text-black block px-3 py-2 rounded-md text-base font-medium relative group"
            >
              <div className="flex items-center space-x-2">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </div>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

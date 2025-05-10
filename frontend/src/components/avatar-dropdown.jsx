"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { User, Settings, LogOut, HelpCircle, MessageSquare, ChevronDown } from "lucide-react"
import useAppContext from "@/context/AppContext";
import { Avatar } from "@heroui/react";
import axios from "axios";

export function AvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { userLoggedIn, email, logout } = useAppContext();
  const [personalData, setPersonalData] = useState([]); // ✅ Now inside the component

  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        if (!email) return; // Prevent unnecessary API call if email is missing
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getbyemail/${email}`);
        setPersonalData(res.data);
      } catch (error) {
        console.error("Error fetching personal data:", error);
      }
    };

    fetchPersonalData();
  }, [email]); // ✅ Dependency added to re-run when email changes

  // Memoized function to prevent re-renders
  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]); // ✅ Only runs when `handleClickOutside` changes

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-black hover:bg-gray-200 p-2 rounded-md"
      >
      <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="primary"
            name="Jason Hughes"
            size="md"
            src={personalData.avatar} alt="https://imgs.search.brave.com/4pQHXz65KDgDjM0lMYhZRwtXX_SVX8YvGF86T2OOPjg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzYxL2Y3/LzVlLzYxZjc1ZWE5/YTY4MGRlZjJlZDFj/NjkyOWZlNzVhZWVl/LmpwZw"
          />
        
      </button>
      {isOpen && (
        <div className="absolute z-40 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <DropdownItem href="/settings" icon={<Settings className="mr-3 h-4 w-4" />} label="My Settings" />
          <DropdownItem href="/help" icon={<HelpCircle className="mr-3 h-4 w-4" />} label="Help" />
          <DropdownItem href="/feedback" icon={<MessageSquare className="mr-3 h-4 w-4" />} label="Feedback" />
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-black relative group"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
          </button>
        </div>
      )}
    </div>
  );
}

// ✅ Extracted a reusable DropdownItem component for cleaner code
const DropdownItem = ({ href, icon, label }) => (
  <Link href={href} className="flex items-center px-4 py-2 text-sm text-black relative group">
    {icon}
    {label}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
  </Link>
);

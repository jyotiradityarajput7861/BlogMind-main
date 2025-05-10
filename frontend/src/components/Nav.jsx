// "use client"
// import Link from "next/link"
// import { MobileMenu } from "./Nav-mobile"
// import { AvatarDropdown } from "./avatar-dropdown"
// import { GalleryVerticalEnd, Coins } from "lucide-react"
// import { useEffect, useState } from "react"
// import axios from "axios"
// import useAppContext from "@/context/AppContext"
// import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"
// import Image from "next/image"
// import { useParams } from "next/navigation"

// const navItems = 
 
// [
//   { label: "Features", href: "/Features" },
//   { label: "Competition", href: "/competition" },
//   { label: "Blog", href: `/blog/${id}` },
//   { label: "Top Bloggers", href: "/Rankers" },
// ];

// export function Navbar() {
//   const [personalData, setPersonalData] = useState([]); // ✅ Now inside the component
//   const { userLoggedIn, email, logout } = useAppContext();

//   useEffect(() => {
//     const fetchPersonalData = async () => {
//       try {
//         if (!email) return; // Prevent unnecessary API call if email is missing
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getbyemail/${email}`);
//         setPersonalData(res.data);
//       } catch (error) {
//         console.error("Error fetching personal data:", error);
//       }
//     };
//     const {id}= useParams();
//     fetchPersonalData();
//   }, [email]); // ✅ Dependency added to re-run when email changes

//   const showLoginOptions = () => {
//     if (userLoggedIn) {
//       return (
//         <div class>


//           <div className="hidden md:flex items-center space-x-4 z-30 ">
// <Link href='/user/add-blog' title="Add New" className="group cursor-pointer outline-none hover:rotate-90 duration-300">
//   <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" className="stroke-lime-400 fill-none group-hover:fill-lime-800 group-active:stroke-lime-200 group-active:fill-lime-600 group-active:duration-0 duration-300">
//     <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" strokeWidth="1.5" />
//     <path d="M8 12H16" strokeWidth="1.5" />
//     <path d="M12 16V8" strokeWidth="1.5" />
//   </svg>
// </Link>
//             <div className="flex items-center space-x-2 text-black">
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-10">
//                 <circle cx={100} cy={100} r={95} fill="maroon" stroke="darkgoldenrod" strokeWidth={5} />
//                 <circle cx={100} cy={100} r={70} fill="lightgoldenrodyellow" />
//                 <path d="M100 30 L110 80 L170 85 L120 120 L130 170 L100 140 L70 170 L80 120 L30 85 L90 80 Z" fill="black" stroke="darkgoldenrod" strokeWidth={2} />
//                 <circle cx={100} cy={100} r={98} fill="none" stroke="yellow" strokeWidth={3} opacity="0.5" />
//               </svg>

//               <span>{personalData.coins ?? 0}</span> {/* ✅ Use dynamic data */}
//             </div>
//             <Dropdown placement="bottom-end" className="text-black">
//               <DropdownTrigger>
//                 <Avatar
//                   isBordered
//                   as="button"
//                   className="transition-transform"
//                   color="primary"
//                   name="Jason Hughes"
//                   size="sm"
//                   src={personalData.avatar || "https://imgs.search.brave.com/4pQHXz65KDgDjM0lMYhZRwtXX_SVX8YvGF86T2OOPjg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzYxL2Y3/LzVlLzYxZjc1ZWE5/YTY4MGRlZjJlZDFj/NjkyOWZlNzVhZWVl/LmpwZw"}
//                   alt="User Avatar"
//                 />
//               </DropdownTrigger>
//               <DropdownMenu aria-label="Profile Actions" variant="flat">
//                 <DropdownItem key="profile" className="h-14 gap-2">
//                   <p className="font-semibold text-black">Signed in as</p>
//                   <p className="font-semibold">{email}</p>
//                 </DropdownItem>
//                 <DropdownItem  key="settings">
//                   <Link href='/user/Dashboard'>
//                 My Settings</Link>
//                 </DropdownItem>
//                 <DropdownItem onPress={logout} key="logout" color="danger">
//                   Log Out
//                 </DropdownItem>
//               </DropdownMenu>
//             </Dropdown>
//           </div>
//           <div className="md:hidden flex items-center space-x-4">
//             <div className="flex items-center space-x-2 text-black">
//               <div className="h-5 w-5" />
//               <span>{personalData.coins ?? 0}</span> {/* ✅ Use dynamic data */}
//             </div>
//             <MobileMenu items={navItems} />
//           </div>
//         </div>
//       );
//     } else {
//       return <Link href="/Authentication">Login</Link>;
//     }
//   };

//   return (
//     <nav className="bg-background shadow-md ">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//           <Link className="mr-4 object-contain size-16 " href="/">
//           <div className="hidden object-contain sm:block font-bold text-inherit text-start ">
//             <Image src="/black.png" alt="" className="bg-none"   
//              width={50} // Replace 50 with the desired width
//              height={50}/>
//           </div>
//         </Link>
//             <div className="hidden md:block">
//               <div className="ml-10 flex items-baseline space-x-4">
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.label}
//                     href={item.href}
//                     className="text-black hover:text-black px-3 py-2 rounded-md text-sm font-medium relative group"
//                   >
//                     {item.label}
//                     <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>
//           {showLoginOptions()}
//         </div>
//       </div>
//     </nav>
//   );
// }
"use client"
import Link from "next/link"
import { MobileMenu } from "./Nav-mobile"
import { AvatarDropdown } from "./avatar-dropdown"
import { GalleryVerticalEnd, Coins } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import useAppContext from "@/context/AppContext"
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react"
import Image from "next/image"
import { useParams } from "next/navigation"

export function Navbar() {
  const [personalData, setPersonalData] = useState([]);
  const { userLoggedIn, email, logout } = useAppContext();
  const params = useParams();
  const id = params?.id || ""; // Safe fallback if id not present

  const navItems = [
    { label: "Features", href: "/Features" },
    { label: "Competition", href: "/competition" },
    { label: "Blog", href: `/blog/${id}` },
    { label: "Top Bloggers", href: "/Rankers" },
  ];

  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        if (!email) return;
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getbyemail/${email}`);
        setPersonalData(res.data);
      } catch (error) {
        console.error("Error fetching personal data:", error);
      }
    };

    fetchPersonalData();
  }, [email]);

  const showLoginOptions = () => {
    if (userLoggedIn) {
      return (
        <div className="">
          <div className="hidden md:flex items-center space-x-4 z-30 ">
            <Link href="/user/add-blog" title="Add New" className="group cursor-pointer outline-none hover:rotate-90 duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" className="stroke-lime-400 fill-none group-hover:fill-lime-800 group-active:stroke-lime-200 group-active:fill-lime-600 group-active:duration-0 duration-300">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" strokeWidth="1.5" />
                <path d="M8 12H16" strokeWidth="1.5" />
                <path d="M12 16V8" strokeWidth="1.5" />
              </svg>
            </Link>

            <div className="flex items-center space-x-2 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-10">
                <circle cx={100} cy={100} r={95} fill="maroon" stroke="darkgoldenrod" strokeWidth={5} />
                <circle cx={100} cy={100} r={70} fill="lightgoldenrodyellow" />
                <path d="M100 30 L110 80 L170 85 L120 120 L130 170 L100 140 L70 170 L80 120 L30 85 L90 80 Z" fill="black" stroke="darkgoldenrod" strokeWidth={2} />
                <circle cx={100} cy={100} r={98} fill="none" stroke="yellow" strokeWidth={3} opacity="0.5" />
              </svg>
              <span>{personalData.coins ?? 0}</span>
            </div>

            <Dropdown placement="bottom-end" className="text-black">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name="User"
                  size="sm"
                  src={personalData.avatar || "https://via.placeholder.com/150"}
                  alt="User Avatar"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold text-black">Signed in as</p>
                  <p className="font-semibold">{email}</p>
                </DropdownItem>
                <DropdownItem key="settings">
                  <Link href="/user/Dashboard">My Settings</Link>
                </DropdownItem>
                <DropdownItem onPress={logout} key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-black">
              <div className="h-5 w-5" />
              <span>{personalData.coins ?? 0}</span>
            </div>
            <MobileMenu items={navItems} />
          </div>
        </div>
      );
    } else {
      return <Link href="/Authentication">Login</Link>;
    }
  };

  return (
    <nav className="bg-background shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link className="mr-4 object-contain size-16" href="/">
              <div className="hidden object-contain sm:block font-bold text-inherit text-start">
                <Image src="/black.png" alt="" width={50} height={50} />
              </div>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-black hover:text-black px-3 py-2 rounded-md text-sm font-medium relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {showLoginOptions()}
        </div>
      </div>
    </nav>
  );
}

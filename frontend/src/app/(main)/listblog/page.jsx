'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { formatDistance } from 'date-fns';
import './style.css'
import Link from 'next/link';
import {RadioGroup, Radio} from "@heroui/react";
import AnimatedContent from '../../../components/Animated-content';
import Image from 'next/image';


const BlogList = () => {
  const [blogList, setBlogList] = useState([]);
  const [masterList, setMasterList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [sortOption, setSortOption] = useState(''); // State for sorting option

  const fetchBlogData = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/getall/`);
    const data = res.data;
    console.log(data);
    setBlogList(data);
    setMasterList(data);
  };

  const searchBlogName = (e) => {
    const value = e.target.value;
    const filteredBlogList = masterList.filter((blog) =>
      blog.title.toLowerCase().includes(value.toLowerCase())
    );
    setBlogList(filteredBlogList);
  };

  const filterCategory = (category) => {
    const updatedCategories = new Set(selectedCategories);
    if (updatedCategories.has(category)) {
      updatedCategories.delete(category);
    } else {
      updatedCategories.add(category);
    }
    setSelectedCategories(updatedCategories);

    if (updatedCategories.size === 0) {
      setBlogList(masterList);
    } else {
      const filteredBlogList = masterList.filter((blog) =>
        updatedCategories.has(blog.category)
      );
      setBlogList(filteredBlogList);
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);

    let sortedBlogList = [...blogList];
    if (value === 'most-views') {
      sortedBlogList.sort((a, b) => b.viewCount - a.viewCount);
    } else if (value === 'least-views') {
      sortedBlogList.sort((a, b) => a.viewCount - b.viewCount);
    }
    setBlogList(sortedBlogList);
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  return <div className='h-screen'>
    <div className='hola'>
      <div className='text-center '>
      <div className="relative overflow-hidden">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold text-black ">
                BLOGS
              </h1>
              <p className="mt-3">
                Stay in the know with insights from industry experts.
              </p>
              <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
                {/* Form */}
                <form>
                  <div className="relative z-10 flex gap-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
                    <div className="w-full">
                      <label
                        htmlFor="hs-search-article-1"
                        className="block text-sm text-gray-700 font-medium dark:text-white"
                      >
                        <span className="sr-only">Search article</span>
                      </label>
                      <input
                        onChange={searchBlogName}
                        className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        placeholder="Search article"
                      />
                    </div>
                  </div>
                </form>
                {/* End Form */}
                {/* SVG Element */}
                <div className="hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20">
                  <svg
                    className="w-16 h-auto text-orange-500"
                    width={121}
                    height={135}
                    viewBox="0 0 121 135"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                      stroke="currentColor"
                      strokeWidth={10}
                      strokeLinecap="round"
                    />
                    <path
                      d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                      stroke="currentColor"
                      strokeWidth={10}
                      strokeLinecap="round"
                    />
                    <path
                      d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                      stroke="currentColor"
                      strokeWidth={10}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                {/* End SVG Element */}
                {/* SVG Element */}
                <div className="hidden md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32">
                  <svg
                    className="w-40 h-auto text-cyan-500"
                    width={347}
                    height={188}
                    viewBox="0 0 347 188"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                      stroke="currentColor"
                      strokeWidth={7}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                {/* End SVG Element */}
              </div>
                  <div className="mt-10 sm:mt-20">
                    <button                  
                    onClick={() => { filterCategory('Education') }}
                    className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="#">
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-backpack"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 18v-6a6 6 0 0 1 6 -6h2a6 6 0 0 1 6 6v6a3 3 0 0 1 -3 3h-8a3 3 0 0 1 -3 -3z" /><path d="M10 6v-1a2 2 0 1 1 4 0v1" /><path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" /><path d="M11 10h2" /></svg>
                      Education
                    </button>
                    <button 
                    onClick={() => { filterCategory('Entertainment') }}
                    className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="#">
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-building-carousel"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" /><path d="M5 8m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M12 4m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19 8m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M8 22l4 -10l4 10" /></svg>                     
                      Entertainment
                    </button>
                    <button 
                    onClick={() => { filterCategory('Food & Drink') }}
                    className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="#">
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-grill"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 8h-14a6 6 0 0 0 6 6h2a6 6 0 0 0 6 -5.775l0 -.225z" /><path d="M17 20a2 2 0 1 1 0 -4a2 2 0 0 1 0 4z" /><path d="M15 14l1 2" /><path d="M9 14l-3 6" /><path d="M15 18h-8" /><path d="M15 5v-1" /><path d="M12 5v-1" /><path d="M9 5v-1" /></svg>                      
                      Food & Drink
                    </button>
                    <button 
                    onClick={() => { filterCategory('Design & Creativity') }}
                    className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="#">
                      <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
                      Design & Creativity
                    </button>
                    <button 
                    onClick={() => { filterCategory('Environment & Sustainibility') }}
                    className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="#">
                      <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
                      Environment & Sustainibility
                    </button>
                    <button className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="#">
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-robot"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" /><path d="M12 2v2" /><path d="M9 12v9" /><path d="M15 12v9" /><path d="M5 16l4 -2" /><path d="M15 14l4 2" /><path d="M9 18h6" /><path d="M10 8v.01" /><path d="M14 8v.01" /></svg>
                      Technology
                    </button>
                    <button 
                    onClick={() => { filterCategory('Lifestyle') }}
                    className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="#">
                      <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></svg>
                      Lifestyle
                    </button>
                    <button 
                    onClick={() => { filterCategory('Lifestyle') }}
                    className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="#">
                      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-cricket"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.105 18.79l-1 .992a4.159 4.159 0 0 1 -6.038 -5.715l.157 -.166l8.282 -8.401l1.5 1.5l3.45 -3.391a2.08 2.08 0 0 1 3.057 2.815l-.116 .126l-3.391 3.45l1.5 1.5l-3.668 3.617" /><path d="M10.5 7.5l6 6" /><path d="M14 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>
                      Sports & Fitness
                    </button>
                    <button 
                    onClick={() => { filterCategory('Parenting & Family') }}
                    className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="#">
                      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-hearts"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14.017 18l-2.017 2l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 0 1 8.153 5.784" /><path d="M15.99 20l4.197 -4.223a2.81 2.81 0 0 0 0 -3.948a2.747 2.747 0 0 0 -3.91 -.007l-.28 .282l-.279 -.283a2.747 2.747 0 0 0 -3.91 -.007a2.81 2.81 0 0 0 -.007 3.948l4.182 4.238z" /></svg>                      Parenting & Family
                    </button>
                  </div>
                  <div >
                    <select className='bg-neutral-800 rounded text-white p-4' value={sortOption} onChange={handleSortChange}>
                      <option value="">Sort by</option>
                      <option value="most-views">Most Views</option>
                      <option value="least-views">Least Views</option>
                    </select>
                  </div>

            </div>
          </div>
        </div>      
        </div >





      <section className="text-gray-600 body-font">
        <div className="contain px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {
              blogList.map((blog, index) => (

                <Link href={'/blog/' + blog._id} className="p-4 md:w-1/3" key={index}>
                  <AnimatedContent
                    distance={150}
                    direction="horizontal"
                    reverse={true}
                    config={{ tension: 80, friction: 20 }}
                    initialOpacity={0.2}
                    animateOpacity
                    scale={1.1}
                    threshold={0.2}>
                    <div className="max-w-lg bg-white rounded-xl shadow-xl min-h-full overflow-hidden">
                      <Image 
                        src={blog.image} 
                        alt="Yoga Pose" 
                        width={500} // Replace with the appropriate width
                        height={300} // Replace with the appropriate height
                        className="w-full h-72 object-cover hover:scale-105 duration-700" 
                      />
                      <div className="p-5">
                        <div className="text-lg font-semibold flex flex-row justify-between">
                          <div className=''>
                            {blog.title}
                          </div>
                          <div className='flex flex-row'>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="24" 
                              height="24" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              className="icon icon-tabler icons-tabler-outline icon-tabler-eye w-8 hover:scale-125 duration-200 hover:stroke-blue-500"
                            >
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                              <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                            </svg>
                            {blog.viewCount}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-1 h-20 overflow-hidden hover:overflow-y-scroll">
                          {blog.description}
                        </p>
                        <div className='flex flex-row justify-between'>
                          <div className="flex gap-2 mt-4">
                            {blog.tags && blog.tags.length > 0 ? (
                              blog.tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 text-xs bg-gray-200 rounded-full">
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs">No tags available</span>
                            )}
                          </div>
                          <div>
                            <br />
                            <span className="flex flex-wrap items-end">
                              {formatDistance(new Date(blog.createdAt).toDateString(), new Date(), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedContent>
                </Link>
              ))
    
              }


          </div>
        </div>

      </section>



    </div>
  </div>
}

export default BlogList
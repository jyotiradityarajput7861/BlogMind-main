'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const Listcomp = () => {
    const [Listcomp, setListcomp] = useState([]);

    const fetchcompData = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comp/getall/`);
        const data = res.data;
        console.log(data);
        setListcomp(data);
    }

    useEffect(() => {
        fetchcompData();
    }, []);

    return (
        <div className='h-screen'>
            <section className="text-gray-400 bg-gray-900 body-font">
                <div className="contain px-5 py-24 mx-auto">
                    <div className="grid flex-wrap grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {
                            Listcomp.map((comp, index) => (
                                <div className="p-4" key={index}>
                                    <Link href={'/viewcompetition/' + comp._id} className="relative group">
                                        <div className="bg-[#f5f5f5] shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                                            <div className="h-56 bg-cover bg-center hover:scale-125 duration-700" 
                                                style={{ backgroundImage: `url(${comp.image})` }} />
                                            <div className="p-6">
                                                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition duration-300">{comp.title}</h2>
                                                <p className="text-sm text-gray-500 mt-2">{new Date(comp.lastdate).toDateString()}</p>
                                                <p className="text-gray-700 mt-4">{comp.description}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Listcomp;

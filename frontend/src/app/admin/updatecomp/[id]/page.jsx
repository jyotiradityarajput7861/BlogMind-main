'use client'
import axios from 'axios';
import { Formik } from 'formik'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const UpdateComp = () => {
    const { id } = useParams();
    const [compData, setcompData] = useState(null);
    
    useEffect(() => {
        const fetchcompData = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comp/getbyid/` + id);
                const data = res.data;
                console.log(data);
                setcompData(data);
            } catch (error) {
                console.error("Error fetching competition data:", error);
                toast.error("Failed to load competition data");
            }
        };
        
        fetchcompData();
    }, [id]);
    
    const submitForm = (values) => {
        console.log(values);

        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/comp/update/` + id, values)
            .then((result) => {
                // Router.push('/manage-competition')
                console.log(result);
                toast.success('Competition updated successfully');
            })
            .catch((err) => {
                console.log(err);
                toast.error(err?.response?.data?.message || 'Something went wrong')
            });
    }

    return (compData !== null ? (
        <div>
            <Formik initialValues={compData} onSubmit={submitForm} className="text-gray-600 body-font relative">
                {(updateForm) => {
                    return (
                        <div className="container px-5 py-24 mx-auto">
                            <div className="flex flex-col text-center w-full mb-12">
                                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">UPDATE COMPETITION</h1>
                                <p className="lg:w-2/3 mx-auto leading-relaxed text-base">UPDATE YOUR COMPETITION</p>
                            </div>
                            <form className="lg:w-1/2 md:w-2/3 mx-auto" onSubmit={updateForm.handleSubmit}>
                                <div className="flex flex-wrap -m-2">
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label htmlFor="title" className="leading-7 text-sm text-gray-600">Title</label>
                                            <input
                                                onChange={updateForm.handleChange}
                                                value={updateForm.values.title}
                                                type="text" id="title" name="title"
                                                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        </div>
                                    </div>
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label htmlFor="lastdate" className="leading-7 text-sm text-gray-600">Deadline</label>
                                            <input
                                                onChange={updateForm.handleChange}
                                                value={updateForm.values.lastdate}
                                                type="date" id="lastdate" name="lastdate"
                                                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        </div>
                                    </div>
                                    <div className="p-2 w-full">
                                        <div className="relative">
                                            <label htmlFor="description" className="leading-7 text-sm text-gray-600">Description</label>
                                            <textarea
                                                onChange={updateForm.handleChange}
                                                value={updateForm.values.description}
                                                id="description" name="description"
                                                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" />
                                        </div>
                                    </div>
                                    <div className="p-2 w-full">
                                        <button type="submit" className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Update Competition</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )
                }}
            </Formik>
        </div>) : (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-xl font-medium">Loading competition data...</h1>
        </div>
    ));
}

export default UpdateComp;
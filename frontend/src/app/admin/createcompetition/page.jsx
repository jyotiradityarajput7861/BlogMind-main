'use client'
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import axios from 'axios';
import { FiHome, FiBarChart2, FiLogOut } from "react-icons/fi";
import Image from 'next/image';

const Competition = () => {
  const [deadline, setDeadline] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const compete = useFormik({
    initialValues: {
      name: '',
      description: '',
      image: '',
      title: '',
      lastdate: '',
    },
    onSubmit: (values, { resetForm }) => {
      // values.lastdate = deadline;
      console.log(values);

      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comp/add`, values)
        .then((result) => {
          toast.success('Blog posted successfully');
        }).catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.message || 'Something went wrong');
        });
      resetForm();
    }
  });

  const uploadImage = (e) => {
    const file = e.target.files[0];
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('upload_preset', 'myuploadpreset');
    formdata.append('cloud_name', 'de4osq89e');

    axios.post(`https://api.cloudinary.com/v1_1/de4osq89e/image/upload`, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((result) => {
        toast.success('File Uploaded Successfully');
        console.log(result.data);
        setPreviewUrl(result.data.url);
        compete.setFieldValue('image', result.data.url);
      }).catch((err) => {
        console.log(err);
        toast.error('File Upload Failed');
      });
  }

  return (
                <div className='flex flex-row'> 


    <div className='flex justify-center h-screen m-3 w-auto'>
      <div className='border w-11/12 border-gray-300'>
        <form onSubmit={compete.handleSubmit}>
          <div className="bg-white p-10 rounded-lg shadow-lg">
            <div className="flex flex-wrap gap-5 items-center w-full max-md:max-w-full mb-10">
              <>
                <>
                  <>
                    <label htmlFor="upload-image" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Cover image
                    </label>
                    <label htmlFor="upload-image" className="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700">
                      {previewUrl ? (
                        <Image width={500} height={400} src={previewUrl} alt="" className="max-w-full h-40 object-cover rounded-lg" />
                      ) : (
                        <svg className="size-90  mx-auto text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width={160} height={160} fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z" />
                          <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0- 1.952 1.708-3.318 3.781-3.318h8.906c1.814 0 3.313 1.431 3.313 3.318 0 1.636-1.242 2.969-2.834 3.151C12.923 12 10.69 14 8 14c-1.5 0-2.88-.5-4-1.342A5.53 5.53 0 0 1 4.406 3.342z" />
                        </svg>
                      )}
                      <input id="upload-image" type="file" className="sr-only" onChange={uploadImage} />
                    </label>
                  </>
                </>
              </>
              <div className="flex flex-col flex-1 gap-5">

                <input
                  type="text"
                  id="title"
                  placeholder="Title"
                  onChange={compete.handleChange}
                  value={compete.values.title}
                  className="border rounded p-2"
                />
                <input
                  type="date"
                  id='lastdate'
                  value={compete.values.lastdate}
                  onChange={compete.handleChange}
                />

                <textarea
                  type="text"
                  id="description"
                  placeholder="Description"
                  onChange={compete.handleChange}
                  value={compete.values.description}
                  className="border rounded p-2"
                />

                <button type="submit" className="bg-blue-500 text-white rounded p-2">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
                </div>
  );
};

export default Competition;
'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import axios from 'axios';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Select, SelectItem } from "@nextui-org/react";
import { ScrollShadow } from "@heroui/react";
import Link from 'next/link';
import Image from 'next/image';

const ViewComp = () => {
  const { id } = useParams();
  const [compData, setCompData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selBlog, setSelBlog] = useState('');
  const [userBlogs, setUserBlogs] = useState([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchCompData = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comp/getbyid/` + id);
      const data = res.data;
      console.log(data);
      setCompData(data);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchParticipantData = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/part/getbycompetition/` + id);
      const data = res.data;
      console.log(data);
      setParticipants(data);
    } catch (error) {
      console.error('Error fetching participant data:', error);
      toast.error('Failed to fetch participant data');
    }
  }, [id]);

  const fetchBlog = useCallback(async () => {
    if (!token) return;
    
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/filtered-byuser`, {
        headers: {
          'x-auth-token': token
        }
      });
      const data = res.data;
      console.log(data);
      setUserBlogs(data);
    } catch (err) {
      setError("Failed to fetch blog data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addParticipation = async () => {
    if (!selBlog) {
      toast.error('Please select a blog to participate');
      return;
    }

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/part/check-participation`, {
        comp: compData._id
      }, {
        headers: {
          'x-auth-token': token
        }
      });

      if (res.status === 200) {
        toast.error('participation already exists');
        return;
      }
    } catch (error) {
      // If the check doesn't return 200, continue with adding participation
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/part/add`, {
        blog: selBlog,
        competition: id
      }, {
        headers: {
          'x-auth-token': token
        }
      });
      toast.success('blog posted successfully');
      // Refresh participant data after successful submission
      fetchParticipantData();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    fetchCompData();
    fetchParticipantData();
    fetchBlog();
  }, [fetchCompData, fetchParticipantData, fetchBlog]);

  const winner = () => {
    return (
      <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
        <div
          aria-hidden="true"
          className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        >
          <div
            style={{
              clipPath:
                'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
            }}
            className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        >
          <div
            style={{
              clipPath:
                'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
            }}
            className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm/6 text-gray-900">
            <strong className="font-semibold">competition declared</strong>
            <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
              <circle r={1} cx={1} cy={1} />
            </svg>
            The winner is {compData?.winner?.name}.
          </p>
        </div>
        <div className="flex flex-1 justify-end">
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <section className="text-gray-600 body-font h-screen overflow-hidden">
        <div className="contain-none px-5 py-24 mx-auto">
          {compData !== null ? (
            <div className="lg:w-4/5 mx-auto flex flex-wrap">
              <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">{compData.title}</h1>

                <div className="flex w-full flex-col">
                  <Tabs
                    aria-label="Options"
                    color="primary"
                    variant="underlined"
                    classNames={{
                      tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                      cursor: "w-full bg-[#22d3ee]",
                      tab: "max-w-fit px-0 h-12",
                      tabContent: "group-data-[selected=true]:text-[#06b6d4]"
                    }}
                  >
                    <Tab
                      key="description"
                      title={
                        <div className="flex items-center space-x-2">
                          <span>Description</span>
                        </div>
                      }
                    >
                      <Card>
                        <CardBody>
                          {compData.description}
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab
                      key="videos"
                      title={
                        <div className="flex items-center space-x-2">
                          <span>Blogs</span>
                        </div>
                      }
                    >
                      <Card>
                        <CardBody>
                          <ScrollShadow className="w-auto h-[300px]">
                            <div className="bg-gray-100 py-12">
                              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="grid h-48 lg:grid-cols-2 gap-2">
                                  {participants.map((participant) => (
                                    <Link href={'/blog/' + participant.blog._id} key={participant.blog._id}>
                                      <div className="bg-white rounded-lg shadow-md">
                                        <Image
                                          src={participant.blog.image}
                                          alt="no image"
                                          width={200}
                                          height={100}
                                          className="w-auto h-16 object-cover"
                                        />
                                        <div className="p-6">
                                          <p className="text-sm text-gray-500">
                                            <span>{participant.blog.date}</span> ·{" "}
                                            <span className="text-indigo-600">{participant.blog.category}</span>
                                          </p>
                                          <h3 className="mt-2 text-lg font-medium text-gray-900">
                                            {participant.blog.title}
                                          </h3>
                                          <p className="mt-3 text-sm text-gray-600">
                                            {participant.blog.description}
                                          </p>
                                          <div className="mt-6 flex items-center">
                                            <Image
                                              src={participant.user.avatar}
                                              alt=""
                                              width={40}
                                              height={40}
                                              className="w-10 h-10 rounded-full"
                                            />
                                            <div className="ml-3">
                                              <p className="text-sm font-medium text-gray-900">
                                                {participant.user.name}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </ScrollShadow>
                        </CardBody>
                      </Card>
                    </Tab>
                  </Tabs>
                </div>
                {
                  !token ? (
                    <h1>Please Login to participate</h1>
                  ) : (compData.winner ? winner() : (
                    <div className="flex sticky bottom-0">
                      <Select
                        label="Select a Blog"
                        className="max-w-xs"
                        onChange={e => setSelBlog(e.target.value)}
                      >
                        {userBlogs.map(blog => (
                          <SelectItem key={blog._id} value={blog._id}>
                            {blog.title}
                          </SelectItem>
                        ))}
                      </Select>
                      <button 
                        className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded" 
                        type='submit' 
                        onClick={addParticipation}
                      >
                        take part
                      </button>
                      <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06  1.06a5.5 5.5 0 007.78 0L12 12.33l1.06 1.06a5.5 5.5 0 007.78-7.78l-1.06-1.06z" />
                        </svg>
                      </button>
                    </div>
                  ))
                }
              </div>
              <Image
                alt={compData.image}
                src={compData.image}
                width={500}
                height={300}
                className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              />
            </div>
          ) : (
            <div>No data available</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewComp;
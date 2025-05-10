'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, Chip, Breadcrumbs, BreadcrumbItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import HTMLReactParser from 'html-react-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import useAppContext from '@/context/AppContext';

const Blog = () => {
  const { id } = useParams();
  const { email } = useAppContext();

  const [blogData, setBlogData] = useState(null);
  const [catBlogs, setCatBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [summary2, setSummary2] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [showSummary2, setShowSummary2] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [userData, setUserData] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    // Fetch current user's data
    if (email) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getbyemail/${email}`)
        .then(res => setUserData(res.data))
        .catch(err => console.error("Error fetching user data:", err));
    }
  }, [email]);

  const fetchBlogsByCategory = useCallback(async (category) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/getbycategory/${category}`);
      setCatBlogs(res.data);
    } catch (err) {
      setError('Failed to fetch related blogs.');
    }
  }, []);

  const fetchBlogData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/getbyid/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setBlogData(res.data);
      setComments(res.data.comments);
      fetchBlogsByCategory(res.data.category);
    } catch (err) {
      setError('Failed to fetch blog data.');
    } finally {
      setLoading(false);
    }
  }, [id, fetchBlogsByCategory]);

  const fetchSummary = useCallback(async () => {
    if (!blogData?.content) return;

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyBfnLaGKASmYcczhMHkLo8hIeh-nrCbclM");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("summarize this blog and tell whether the blog is ai genterated in percentage and tell the word meaning of difficult words: " + blogData.content);
      setSummary(result.response.text());
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  }, [blogData]);

  const summarizeContent = async () => {
    try {
      const cleanContent = DOMPurify.sanitize(blogData.content);
      const strippedContent = cleanContent.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/blog/summarize`, {
        content: strippedContent,
      });
      setSummary2(response.data.summary);
    } catch (error) {
      console.error("Error summarizing:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Prevent submitting empty comments
    if (!commentText.trim()) return;

    if (!userData) {
      console.error("No user data available.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/comment/${blogData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ 
          text: commentText,
          user: userData.name,
          avatar: userData.avatar,
        })
      });

      if (response.ok) {
        // Update comments list with the newly added comment
        const updatedBlog = await response.json();
        setComments(updatedBlog.comments);
        setCommentText('');
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [fetchBlogData]);

  useEffect(() => {
    if (blogData) fetchSummary();
  }, [blogData, fetchSummary]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="h-screen flex justify-center w-auto">
      {blogData ? (
        <div className="w-11/12">
          <div className="text-4xl text-blue-900 font-bold mb-4">
            <Breadcrumbs>
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/listblog">Latest</BreadcrumbItem>
              <BreadcrumbItem>Blog</BreadcrumbItem>
            </Breadcrumbs>
          </div>

          <div className="grid grid-cols-12 w-auto gap-4">
            {/* Blog Content */}
            <div className="col-span-9">
              <div className="flex flex-row-reverse items-center gap-1">
                <span>{blogData.viewCount}</span>
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
              </div>

              <div>{HTMLReactParser(blogData.content || 'No content available')}</div>
            </div>

            {/* Related Blogs */}
            <div className="col-span-3">
              <h1 className="font-bold text-xl mb-4">See more like this</h1>
              {catBlogs.map((blog) => (
                <div key={blog._id} className="w-96 h-40 flex flex-col justify-center gap-2 bg-neutral-50 rounded-lg shadow p-2">
                  <div className="flex gap-2">
                    <div className="relative bg-neutral-500 w-24 h-24 shrink-0 rounded-lg">
                      <Image
                        src={blog.image || '/placeholder-image.png'}
                        alt={blog.title || 'Blog image'}
                        fill
                        sizes="96px"
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-neutral-700 italic">{blog.title || 'Untitled'}</span>
                      <p className="line-clamp-3">{blog.description || 'No description available.'}</p>
                    </div>
                  </div>
                  <Link href={'/blog/' + blog._id} className="hover:bg-indigo-700 bg-indigo-500 font-bold text-neutral-50 rounded p-2">
                    See more
                  </Link>
                </div>
              ))}
              {summary && (
                <div className="mt-4">
                  <div className="relative group inline-block">
                    <button
                      onClick={() => setShowSummary(!showSummary)}
                      className="relative inline-block p-px font-semibold leading-6 text-white bg-neutral-900 shadow-2xl cursor-pointer rounded-2xl shadow-emerald-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-emerald-600"
                    >
                      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                      <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-950">
                        <div className="relative z-10 flex items-center space-x-3">
                          <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300">
                            {showSummary ? "Hide Summary" : "Show Summary"}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300"
                          >
                            <path
                              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                            ></path>
                          </svg>
                        </div>
                      </span>
                    </button>
                  </div>

                  {showSummary && (
                    <div className="mt-4 p-4 border-l-4 border-blue-500 bg-blue-100">
                      <h2 className="font-bold">Summary</h2>
                      <ReactMarkdown>{summary}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
              <br />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-6 flex flex-col gap-4">
            <div className="w-1/2">
              <button
                onClick={summarizeContent}
                className="relative inline-block p-px font-semibold leading-6 text-white bg-neutral-900 shadow-2xl cursor-pointer rounded-2xl shadow-emerald-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-emerald-600"
              >
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-950">
                  <div className="relative z-10 flex items-center space-x-3">
                    <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300">
                      {showSummary2 ? "Hide Summary" : "Summary by Node summarizer"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300"
                    >
                      <path
                        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                      ></path>
                    </svg>
                  </div>
                </span>
              </button>
              <br /><br />
              <p className="mt-4 p-4 border-l-4 border-blue-500 bg-blue-100">
                {HTMLReactParser(summary2)}
              </p>
            </div>
            <Chip classNames={{
              base: 'flex items-center bg-gradient-to-br from-indigo-500 to-pink-500 border border-white/50 shadow-pink-500/30',
              content: 'drop-shadow shadow-black text-white',
            }} variant="shadow">
              {blogData.category}
            </Chip>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  isBordered
                  src={blogData.author?.avatar || '/placeholder-avatar.png'}
                  alt={blogData.author?.name || 'Author avatar'}
                  onClick={onOpen}
                />
              </div>
              <span className="font-bold">
                {blogData.author?.name || 'Unknown Author'}
              </span>
            </div>

            <Modal
              backdrop="opaque"
              isOpen={isOpen}
              motionProps={{
                variants: {
                  enter: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  },
                  exit: {
                    y: -20,
                    opacity: 0,
                    transition: {
                      duration: 0.2,
                      ease: "easeIn",
                    },
                  },
                },
              }}
              onOpenChange={onOpenChange}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">Author Details</ModalHeader>
                    <ModalBody>
                      <div>
                        {/* Profile */}
                        <div className="flex items-center gap-x-3">
                          <div className="shrink-0 relative size-16">
                            <Image 
                              src={blogData.author?.avatar || '/placeholder-avatar.png'} 
                              alt="Avatar" 
                              fill 
                              sizes="64px"
                              className="rounded-full object-cover" 
                            />
                          </div>
                          <div className="grow">
                            <h1 className="text-lg font-medium text-black ">
                              {blogData.author?.name || 'Unknown Author'}
                            </h1>
                            <p className="text-sm text-black ">
                              {blogData.author?.role || 'No bio available.'}
                            </p>
                          </div>
                        </div>
                        {/* End Profile */}
                        {/* About */}
                        <div className="mt-8">
                          <p className="text-sm text-black">
                            {blogData.author?.description || 'No bio available.'}
                          </p>
                          <ul className="mt-5 flex flex-col gap-y-3">
                            <li className="flex items-center gap-x-2.5">
                              <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <rect width={20} height={16} x={2} y={4} rx={2} />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                              </svg>
                              <a className="text-[13px] text-black underline hover:text-gray-800 hover:decoration-2 focus:outline-none focus:decoration-2 " href="#">
                                {blogData.author?.email || 'Unknown email'}
                              </a>
                            </li>
                          </ul>
                        </div>
                        {/* End About */}
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>

            <div>
              <h2 className="font-bold">Tags:</h2>
              {blogData.tags?.length ? (
                blogData.tags.map((tag, index) => (
                  <Chip key={index} className="mr-2 bg-gray-200 text-gray-700">{tag}</Chip>
                ))
              ) : 'No tags available.'}
            </div>
            <div className="mt-4">
              <h2 className="font-bold">Comments</h2>
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Add a comment..."
                  required
                />
                <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
              </form>
              {comments.map((comment, index) => (
                <div key={index} className="mb-2 p-2 border border-gray-200 rounded">
                  <div className="flex items-center mb-1">
                    <div className="relative w-8 h-8 mr-2">
                      <Image 
                        src={comment.avatar || '/placeholder-avatar.png'} 
                        alt="Avatar" 
                        fill 
                        sizes="32px"
                        className="rounded-full object-cover" 
                      />
                    </div>
                    <span className="font-bold">{comment.user}</span>
                  </div>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          </footer>
        </div>
      ) : (
        <p className="text-center">No data found.</p>
      )}
    </div>
  );
};

export default Blog;
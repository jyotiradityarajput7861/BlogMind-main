"use client"

import React, { useState, useEffect } from "react"
import { useFormik } from "formik"
import axios from "axios"
import { toast } from "react-hot-toast"
import Image from "next/image"
import { X, Upload, TagIcon } from "lucide-react"
import dynamic from 'next/dynamic'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
})

const AddBlog = () => {
  const initialContent = `# title\n\nHello World!\n\n`
  const [blogContent, setBlogContent] = useState(initialContent)
  const [previewUrl, setPreviewUrl] = useState("")
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  // Handle client-side only mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || ""
    }
    return ""
  }

  const blogForm = useFormik({
    initialValues: {
      title: "",
      content: "",
      image: "",
      category: "",
      description: "",
    },
    onSubmit: (values, { resetForm }) => {
      const formData = {
        ...values,
        tags,
        content: blogContent,
      }

      console.log(formData)

      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/blog/add`, formData, {
          headers: {
            "x-auth-token": getToken(),
          },
        })
        .then(() => {
          toast.success("Blog posted successfully")
          resetForm()
          setTags([])
          setBlogContent(initialContent)
          setPreviewUrl("")
        })
        .catch((err) => {
          console.error(err)
          toast.error(err?.response?.data?.message || "Something went wrong")
        })
    },
  })

  const uploadFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "myuploadpreset")
    formData.append("cloud_name", "de4osq89e")

    toast.loading("Uploading image...")

    axios
      .post("https://api.cloudinary.com/v1_1/de4osq89e/image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        toast.dismiss()
        toast.success("Image uploaded successfully")
        setPreviewUrl(result.data.url)
        blogForm.setFieldValue("image", result.data.url)
      })
      .catch((err) => {
        toast.dismiss()
        console.error(err)
        toast.error("Image upload failed")
      })
  }

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value)
  }

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }

  const handleCategoryChange = (value) => {
    blogForm.setFieldValue("category", value)
  }

  const triggerFileInput = () => {
    if (isMounted) {
      document.getElementById("upload-image").click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-10">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create New Blog Post</CardTitle>
            <CardDescription>Share your knowledge with the world</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={blogForm.handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Blog Title
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter an engaging title"
                  onChange={blogForm.handleChange}
                  value={blogForm.values.title}
                  required
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label htmlFor="cover-image-container" className="text-sm font-medium">
                  Cover Image
                </label>
                <div 
                  id="cover-image-container"
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={triggerFileInput}
                >
                  {previewUrl ? (
                    <div className="relative h-48 w-full mb-4">
                      <Image
                        src={previewUrl || "/placeholder.svg"}
                        alt="Cover preview"
                        className="object-cover rounded-lg"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering file input
                          setPreviewUrl("");
                          blogForm.setFieldValue("image", "");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-6">
                      <Upload className="h-10 w-10 mx-auto text-slate-400" />
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Drag and drop an image or <span className="text-primary font-medium">browse</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Recommended: 1200×630px (16:9 ratio) • Max 2MB</p>
                    </div>
                  )}
                  <input id="upload-image" type="file" accept="image/*" className="hidden" onChange={uploadFile} />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1 px-3">
                      <TagIcon className="h-3 w-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex">
                  <Input
                    id="tags"
                    placeholder="Add tags and press Enter"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagKeyDown}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select onValueChange={handleCategoryChange} value={blogForm.values.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                    <SelectItem value="Design & Creativity">Design & Creativity</SelectItem>
                    <SelectItem value="Environment & Sustainability">Environment & Sustainability</SelectItem>
                    <SelectItem value="Parenting & Family">Parenting & Family</SelectItem>
                    <SelectItem value="Sports & Fitness">Sports & Fitness</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="A brief summary of your blog post"
                  rows={3}
                  onChange={blogForm.handleChange}
                  value={blogForm.values.description}
                />
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <div className="border rounded-md overflow-hidden">
                  {isMounted && (
                    <JoditEditor
                      value={blogContent}
                      config={{
                        uploader: {
                          insertImageAsBase64URI: true,
                          url: "https://api.cloudinary.com/v1_1/de4osq89e/image/upload",
                          isSuccess: (response) => {
                            const uploadedUrl = response.data.url
                            setBlogContent(
                              (prevContent) => `${prevContent}<img src="${uploadedUrl}" alt="uploaded image"/>`,
                            )
                            toast.success("Image uploaded successfully")
                          },
                          error: (err) => {
                            console.error("Upload Error:", err)
                            toast.error("Image upload failed")
                          },
                        },
                        height: 500,
                        spellcheck: true,
                        toolbar: true,
                        readonly: false,
                        placeholder: "Start writing your blog content here...",
                        theme: "default",
                      }}
                      onBlur={(newContent) => setBlogContent(newContent)}
                    />
                  )}
                  {!isMounted && <div className="p-4 text-center">Loading editor...</div>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="px-8">
                  Publish Blog Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AddBlog
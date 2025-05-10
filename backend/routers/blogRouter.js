const express = require('express');
const router = express.Router();
const Model = require('../models/blogmodel.js');
const verifyToken = require('./verifyToken.js');
const { filterBlogs } = require('../utils/filterPosts');
const SummarizerManager = require("node-summarizer").SummarizerManager;

// Define your vulgar words
const vulgarWords = ["to hell", "damn", "shit", "bastard", "hellhole", "crap" ]; //Customize this list

router.get('/filtered-posts', async (req, res) => {
    try {
        const posts = await Model.find(); // Fetch ALL posts from the database
        const filteredPosts = filterBlogs(posts, vulgarWords);
        res.status(200).json(filteredPosts); //Send filtered posts as JSON
    } catch (error) {
        console.error("Error fetching and filtering blog posts:", error);
        res.status(500).json({ message: 'Error fetching posts.' });
    }
});

router.post("/summarize", async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.length < 100) {
            return res.status(400).json({ error: "Content is too short to summarize." });
        }

        // Summarize the content (e.g., 3 sentences)
        const summarizer = new SummarizerManager(content, 15);
        const summary = await summarizer.getSummaryByRank();

        res.json({ summary: summary.summary });
    } catch (error) {
        res.status(500).json({ error: "Failed to summarize the content." });
    }
});

router.post('/add', verifyToken, (req, res) => {
    req.body.author = req.user._id;
    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            if (err.code === 11000) {
                res.status(500).json({ message: 'blog Already Exists' });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
});

router.get('/getall', (req, res) => {

    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getbytitle', (req, res) => {
    Model.findOne({ title: req.params.title })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});
router.get('/getbycategory/:category', (req, res) => {
    console.log(req.params.category);
    
    Model.find({ category: req.params.category })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getbytags', (req, res) => {
    Model.findOne({ tags: req.params.tags })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getbyid/:id', verifyToken, async (req, res) => {
    try {
        const blog = await Model.findById(req.params.id).populate('author');
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if the user has already viewed the blog
        const hasViewed = blog.viewedBy.some(userId => userId.equals(req.user._id));
        if (!hasViewed) {
            blog.viewCount += 1;
            blog.viewedBy.push(req.user._id);
            await blog.save();
        }

        res.status(200).json(blog);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/getbyuser', verifyToken, (req, res) => {
    Model.find({ author: req.user._id })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/filtered-byuser', verifyToken, (req, res) => {
    Model.find({ author: req.user._id })
        .then((result) => {
            // const posts =  Model.find(); // Fetch ALL posts from the database
            const filteredPostsbyuser = filterBlogs(result, vulgarWords);
            res.status(200).json(filteredPostsbyuser);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/delete/:id',  (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Add a comment to a blog post
router.post('/comment/:id', verifyToken, async (req, res) => {
    try {
        console.log(req.user); // Log user to see if it's populated correctly
        const blog = await Model.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const comment = {
            // Use req.user.name; fallback to req.user._id or "Anonymous" if not provided
            user: req.body.user || req.user?._id || "Anonymous",
            avatar: req.body.avatar || "https://avatar.iran.liara.run/public",
            text: req.body.text,
        };

        blog.comments.push(comment);
        await blog.save();

        res.status(200).json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add comment." });
    }
});


module.exports = router;
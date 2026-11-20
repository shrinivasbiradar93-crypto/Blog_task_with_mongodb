
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Title is a required field.!!'],
        trim: true,
        minlength: [5, 'Title must have at least 5 characters.!!']
    },

    content: {
        type: String,
        required: [true, 'Content is a required field.!!'],
        trim: true
    },

    author: {
        type: String,
        required: [true, 'Author is a required field.!!'],
        trim: true
    },

    category: {
        type: String,
        required: [true, 'Category is a required field.!!']
    }

}, {
    timestamps: true
})

const Blog = mongoose.model('blogs', blogSchema)
const port = process.env.PORT || 3000


app.post('/api/blogs', async (req, res) => {
    try {
        let reqBody = req.body;
        let blog = await Blog.create(reqBody);

        res.status(201).json({
            message: 'New Blog is created successfully.',
            data: blog
        });

    } catch (err) {

        if (err.name === "ValidationError") {

            let errMsg = Object.values(err.errors);

            return res.status(400).json({
                message: 'Validation Error',
                errors: errMsg.map(e => e.message)
            });
        }
        if (err.name === "CastError") {
            return res.status(400).json({
                message: 'Invalid data format'
            });
        }
        res.status(500).json({
            message: 'Failed to create Blog, Server Issue'
        });
    }
});

app.get('/api/blogs', async (req, res) => {
    try {

        const blogs = await Blog.find();

        res.status(200).json({
            message: 'Blogs Fetched successfully.',
            data: blogs
        });
    } catch (err) {

        res.status(500).json({
            message: 'Failed to fetch Blogs, Server Issue'
        });
    }
});

app.get('/api/blogs/:id', async (req, res) => {
    try {

        let { id } = req.params;
        let blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                message: `Blog with id ${id} not found.`
            });
        }
        res.status(200).json({
            message: 'Blog Found',
            data: blog
        });

    } catch (err) {

        if (err.name === "CastError") {
            return res.status(400).json({
                message: 'Invalid Blog ID'
            });
        }
        res.status(500).json({
            message: 'Failed to fetch Blog, Server Issue'
        });
    }
});

async function startServer() {
    try {

        console.log('1. Starting server...')
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing')
        }

        console.log('2. Connecting to MongoDB...')
        await mongoose.connect(process.env.MONGODB_URI)

        console.log('3. Successfully connected to MongoDB')
        app.listen(port, () => {
            console.log(`4. Application is running on port ${port}`)
        })

    } catch (error) {
        console.log('Server Error:', error.message)
    }
}

startServer()
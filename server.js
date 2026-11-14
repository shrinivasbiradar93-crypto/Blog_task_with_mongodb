
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// 1. Create Blog Schema
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

// 2. Create Blog Model
const Blog = mongoose.model('blogs', blogSchema)

// 3. Set Port
const port = process.env.PORT || 3000

// 4. Start Server and Connect MongoDB
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
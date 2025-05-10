const { Schema, model, Types } = require('../connection');

const CommentSchema = new Schema({
    user: { type: String, required: true },
    avatar: { type: String, default: "https://avatar.iran.liara.run/public" },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }
});

const BlogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Types.ObjectId, ref: 'user', required: true },
    category: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    tags: [String],
    viewCount: { type: Number, default: 0 },
    viewedBy: [{ type: Types.ObjectId, ref: 'user' }],
    comments: [CommentSchema],  // **✅ Added Comment Schema**
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('blog', BlogSchema);

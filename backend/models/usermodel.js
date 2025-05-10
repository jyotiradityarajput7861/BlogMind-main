const { Schema, model } = require('../connection');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: String,
    avatar: { type: String },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    description:{type: String},
    links:{type: String},
    coins: { type: Number, default: 0 }
    
});

module.exports = model('user', userSchema);
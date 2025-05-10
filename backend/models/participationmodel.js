const { Schema, model, Types } = require('../connection');

const partSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'user' },
    blog: { type: Types.ObjectId, ref: 'blog' },
    competition: { type: Types.ObjectId, ref: 'comp' },
    coin: { type: Types.ObjectId, ref: 'coin' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('participations', partSchema);
const { Schema, model, Types } = require('../connection');

const helpSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'user' },
    message: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('comp', compSchema);
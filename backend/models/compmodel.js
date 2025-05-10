const { Schema, model, Types } = require('../connection');

const compSchema = new Schema({
    name: { type: String },
    description: { type: String },
    image: { type: String },
    title: { type: String },
    startdate: { type: Date, default: Date.now },
    lastdate: { type: Date },
    result: { type: String, default: 'pending' },
    winner: { type: Types.ObjectId, ref: 'user' }
});

module.exports = model('comp', compSchema);
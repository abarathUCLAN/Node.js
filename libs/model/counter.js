var mongoose = require('mongoose'),	Schema = mongoose.Schema;

var CounterSchema = Schema({
  _id: {
    type: String,
    required: true
  },
  next: {
    type: Number,
    default: 0
  }
});

CounterSchema.statics.findAndModify = function(query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

module.exports = mongoose.model('Counter', CounterSchema);

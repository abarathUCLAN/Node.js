var mongoose = require('mongoose'),
  Schema = mongoose.Schema,

  Project = new Schema({
    id: {
      type: Number,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    acronym: {
      type: String
    },
    user_id: {
      type: String,
      required: true
    },
    invitations: {
      type: Array,
      "default": []
    },
    members: [{
      rights: Number,
      member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    projectDescription: {
      type: String
    },
    risks: [{
      id: Number,
      name: String,
      content: String
    }],
    effortEstimation: {
      type: String
    },
    introduction: {
      type: String
    },
    needs: [{
      id: Number,
      name: String,
      content: String
    }],
    nices: [{
      id: Number,
      name: String,
      content: String
    }],
    result: {
      type: String
    },
    use: {
      type: String
    },
    actualState: {
      type: String
    },
    targetState: {
      type: String
    },
    productData: {
      type: String
    },
    nonfunctional: [{
      id: Number,
      name: String,
      content: String
    }],
    functional: [{
      id: Number,
      name: String,
      content: String
    }],
    quality: {
      type: String
    },
    implementation: {
      type: String,
    },
    manual: {
      type: String
    },
    protocol: [{
      id: Number,
      criteria: String,
      criteriaName: String,
      note: String,
      requirement: String,
      fulfilled: Boolean
    }],
    presentation: [{
      id: Number,
      name: String,
      content: String,
      file: String
    }],
    changeRequest: [{
      id: Number,
      name: String,
      content: String
    }],
    codeStyle: [{
      id: Number,
      name: String,
      content: String
    }],
    monthlyReport: [{
      id: Number,
      month: Number,
      content: String
    }]
  });

module.exports = mongoose.model('Project', Project);

// models/Survey.js
const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
  },
  { _id: false }
);

const SectionRefSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String },
    questionIds: { type: [String], default: [] },
  },
  { _id: false }
);

const SurveySchema = new mongoose.Schema(
  {
    // Basic metadata about the submission (title, optional respondent id, etc.)
    metadata: {
      title: { type: String, default: "Cloud-Native Disaster Response Platform Survey" },
      respondentId: { type: String }, // optional: link to user in your system
      ip: { type: String }, // optional: store request IP if desired
      submittedAt: { type: Date, default: Date.now },
      // you can store more fields here as needed
    },

    // Answers: store as array of { questionId, value } for easier queries
    answers: {
      type: [AnswerSchema],
      default: [],
      validate: {
        validator: function (v) {
          // Each questionId must be unique in this submission
          const ids = v.map((a) => a.questionId);
          return new Set(ids).size === ids.length;
        },
        message: "Duplicate questionId found in answers",
      },
    },

    // Comments keyed by section id (and "final")
    comments: {
      type: Map,
      of: String,
      default: {},
    },

    // Sections snapshot (optional): helpful if you later change survey structure
    sections: {
      type: [SectionRefSchema],
      default: [],
    },

    // Optional free-form metadata or tags
    tags: { type: [String], default: [] },

    // If you want to mark entries as reviewed/processed
    reviewed: { type: Boolean, default: false },
    reviewedAt: { type: Date },
    reviewedBy: { type: String },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Indexes for efficient queries
SurveySchema.index({ "metadata.respondentId": 1 });
SurveySchema.index({ reviewed: 1, createdAt: -1 });

module.exports = mongoose.models.Survey || mongoose.model("Survey", SurveySchema);
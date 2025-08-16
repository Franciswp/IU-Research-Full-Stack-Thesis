// routes/survey.js
const express = require("express");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const Survey = require("../models/Survey");

const router = express.Router();

/**
 * Validation schema for incoming survey payload (using Joi)
 * Accepts:
 *  - metadata (optional)
 *  - answers: object map or array, we normalize to array of { questionId, value }
 *  - comments: object map of sectionId -> text
 *  - sections: optional snapshot array
 */
const surveyPayloadSchema = Joi.object({
  metadata: Joi.object({
    title: Joi.string().allow("").optional(),
    respondentId: Joi.string().optional(),
    ip: Joi.string().optional(),
    submittedAt: Joi.date().optional(),
  }).optional(),

  // Accept either map or array of answers
  answers: Joi.alternatives()
    .try(
      Joi.array().items(
        Joi.object({
          questionId: Joi.string().required(),
          value: Joi.number().integer().min(1).max(5).required(),
        })
      ),
      Joi.object().pattern(Joi.string(), Joi.number().integer().min(1).max(5))
    )
    .required(),

  comments: Joi.object().pattern(Joi.string(), Joi.string().allow("")).optional(),

  sections: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        title: Joi.string().allow("").optional(),
        questionIds: Joi.array().items(Joi.string()).optional(),
      })
    )
    .optional(),

  tags: Joi.array().items(Joi.string()).optional(),
  reviewed: Joi.boolean().optional(),
});

// Helper: normalize answers into array of { questionId, value }
function normalizeAnswers(input) {
  if (Array.isArray(input)) {
    return input.map((a) => ({ questionId: a.questionId, value: Number(a.value) }));
  }
  // assume object map
  return Object.entries(input).map(([questionId, value]) => ({ questionId, value: Number(value) }));
}

/**
 * POST /api/surveys
 * Create a new survey submission
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error, value } = surveyPayloadSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.details.map((d) => d.message).join("; ") });

    const normalizedAnswers = normalizeAnswers(value.answers);

    const surveyDoc = new Survey({
      metadata: {
        ...(value.metadata || {}),
        submittedAt: value.metadata && value.metadata.submittedAt ? value.metadata.submittedAt : new Date(),
        ip: req.ip || value.metadata?.ip,
      },
      answers: normalizedAnswers,
      comments: value.comments || {},
      sections: value.sections || [],
      tags: value.tags || [],
      reviewed: value.reviewed || false,
    });

    await surveyDoc.save();
    res.status(201).json({ id: surveyDoc._id, message: "Survey saved" });
  })
);

/**
 * GET /api/surveys
 * Query params:
 *  - page, limit, reviewed
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(200, Math.max(5, parseInt(req.query.limit || "25", 10)));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.reviewed !== undefined) {
      filter.reviewed = req.query.reviewed === "true";
    }
    if (req.query.respondentId) {
      filter["metadata.respondentId"] = req.query.respondentId;
    }

    const [results, total] = await Promise.all([
      Survey.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Survey.countDocuments(filter),
    ]);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      results,
    });
  })
);

/**
 * GET /api/surveys/:id
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const doc = await Survey.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "Survey not found" });
    res.json(doc);
  })
);

/**
 * PATCH /api/surveys/:id
 * Partial update (e.g., mark reviewed, add reviewer, update comments)
 */
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    // Keep updates safe: pick allowed fields only
    const allowed = {};
    if (req.body.reviewed !== undefined) allowed.reviewed = Boolean(req.body.reviewed);
    if (req.body.reviewedBy !== undefined) allowed.reviewedBy = String(req.body.reviewedBy);
    if (req.body.reviewed && !req.body.reviewedAt) allowed.reviewedAt = new Date();
    if (req.body.comments && typeof req.body.comments === "object") {
      // merge comments
      const existing = (await Survey.findById(req.params.id).select("comments").lean())?.comments || {};
      allowed.comments = { ...existing, ...req.body.comments };
    }

    // Allow replacing the entire answers array only if supplied properly
    if (req.body.answers) {
      const { error, value } = Joi.array()
        .items(
          Joi.object({
            questionId: Joi.string().required(),
            value: Joi.number().integer().min(1).max(5).required(),
          })
        )
        .validate(req.body.answers);
      if (error) return res.status(400).json({ error: "Invalid answers payload" });
      allowed.answers = value;
    }

    const updated = await Survey.findByIdAndUpdate(req.params.id, { $set: allowed }, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: "Survey not found" });
    res.json(updated);
  })
);

/**
 * DELETE /api/surveys/:id
 * Remove a survey entry
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Survey.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ error: "Survey not found" });
    res.json({ id: deleted._id, message: "Deleted" });
  })
);

module.exports = router;
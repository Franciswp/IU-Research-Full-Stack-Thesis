const express = require("express");
const router = express.Router();
const Consent = require("../models/consent"); // Adjust the path as needed

// Basic server-side validation helper
function validatePayload(body) {
  const requiredBooleans = ["consent1","consent2","consent3","consent4","consent5","consent6"];
  for (const k of requiredBooleans) {
    if (body[k] !== true) return `${k} must be checked`;
  }
  if (!body.participantName || typeof body.participantName !== "string" || body.participantName.trim().length < 2) return "participantName is required";
  if (!body.signature || typeof body.signature !== "string" || body.signature.trim().length < 2) return "signature is required";
  if (!body.date) return "date is required";
  const date = new Date(body.date);
  if (isNaN(date.getTime())) return "date is invalid";
  return null;
}

// POST /api/consent
router.post("/", async (req, res) => {
  try {
    // optional API key protection:
    // if (req.headers['x-api-key'] !== process.env.API_KEY) return res.status(401).json({ error: "Unauthorized" });

    const errMsg = validatePayload(req.body);
    if (errMsg) return res.status(400).json({ error: errMsg });

    // sanitize minimal - trim strings
    const payload = {
      consent1: Boolean(req.body.consent1),
      consent2: Boolean(req.body.consent2),
      consent3: Boolean(req.body.consent3),
      consent4: Boolean(req.body.consent4),
      consent5: Boolean(req.body.consent5),
      consent6: Boolean(req.body.consent6),
      participantName: String(req.body.participantName).trim(),
      signature: String(req.body.signature).trim(),
      date: new Date(req.body.date),
      ipAddress: req.ip,
      userAgent: req.get("User-Agent")
    };

    const newConsent = new Consent(payload);
    const saved = await newConsent.save();
    return res.status(201).json({ id: saved._id, message: "Consent stored" });
  } catch (err) {
    console.error("Error saving consent:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GDPR: delete by id (authenticated or with token)
// DELETE /api/consent/:id
router.delete("/:id", async (req, res) => {
  try {
    // Protect this route in production (auth)
    const id = req.params.id;
    const doc = await Consent.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
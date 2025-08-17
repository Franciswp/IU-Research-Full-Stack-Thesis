import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  MobileStepper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";

/**
 * SurveyPage.jsx
 *
 * Next.js-compatible React component (client-side) that:
 *  - shows the 3 survey sections one at a time
 *  - validates per-section (if requireAll=true)
 *  - submits final payload to POST /api/surveys
 *
 * Props:
 *  - requireAll (bool) default true — enforce all questions answered before submit
 *  - onSuccess (fn) optional callback after successful submit
 *
 * Notes:
 *  - This uses the relative path /api/surveys — in production ensure your server is reachable at that path.
 *  - You can add auth headers (Authorization) by editing the fetch call in handleSubmit.
 */

const defaultSections = [
  {
    id: "usability",
    title: "Section 1: Usability and User Experience",
    description:
      "These questions assess how intuitive the platform feels, aligning with front-end choices like React UI for responsive dashboards.",
    questions: [
      {
        id: "u1",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the platform's dashboard is easy to navigate during a high-stress situation like a flood response?",
      },
      {
        id: "u2",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the maps and alerts in the platform help you quickly understand aid needs without needing extra training?",
      },
      {
        id: "u3",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the platform works well in low-connectivity areas, such as rural zones with intermittent internet?",
      },
      {
        id: "u4",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the multi-language features make the platform accessible for diverse team members?",
      },
      {
        id: "u5",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the platform's interface reduces the time needed to coordinate logistics compared to your current tools?",
      },
    ],
  },
  {
    id: "scalability",
    title: "Section 2: Scalability and Reliability",
    description:
      "These questions evaluate the platform's ability to handle growth and maintain performance, based on features like automated deployments and backups.",
    questions: [
      {
        id: "s1",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the platform handles sudden increases in users (e.g., during a major disaster) without slowing down?",
      },
      {
        id: "s2",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the platform's quick setup features (like automated deployments) make it practical for small teams with limited IT resources?",
      },
      {
        id: "s3",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the platform remains reliable across different regions or time zones?",
      },
      {
        id: "s4",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the platform minimizes downtime during updates, allowing continuous aid coordination?",
      },
      {
        id: "s5",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the platform's resilience features (e.g., backups) give you confidence in using it for critical tasks?",
      },
    ],
  },
  {
    id: "ai",
    title: "Section 3: AI Integration and Effectiveness",
    description:
      "These questions focus on the perceived value of AI features, such as alerts and resource prioritization, in humanitarian contexts.",
    questions: [
      {
        id: "a1",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the platform's AI alerts help prioritize medical resources effectively in emergencies?",
      },
      {
        id: "a2",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the AI features make resource allocation faster and more accurate than manual methods?",
      },
      {
        id: "a3",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the platform's AI reduces errors in logistics planning, based on your experience?",
      },
      {
        id: "a4",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the AI updates (e.g., during crises) improve the platform's usefulness without complicating your workflow?",
      },
      {
        id: "a5",
        text:
          "On a scale of 1 to 5, how strongly do you agree that the AI helps in coordinating with other organizations seamlessly?",
      },
    ],
  },
];

export default function SurveyPage({ requireAll = true, onSuccess }) {
  const navigate = useNavigate();
  const sections = defaultSections;
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: number }
  const [comments, setComments] = useState({}); // { sectionId: text, final: text }
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  const currentSection = sections[activeIndex];

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: Number(value) }));
    if (error) setError("");
  };

  const handleCommentChange = (sectionId, value) => {
    setComments((prev) => ({ ...prev, [sectionId]: value }));
  };

  const validateSection = (section) => {
    if (!requireAll) return { ok: true };
    const missing = section.questions.filter((q) => answers[q.id] == null);
    if (missing.length > 0) {
      return { ok: false, missingCount: missing.length, missingIds: missing.map((m) => m.id) };
    }
    return { ok: true };
  };

  const handleNext = () => {
    const validation = validateSection(currentSection);
    if (!validation.ok) {
      setError(`Please answer all questions in this section before continuing. Missing: ${validation.missingCount}`);
      return;
    }
    setActiveIndex((idx) => Math.min(idx + 1, sections.length - 1));
  };

  const handleBack = () => {
    setError("");
    setActiveIndex((idx) => Math.max(idx - 1, 0));
  };

  // Build payload in same shape expected by /api/surveys (answers object-map accepted)
  function buildPayload() {
    // answers as object map { qid: value }
    const answersMap = Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, v]));
    return {
      metadata: {
        title: "Cloud-Native Disaster Response Platform Survey",
        submittedAt: new Date().toISOString(),
      },
      answers: answersMap,
      comments,
      sections: sections.map((s) => ({ id: s.id, title: s.title, questionIds: s.questions.map((q) => q.id) })),
    };
  }

  const handleSubmit = async () => {
    // Validate all sections if required
    if (requireAll) {
      const allMissing = sections.flatMap((s) => s.questions.filter((q) => answers[q.id] == null).map((q) => q.id));
      if (allMissing.length > 0) {
        setError(`Please answer all questions before submitting. Missing: ${allMissing.length}`);
        // jump to first section with missing answers
        const firstMissingId = allMissing[0];
        const sectionIndex = sections.findIndex((s) => s.questions.some((q) => q.id === firstMissingId));
        if (sectionIndex >= 0) setActiveIndex(sectionIndex);
        return;
      }
    }

    setError("");
    setSubmitting(true);

    const payload = buildPayload();

    try {
      const res = await fetch("/api/surveys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header here if your API requires it:
          // Authorization: `Bearer ${yourToken}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body?.error || body?.message || `Server returned ${res.status}`;
        throw new Error(msg);
      }

      const data = await res.json().catch(() => ({}));
      setSnackbar({ open: true, severity: "success", message: "Survey submitted. Thank you!" });
      // Optionally clear answers/comments after successful submit:
      setAnswers({});
      setComments({});
      setActiveIndex(0);
      
      if (typeof onSuccess === "function") onSuccess(data);
      // Delay slightly so the user sees the success message
      setTimeout(() => {
        navigate("/debrief", { replace: true });
      }, 1500);

    } catch (err) {
      console.error("Submit error", err);
      setSnackbar({ open: true, severity: "error", message: `Submission failed: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Cloud-Native Disaster Response Platform Survey
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        Working Title: Cloud-Native Disaster Response Platform for NGOs and Local Governments
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {currentSection.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {currentSection.description}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <List disablePadding>
          {currentSection.questions.map((q) => (
            <ListItem key={q.id} alignItems="flex-start" sx={{ py: 1 }}>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {q.text}
                  </Typography>
                }
                secondary={
                  <RadioGroup
                    row
                    aria-label={q.id}
                    name={q.id}
                    value={answers[q.id] ?? ""}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    sx={{ mt: 0.5 }}
                  >
                    {[1, 2, 3, 4, 5].map((v) => (
                      <FormControlLabel
                        key={v}
                        value={String(v)}
                        control={<Radio />}
                        label={String(v)}
                        labelPlacement="bottom"
                        sx={{ mr: 1 }}
                      />
                    ))}
                  </RadioGroup>
                }
              />
            </ListItem>
          ))}
        </List>

        <TextField
          label={`Optional comments for ${currentSection.title}`}
          placeholder="Enter any additional thoughts here (optional)"
          multiline
          minRows={3}
          fullWidth
          value={comments[currentSection.id] || ""}
          onChange={(e) => handleCommentChange(currentSection.id, e.target.value)}
          sx={{ mt: 2 }}
        />
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2">Sections</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
          {sections.map((s, idx) => {
            const answeredCount = s.questions.filter((q) => answers[q.id] != null).length;
            return (
              <Button
                key={s.id}
                variant={idx === activeIndex ? "contained" : "outlined"}
                size="small"
                onClick={() => {
                  setActiveIndex(idx);
                  setError("");
                }}
              >
                {s.title.split(":")[1]} ({answeredCount}/{s.questions.length})
              </Button>
            );
          })}
        </Box>
      </Paper>

      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Button variant="outlined" onClick={handleBack} disabled={activeIndex === 0}>
            <KeyboardArrowLeft /> Previous
          </Button>
        </Box>

        <Box>
          {activeIndex < sections.length - 1 ? (
            <Button variant="contained" onClick={handleNext} endIcon={<KeyboardArrowRight />}>
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} /> : null}
            >
              {submitting ? "Submitting..." : "Submit Survey"}
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Final Thoughts (optional)
        </Typography>
        <TextField
          placeholder="Overall feedback or suggestions (optional)"
          multiline
          minRows={3}
          fullWidth
          value={comments.final || ""}
          onChange={(e) => handleCommentChange("final", e.target.value)}
        />
      </Box>

      <MobileStepper
        variant="dots"
        steps={sections.length}
        position="static"
        activeStep={activeIndex}
        nextButton={<Box sx={{ width: 40 }} />}
        backButton={<Box sx={{ width: 40 }} />}
        sx={{ mt: 2 }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

SurveyPage.propTypes = {
  requireAll: PropTypes.bool,
  onSuccess: PropTypes.func,
};
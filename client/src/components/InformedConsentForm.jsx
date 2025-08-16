import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Container,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

//const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function InformedConsentForm() {
  const navigate = useNavigate();

  const [consent, setConsent] = useState({
    consent1: false,
    consent2: false,
    consent3: false,
    consent4: false,
    consent5: false,
    consent6: false,
  });
  const [participantName, setParticipantName] = useState("");
  const [signature, setSignature] = useState("");
  const [date, setDate] = useState("");

  // Snackbar state
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const SNACK_DURATION = 2500; // ms

  const handleCheck = (e) => {
    const { name, checked } = e.target;
    setConsent((prev) => ({ ...prev, [name]: checked }));
  };

  const allChecked = Object.values(consent).every(Boolean);

  const submitToApi = async (payload) => {
    const res = await fetch(`/api/consent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allChecked || !participantName || !signature || !date) {
      return alert("Please complete the form.");
    }

    const payload = {
      ...consent,
      participantName,
      signature,
      date,
    };

    try {
      const res = await submitToApi(payload);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("API error:", data);
        return alert("Submission failed: " + (data.error || res.statusText));
      }

      // Show success snackbar, navigate after snackbar closes
      setSnackMsg("Consent submitted successfully.");
      setSnackOpen(true);
    } catch (err) {
      console.error(err);
      alert("Network error submitting consent.");
    }
  };

  const handleSnackClose = (event, reason) => {
    // ignore clickaway to allow auto-close; close on timeout or explicit action
    if (reason === "clickaway") return;
    setSnackOpen(false);
  };

  const handleSnackExited = () => {
    // Called after the transition finishes and snackbar is closed — navigate now
    navigate("/debrief");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Informed Consent
        </Typography>

        <Typography gutterBottom>
          <strong>Study Title:</strong> Cloud-Native Disaster Response Platform for NGOs and Local Governments...
        </Typography>

        <Typography gutterBottom>
          <strong>Researcher:</strong> Francis, Cyriacus Chigozie
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  required
                  checked={consent.consent1}
                  onChange={handleCheck}
                  name="consent1"
                />
              }
              label="I have received and read the Participant Information Sheet."
            />

            <FormControlLabel
              control={
                <Checkbox
                  required
                  checked={consent.consent2}
                  onChange={handleCheck}
                  name="consent2"
                />
              }
              label="I understand participation is voluntary and I may withdraw at any time without giving a reason."
            />

            <FormControlLabel
              control={
                <Checkbox
                  required
                  checked={consent.consent3}
                  onChange={handleCheck}
                  name="consent3"
                />
              }
              label="I understand my data will be handled confidentially and securely per GDPR."
            />

            <FormControlLabel
              control={
                <Checkbox
                  required
                  checked={consent.consent4}
                  onChange={handleCheck}
                  name="consent4"
                />
              }
              label="I consent to the anonymized processing of my data for research purposes."
            />

            <FormControlLabel
              control={
                <Checkbox
                  required
                  checked={consent.consent5}
                  onChange={handleCheck}
                  name="consent5"
                />
              }
              label="I am aware I may contact the researcher or supervisor with questions."
            />

            <FormControlLabel
              control={
                <Checkbox
                  required
                  checked={consent.consent6}
                  onChange={handleCheck}
                  name="consent6"
                />
              }
              label="I understand after withdrawal, no further data will be collected and existing data will be deleted if I request."
            />

            <TextField
              required
              label="Participant Name/Company"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              fullWidth
            />

            <TextField
              required
              label="Electronic Signature"
              placeholder="Type full name"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              fullWidth
            />

            <TextField
              required
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <Box display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={!allChecked || !participantName || !signature || !date}
              >
                Submit Consent
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                href="https://forms.office.com/e/qeJTgKiqrt"
                target="_blank"
                rel="noopener"
              >
                Survey Link
              </Button>

              <Button variant="outlined" color="primary" href="/">
                Previous page
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={snackOpen}
        autoHideDuration={SNACK_DURATION}
        onClose={handleSnackClose}
        TransitionProps={{ onExited: handleSnackExited }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackClose} severity="success" sx={{ width: "100%" }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
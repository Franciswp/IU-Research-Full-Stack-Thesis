import React from "react";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ParticipantInfoSheet() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Participant Information 
        </Typography>
        <Typography gutterBottom>
          <strong>Title of the Study:</strong>{" "}
          Cloud-Native Disaster Response Platform for NGOs and Local Governments: A Scalable, Open-Source Solution for Emergency Aid Coordination
        </Typography>
        <Typography gutterBottom>
          <strong>Researcher:</strong> Francis, Cyriacus Chigozie
        </Typography>
        <Typography gutterBottom>
          <strong>Purpose of the Study:</strong> Design, implement, and evaluate an open-source platform for NGOs and local governments to coordinate aid, logistics, and medical resources. It leverages DevOps for rapid deployment, IaC for reusability, and AI for prioritization, aiming to provide cost-effective solutions for under-resourced entities.
        </Typography>
        <Typography gutterBottom>
          <strong>Why You Have Been Invited:</strong> This thesis proposes a cloud-native, open-source platform using AWS/GCP, CI/CD, IaC, and AI to enable efficient, scalable emergency response. The narrowed scope focuses on AI-driven CI/CD for medical logistics under edge constraints, targeting small-to-medium NGOs (e.g., 5–50 IT staff) in low-connectivity environments
        </Typography>
        <Typography gutterBottom>
          <strong>Voluntary Participation:</strong> Participation in this study is entirely voluntary. You may withdraw at any time without providing a reason, and without any negative consequences.
        </Typography>
        <Typography gutterBottom>
          <strong>What Participation Involves:</strong> The proposed platform innovates by integrating Infrastructure as Code (IaC) with AI for real-time, geography-agnostic coordination in humanitarian aid. Building on urban-focused systems (Kangana, 2024) and proactive DevOps approaches (Latvakoski, 2022), it extends existing tools to provide cost-effective, scalable solutions amid rising global disasters (UNDRR, 2023). Participation will take approximately 20-30 minutes.
        </Typography>
        <Typography gutterBottom>
          <strong>Data Protection and Confidentiality:</strong> All information collected will be treated confidentially in accordance with the European General Data Protection Regulation (GDPR). Your data will be anonymized and securely stored on IU's official OneDrive system and will be deleted after 8 weeks, max 6 months.
        </Typography>
        <Typography gutterBottom>
          You have the right to access, correct, or request the deletion of your data at any time.
        </Typography>
        <Typography gutterBottom>
          <strong>Contact Information:</strong> Researcher: Francis, Cyriacus Chigozie – chigozie-cyriacus.francis@iu-study.org
        </Typography>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={() => navigate("/consent")}
            sx={{ textTransform: "none" }}
          >
            Next
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
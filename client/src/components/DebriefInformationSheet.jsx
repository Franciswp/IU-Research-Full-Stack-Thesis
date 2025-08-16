import React from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";

export default function DebriefInformationSheet() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Debrief Information 
        </Typography>
        <Typography gutterBottom>
          Thank you for participating in the study:{" "}
          <strong>
            Cloud-Native Disaster Response Platform for NGOs and Local Governments: A Scalable, Open-Source Solution for Emergency Aid Coordination
          </strong>.
        </Typography>
        <Typography gutterBottom>
          <strong>Purpose of the Study:</strong> Design, implement, and evaluate an open-source platform for NGOs and local governments to coordinate aid, logistics, and medical resources. It leverages DevOps for rapid deployment, IaC for reusability, and AI for prioritization, aiming to provide cost-effective solutions for under-resourced entities.
        </Typography>
        <Typography gutterBottom>
          <strong>Use of Data:</strong> Your responses will be anonymized and used for academic research. Data will be stored on IU’s OneDrive and deleted by 6 months or max, 2 years.
        </Typography>
        <Typography gutterBottom>
          <strong>Your Rights:</strong> You retain the right to access, correct, or request the deletion of your data at any time by contacting Francis, Cyriacus Chigozie – chigozie-cyriacus.francis@iu-study.org.
        </Typography>
        <Typography gutterBottom>
          <strong>Concerns or Complaints:</strong> If you have concerns about your rights, contact: info@iu-study.org.
        </Typography>
        <Typography gutterBottom>
          Thank you for your contribution!
        </Typography><br />
        <Box display="flex" gap={2}>
   <Button
          variant="outlined"
          color="secondary"
          onClick={() =>
            setTimeout(() => {
              window.open(
                "https://forms.office.com/e/qeJTgKiqrt",
                "_blank",
                "noopener,noreferrer"
              );
            }, 1000)
          }
        >
          Survey Link
        </Button>
                         );
                       }, 1000)
                     }
                   >
                     Survey Link
                   </Button>
</Box>                
      </Paper>
    </Container>
  );
}
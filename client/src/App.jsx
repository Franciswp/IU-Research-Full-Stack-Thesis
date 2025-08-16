import { BrowserRouter, Routes, Route } from "react-router-dom";
import ParticipantInfoSheet from "./components/ParticipantInfoSheet";
import InformedConsentForm from "./components/InformedConsentForm";
import DebriefInformationSheet from "./components/DebriefInformationSheet";
import SurveyPage from "./components/SurveyPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ParticipantInfoSheet />} />
        <Route path="/consent" element={<InformedConsentForm />} />
        <Route path="/debrief" element={<DebriefInformationSheet />} />
        <Route path="/survey" element={<SurveyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ParticipantInfoSheet from "./components/ParticipantInfoSheet";
import InformedConsentForm from "./components/InformedConsentForm";
import DebriefInformationSheet from "./components/DebriefInformationSheet";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ParticipantInfoSheet />} />
        <Route path="/consent" element={<InformedConsentForm />} />
        <Route path="/debrief" element={<DebriefInformationSheet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import React from "react";
import Home from "./pages/Home";
import UploadImage from "./pages/UploadImage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPDF from "./pages/UploadPDF";
import UploadDoc from "./pages/UploadDoc";
import UploadPPT from "./pages/UploadPPT";
import QuizPage from "./pages/QuizPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uploadImage" element={<UploadImage />} />
        <Route path="/uploadPdf" element={<UploadPDF />} />
        <Route path="/uploadDoc" element={<UploadDoc />} />
        <Route path="/uploadPPT" element={<UploadPPT />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  );
};

export default App;

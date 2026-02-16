import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopPage from "./pages/index";
import ChatPage from "./pages/chat/index";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}


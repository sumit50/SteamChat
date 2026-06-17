import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HeroPage } from "./pages/HeroPage";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { MainLayout } from "./layouts/MainLayout";
import { ChatPage } from "./pages/chatPage";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HeroPage />} />


{/*Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


    {/*pages routes */}

                  <Route path="/chatPage" element={<ChatPage />} />


          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;

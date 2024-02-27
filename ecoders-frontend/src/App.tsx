import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { useState } from 'react';
import './App.css';

import Footer from './components/sharedlayout/Footer';
import Header from './components/sharedlayout/Header';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Session from './components/feature/user/Session';
import SignupPage from './pages/SignupPage';
import CommunityBoardPage from './pages/CommunityBoardPage';
import CommunityPostDetailPage from './pages/CommunityPostDetailPage';
import MyInfoPage from './pages/MyinfoPage';
import ErrorPage from './pages/ErrorPage';
import CommunityPostWritePage from './pages/CommunityPostWritePage';
import ServicePage from './pages/ServicePage';
import ContactPage from './pages/ContactPage';

function App() {
  // const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <BrowserRouter>
        {/* {isLoading ? ( */}
        <Session
        // setIsLoading={setIsLoading}
        />
        {/* ) : ( */}
        <>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/community" element={<CommunityBoardPage />} />
            <Route path="/community/postdetail/:postnumber" element={<CommunityPostDetailPage />} />
            <Route path="/community/postwrite" element={<CommunityPostWritePage />} />
            <Route path="/myinfo" element={<MyInfoPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
          <Footer />
        </>
        {/* )} */}
      </BrowserRouter>
    </>
  );
}

export default App;

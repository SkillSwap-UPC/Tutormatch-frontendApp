import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './public/pages/auth/login'
import RegisterPage from './public/pages/auth/register';
import RegisterSuccessPage from './public/pages/auth/register-success';
import ForgotPasswordPage from './public/pages/auth/forgot-password';
import 'primereact/resources/themes/lara-dark-pink/theme.css'
import DashboardPage from './dashboard/pages/DashboardPage';
import 'primeicons/primeicons.css';
import TutoringDetailsPage from './tutoring/pages/TutoringDetailsPage';
import TutoringsBySemester from './dashboard/pages/TutoringsBySemester';
import NotFoundPage from './public/pages/not-found/NotFoundPage';
import ProfilePage from './public/pages/profile/ProfilePage';
import VerifyEmailPage from './public/pages/auth/verify-email';
import { AvatarProvider } from './user/hooks/avatarContext';
import SupportPage from './support/pages/SupportPage';

const App = () => {
  return (
    <AvatarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/semester/:semesterId" element={<TutoringsBySemester />} />
          <Route path="/tutoring/:tutoringId" element={<TutoringDetailsPage />} />
          <Route path="/register/success" element={<RegisterSuccessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AvatarProvider>
  );
}

export default App;
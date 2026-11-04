import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

// Layouts
import MainLayout from './layouts/MainLayout';
import StudentLayout from './layouts/StudentLayout';

// Public Pages
import HomePage from './pages/HomePage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import ContactPage from './pages/ContactPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import PaymentResultPage from './pages/PaymentResultPage';
import { AboutPage, CareerSupportPage } from './pages/MarketingPages';
import LegalPage from './pages/LegalPage';
import TestimonialsPage from './pages/TestimonialsPage';
import FaqPage from './pages/FaqPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';

// Student Protected Pages
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentLearningPage from './pages/StudentLearningPage';
import LearningPlayerPage from './pages/LearningPlayerPage';
import {
  CertificatesPage,
  PaymentsPage,
  ProfilePage
} from './pages/StudentPages';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="courses" element={<CourseCatalogPage />} />
            <Route path="courses/:slug" element={<CourseDetailsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="verify-certificate/:certificateNumber" element={<VerifyCertificatePage />} />
            <Route path="payment-result" element={<PaymentResultPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:slug" element={<ProjectDetailsPage />} />
            <Route path="career-support" element={<CareerSupportPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="faqs" element={<Navigate to="/faq" replace />} />
            <Route path="privacy-policy" element={<LegalPage type="privacy" />} />
            <Route path="privacy" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="terms" element={<LegalPage type="terms" />} />
            {/* Redirect /roadmap to /projects#roadmap-stages */}
            <Route path="roadmap" element={<Navigate to="/projects" replace />} />
            <Route path="devops-roadmap" element={<Navigate to="/projects" replace />} />
          </Route>

          {/* Student Classroom Player */}
          <Route path="/student/courses/:courseId" element={<LearningPlayerPage />} />

          {/* Student Dashboard Portal */}
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="learning" element={<StudentLearningPage />} />
            {/* Old "My Courses" URL kept alive — redirects to the Learning hub */}
            <Route path="courses" element={<Navigate to="/student/learning" replace />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

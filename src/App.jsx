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
import { AboutPage, CareerSupportPage, LegalPage } from './pages/MarketingPages';
import TestimonialsPage from './pages/TestimonialsPage';
import FaqPage from './pages/FaqPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';

// Student Protected Pages
import StudentDashboardPage from './pages/StudentDashboardPage';
import LearningPlayerPage from './pages/LearningPlayerPage';
import {
  StudentQuizListPage,
  StudentQuizTakePage,
  StudentQuizResultPage
} from './pages/QuizPages';
import {
  StudentAssignmentListPage,
  StudentAssignmentDetailPage,
  StudentSubmissionHistoryPage
} from './pages/AssignmentPages';
import {
  AssessmentsPage,
  AssignmentsPage,
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
            {/* The standalone roadmap page is removed; the curriculum now lives
                inside each Admin-managed course. Old /roadmap links go to the
                dynamic DevOps catalog filter instead of a fixed course slug. */}
            <Route path="roadmap" element={<Navigate to="/courses?category=devops" replace />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:slug" element={<ProjectDetailsPage />} />
            <Route path="career-support" element={<CareerSupportPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="faqs" element={<Navigate to="/faq" replace />} />
            <Route path="privacy-policy" element={<LegalPage type="privacy" />} />
            <Route path="terms" element={<LegalPage type="terms" />} />
          </Route>

          {/* Student Classroom Player */}
          <Route path="/student/courses/:courseId" element={<LearningPlayerPage />} />

          {/* Student Quiz flow */}
          <Route path="/student/courses/:courseId/quizzes" element={<StudentQuizListPage />} />
          <Route path="/student/courses/:courseId/quizzes/:quizId" element={<StudentQuizTakePage />} />
          <Route path="/student/courses/:courseId/quizzes/:quizId/results/:attemptId" element={<StudentQuizResultPage />} />

          {/* Student Assignment & Project flow */}
          <Route path="/student/courses/:courseId/assignments" element={<StudentAssignmentListPage />} />
          <Route path="/student/courses/:courseId/assignments/:assignmentId" element={<StudentAssignmentDetailPage />} />
          <Route path="/student/assignments/history" element={<StudentSubmissionHistoryPage />} />

          {/* Student Dashboard Portal */}
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="courses" element={<StudentDashboardPage />} />
            <Route path="assessments" element={<AssessmentsPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
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

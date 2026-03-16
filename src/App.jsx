import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import CollegesPage from './pages/CollegesPage';
import CoursesPage from './pages/CoursesPage';
import ExamsPage from './pages/ExamsPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import ScholarshipDetailPage from './pages/ScholarshipDetailPage';
import StudyAbroadPage from './pages/StudyAbroadPage';
import OnlineCoursesPage from './pages/OnlineCoursesPage';
import CareerGuidancePage from './pages/CareerGuidancePage';
import BlogPage from './pages/BlogPage';
import CollegeDetailPage from './pages/CollegeDetailPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ExamDetailPage from './pages/ExamDetailPage';
import CompareCollegesPage from './pages/CompareCollegesPage';
import CollegePredictorPage from './pages/CollegePredictorPage';
import RoiCalculatorPage from './pages/RoiCalculatorPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/dashboards/AdminDashboardPage';
import CounselorDashboardPage from './pages/dashboards/CounselorDashboardPage';
import StudentDashboardPage from './pages/dashboards/StudentDashboardPage';
import CollegeAdminDashboardPage from './pages/dashboards/CollegeAdminDashboardPage';
import AdminCounselorDashboardPage from './pages/dashboards/AdminCounselorDashboardPage';
import { setAuthToken } from './lib/api';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
  }, []);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/colleges" element={<CollegesPage />} />
        <Route path="/colleges/:slug" element={<CollegeDetailPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/exams/:slug" element={<ExamDetailPage />} />
        <Route path="/scholarships" element={<ScholarshipsPage />} />
        <Route path="/scholarships/:slug" element={<ScholarshipDetailPage />} />
        <Route path="/study-abroad" element={<StudyAbroadPage />} />
        <Route path="/online-courses" element={<OnlineCoursesPage />} />
        <Route path="/career-guidance" element={<CareerGuidancePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/compare-colleges" element={<CompareCollegesPage />} />
        <Route path="/college-predictor" element={<CollegePredictorPage />} />
        <Route path="/roi-calculator" element={<RoiCalculatorPage />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="student" element={<ProtectedRoute roles={['student']}><StudentDashboardPage /></ProtectedRoute>} />
        <Route path="counselor" element={<ProtectedRoute roles={['counselor']}><CounselorDashboardPage /></ProtectedRoute>} />
        <Route path="admin-counselor" element={<ProtectedRoute roles={['admin_counselor']}><AdminCounselorDashboardPage /></ProtectedRoute>} />
        <Route path="college-admin" element={<ProtectedRoute roles={['college_admin']}><CollegeAdminDashboardPage /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute roles={['platform_admin']}><AdminDashboardPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

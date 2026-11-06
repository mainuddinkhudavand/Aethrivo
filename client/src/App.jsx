import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy-loaded public pages
const Home = lazy(() => import('./pages/Home'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Experts = lazy(() => import('./pages/Experts'));
const Verticals = lazy(() => import('./pages/Verticals'));
const VerticalDetail = lazy(() => import('./pages/VerticalDetail'));
const Membership = lazy(() => import('./pages/Membership'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const MemberCard = lazy(() => import('./pages/MemberCard'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy-loaded admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminMembers = lazy(() => import('./pages/admin/Members'));
const AdminMemberDetail = lazy(() => import('./pages/admin/MemberDetail'));
const AdminEnquiries = lazy(() => import('./pages/admin/Enquiries'));
const AdminEnquiryDetail = lazy(() => import('./pages/admin/EnquiryDetail'));
const AdminTasks = lazy(() => import('./pages/admin/Tasks'));
const AdminTaskDetail = lazy(() => import('./pages/admin/TaskDetail'));
const AdminCourses = lazy(() => import('./pages/admin/Courses'));
const AdminEvents = lazy(() => import('./pages/admin/Events'));
const AdminExperts = lazy(() => import('./pages/admin/Experts'));
const AdminMoUs = lazy(() => import('./pages/admin/MoUs'));
const AdminManagerProgress = lazy(() => import('./pages/admin/ManagerProgress'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AuditLogs'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));

// Lazy-loaded manager pages
const ManagerDashboard = lazy(() => import('./pages/manager/Dashboard'));
const ManagerEnquiries = lazy(() => import('./pages/manager/Enquiries'));
const ManagerTasks = lazy(() => import('./pages/manager/Tasks'));
const ManagerMembers = lazy(() => import('./pages/manager/Members'));
const ManagerSettings = lazy(() => import('./pages/manager/Settings'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="text-sm text-slate-500 dark:text-slate-400">Loading…</span>
      </div>
    </div>
  );
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
        <Route path="/courses/:slug" element={<PublicLayout><CourseDetail /></PublicLayout>} />
        <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
        <Route path="/events/:slug" element={<PublicLayout><EventDetail /></PublicLayout>} />
        <Route path="/experts" element={<PublicLayout><Experts /></PublicLayout>} />
        <Route path="/verticals" element={<PublicLayout><Verticals /></PublicLayout>} />
        <Route path="/verticals/:slug" element={<PublicLayout><VerticalDetail /></PublicLayout>} />
        <Route path="/membership" element={<PublicLayout><Membership /></PublicLayout>} />
        <Route path="/verify-email" element={<PublicLayout><VerifyEmail /></PublicLayout>} />
        <Route path="/member-card/:memberId" element={<PublicLayout><MemberCard /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout role="admin" /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="members/:id" element={<AdminMemberDetail />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="enquiries/:id" element={<AdminEnquiryDetail />} />
          <Route path="tasks" element={<AdminTasks />} />
          <Route path="tasks/:id" element={<AdminTaskDetail />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="experts" element={<AdminExperts />} />
          <Route path="mous" element={<AdminMoUs />} />
          <Route path="manager-progress" element={<AdminManagerProgress />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Manager routes */}
        <Route path="/manager" element={<ProtectedRoute allowedRoles={['manager']}><DashboardLayout role="manager" /></ProtectedRoute>}>
          <Route index element={<ManagerDashboard />} />
          <Route path="enquiries" element={<ManagerEnquiries />} />
          <Route path="tasks" element={<ManagerTasks />} />
          <Route path="members" element={<ManagerMembers />} />
          <Route path="settings" element={<ManagerSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </Suspense>
  );
}

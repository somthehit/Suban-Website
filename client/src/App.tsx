import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Common Components
import ScrollToTop from './components/common/ScrollToTop';

// Public Layout
import PublicLayout from './layouts/PublicLayout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import GalleryPage from './pages/GalleryPage';
import TourismPage from './pages/Tourism';
import ContactPage from './pages/ContactPage';
import JoinUsPage from './pages/JoinUsPage';
import DonatePage from './pages/DonatePage';

// Admin Layout
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlog from './pages/admin/AdminBlog';
import AdminBlogEditor from './pages/admin/AdminBlogEditor';
import AdminGallery from './pages/admin/AdminGallery';
import AdminGalleryEditor from './pages/admin/AdminGalleryEditor';
import AdminMessages from './pages/admin/AdminMessages';
import AdminJoinRequests from './pages/admin/AdminJoinRequests';
import AdminSettings from './pages/admin/AdminSettings';
import AdminDonate from './pages/admin/AdminDonate';
import AdminTourism from './pages/admin/AdminTourism';

// Error Pages
import NotFoundPage from './pages/NotFoundPage';

// Providers
import { ThemeProvider } from './components/providers/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="App">
          <ScrollToTop />
          <AnimatePresence mode="wait" initial={false}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/:slug" element={<BlogPostPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="tourism" element={<TourismPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="join-us" element={<JoinUsPage />} />
                <Route path="donate" element={<DonatePage />} />
              </Route>

              {/* Admin Login - Not Protected */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
<Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="donate" element={<AdminDonate />} />
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="blog/new" element={<AdminBlogEditor />} />
                <Route path="blog/edit/:id" element={<AdminBlogEditor />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="gallery/new" element={<AdminGalleryEditor />} />
                <Route path="gallery/edit/:id" element={<AdminGalleryEditor />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="join-requests" element={<AdminJoinRequests />} />
                <Route path="tourism" element={<AdminTourism />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
            }}
          />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

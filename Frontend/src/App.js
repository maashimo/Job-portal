import { BrowserRouter, Routes, Route,} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardJobSeeker from './pages/DashboardJobSeeker';
import DashboardRecruiter from './pages/DashboardRecruiter';
import Home from './pages/Home';
import JobList from './pages/JobList';
import PostJob from './pages/Postjob';
import Navbar from './components/Navbar';
import Unauthorized from './pages/Unauthorized';
import JobDetails from './pages/JobDetails';
import ApplicationForm from './components/ApplicationForm';
import EditProfileForm from './components/EditProfileForm';
import ContactUs from './pages/ContactUs';
import Explore from './pages/Explore';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/apply" element={<ApplicationForm />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/edit-profile" element={<EditProfileForm />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/about" element={<AboutUs />} />

        {/* Protected Routes */}
        
        <Route path="/post-job" element={
          <ProtectedRoute allowedRoles={['recriter']}>
            <PostJob />
          </ProtectedRoute>
        } />
        
        <Route path="/job_seeker/dashboard" element={
          <ProtectedRoute allowedRoles={['job_seeker']}>
            <DashboardJobSeeker />
          </ProtectedRoute>
        } />
        
        <Route path="/recruiter/dashboard" element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <DashboardRecruiter />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
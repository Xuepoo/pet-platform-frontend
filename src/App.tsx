import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import PetList from './pages/PetList';
import PetDetail from './pages/PetDetail';
import Reports from './pages/Reports';
import CreateReport from './pages/CreateReport';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Feed from './pages/Feed';
import PostEditor from './pages/PostEditor';
import PostDetail from './pages/PostDetail';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="feed" element={<Feed />} />
          <Route path="posts/:id" element={<PostDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="pets" element={<PetList />} />
          <Route path="pets/:id" element={<PetDetail />} />
          <Route path="reports" element={<Reports />} />
          <Route element={<ProtectedRoute />}>
              <Route path="posts/new" element={<PostEditor />} />
              <Route path="profile" element={<Profile />} />
              <Route path="reports/new" element={<CreateReport />} />
              <Route path="applications" element={<Applications />} />
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
          </Route>
          <Route path="*" element={<div className="text-center py-20">404 Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

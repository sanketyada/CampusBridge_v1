import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import EventSphere from './pages/EventSphere/EventSphere';
import RoadmapViewer from './pages/Roadmaps/RoadmapViewer';
import ChatInterface from './pages/AIBot/ChatInterface';
import Library from './pages/Resources/Library';
import ResourceDetails from './pages/Resources/ResourceDetails';
import Feed from './pages/Community/Feed';
import Profile from './pages/Profile/Profile';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<EventSphere />} />
          <Route path="/roadmaps" element={<RoadmapViewer />} />
          <Route path="/ai-bot" element={<ChatInterface />} />
          <Route path="/resources" element={<Library />} />
          <Route path="/resources/:id" element={<ResourceDetails />} />
          <Route path="/community" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


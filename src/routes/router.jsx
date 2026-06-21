import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

import HomePage from '../pages/HomePage';
import SearchResultsPage from '../pages/SearchResultsPage';
import PropertyDetailPage from '../pages/PropertyDetailPage';
import AgentProfilePage from '../pages/AgentProfilePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import BecomeAgentPage from '../pages/BecomeAgentPage';
import UserDashboardPage from '../pages/UserDashboardPage';
import AgentDashboardPage from '../pages/AgentDashboardPage/index';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/listing/:id" element={<PropertyDetailPage />} />
          <Route path="/agents/:agentId" element={<AgentProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/become-agent" element={<BecomeAgentPage />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/agent/dashboard/*"
            element={<ProtectedRoute requiredRole="agent"><AgentDashboardPage /></ProtectedRoute>}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

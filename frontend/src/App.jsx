import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage    from './pages/HomePage.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/"  element={<HomePage />} />

      {/* Admin panel — all nested routes handled inside AdminLayout */}
      <Route path="/admin/*" element={<AdminLayout />} />

      {/* Fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Buses from './pages/Buses';
import Bookings from './pages/Bookings';
import Timetable from './pages/Timetable';
import Favorites from './pages/Favorites';
import MapPage from './pages/MapPage';
import Footer from './sections/Footer';
import CustomerSupport from './components/CustomerSupport';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buses" element={<Buses />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/map/:id" element={<MapPage />} />
        </Routes>

        <Footer />
        <CustomerSupport />
      </div>
    </AuthProvider>
  );
};

export default App;

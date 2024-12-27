import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Taste from './components/pages/Taste.jsx';
import Login from './components/pages/Login.jsx';
import Riviews from './components/pages/Riviews.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/taste" element={<Taste />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reviews" element={<Riviews />} />
        </Routes>
    );
};

export default AppRoutes;
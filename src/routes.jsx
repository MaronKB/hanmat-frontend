import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default AppRoutes;
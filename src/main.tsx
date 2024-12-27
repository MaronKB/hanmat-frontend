import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import React from 'react';
import { BrowserRouter } from "react-router-dom";
import AppRoutes from './routes';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>,
)

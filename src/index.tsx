import { createRoot } from 'react-dom/client'
import Nav from './components/nav/Main.tsx';
import Home from './components/home/Main.tsx';
import Login from './components/login/Main.tsx';
import './index.css'
import "./locales/i18n.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route element={<Nav />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Route>
        </Routes>
    </BrowserRouter>
)

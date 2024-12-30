import { createRoot } from 'react-dom/client'
import Nav from './components/nav/Main.tsx';
import Home from './components/home/Main.tsx';
import Login from './components/login/Main.tsx';
import Reviews from './components/reviews/Main.tsx';
import Taste from './components/taste/Main.tsx';
import './index.css'
import "./locales/i18n.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route element={<Nav />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/taste" element={<Taste />} />
            </Route>
        </Routes>
    </BrowserRouter>
)

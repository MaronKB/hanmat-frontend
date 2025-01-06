import { createRoot } from 'react-dom/client'
import Nav from './components/nav/Main.tsx';
import Login from './components/login/Main.tsx';
import Home from './components/home/Main.tsx';
import Find from './components/find/Main.tsx';
import Taste from './components/taste/Main.tsx';
import Reviews from './components/reviews/Main.tsx';
import Buddy from './components/buddy/Main.tsx';
import MyPage from './components/mypage/Main.tsx';
import AdminReviews from "./components/admin/AdminReviews.tsx";
import AdminRestaurants from "./components/admin/AdminRestaurants.tsx";
import './index.css'
import "./locales/i18n.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route element={<Nav />}>
                <Route path="/" element={<Home />} />
                <Route path="/find" element={<Find />} />
                <Route path="/login" element={<Login />} />
                <Route path="/taste" element={<Taste />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/buddy" element={<Buddy />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path={"/adminReviews"} element={<AdminReviews />} />
                <Route path={"/adminRestaurants"} element={<AdminRestaurants />} />
            </Route>
        </Routes>
    </BrowserRouter>
)

import { createRoot } from 'react-dom/client'
import Nav from './components/nav/Main.tsx';
import './index.css'
import "./locales/i18n.ts";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Nav/>
    </BrowserRouter>
)

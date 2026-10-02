import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthLayout } from './components/AuthLayout';
import HomePage from './pages/HomePage';
import HombrePage from './pages/HombrePage';
import MujerPage from './pages/MujerPage';
import OfertasPage from './pages/OfertasPage';
import OtrosPage from './pages/OtrosPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPage from './pages/ForgotPage';
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'hombre', element: <HombrePage /> },
      { path: 'mujer', element: <MujerPage /> },
      { path: 'ofertas', element: <OfertasPage /> },
      { path: 'otros', element: <OtrosPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot', element: <ForgotPage /> },
    ],
  },
]);

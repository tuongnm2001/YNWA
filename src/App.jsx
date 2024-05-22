import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from './pages/login';
import Register from './pages/register';
import { Outlet } from "react-router-dom";
import Footer from './components/Footer';
import Home from './components/Home';
import ErrorPage from './components/Error';
import './App.scss'
import { fetchAccount } from './services/api';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import HeaderPage from './components/Header';
import LayoutAdmin from './pages/admin/LayoutAdmin';
import TableBooks from './components/Admin/ManageBooks/TableBooks';
import ManageOrders from './pages/manage-orders';
import DashBoard from './pages/admin';
import TableUser from './components/Admin/ManageUsers/TableUser';
import BookDetail from './pages/book';
import "react-image-gallery/styles/scss/image-gallery.scss";
import './global.scss'
import Order from './components/Book/Order';
import OrderHistory from './components/Book/OrderHistory';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className='layout-app'>
      <HeaderPage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className='outlet'>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.account.isLoading)

  const getAccount = async () => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register')
      return;

    const res = await fetchAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data))
    }
  }

  useEffect(() => {
    getAccount()
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "book/:slug",
          element: <BookDetail />,
        },
        {
          path: "order",
          element:
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
        },
        {
          path: "order-history",
          element:
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>

        },
      ],
    },

    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
        },
        ,
        {
          path: "user-crud",
          element: <TableUser />,
        },
        {
          path: "manage-books",
          element: <TableBooks />,
        },
        {
          path: "manage-orders",
          element: <ManageOrders />,
        }
      ],
    },

    {
      path: "/login",
      element: <LoginPage />
    },

    {
      path: "/register",
      element: <Register />
    },
  ]);

  return (
    <>
      {
        isLoading === false
          || window.location.pathname === '/'
          || window.location.pathname === '/login'
          || window.location.pathname === '/register'
          ?
          <RouterProvider router={router} />
          :
          <Loading />
      }
    </>
  )
}


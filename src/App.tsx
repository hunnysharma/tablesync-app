import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from '@/pages/Index';
import Orders from '@/pages/Orders';
import Menu from '@/pages/Menu';
import Tables from '@/pages/Tables';
import TableDetail from '@/pages/TableDetail';
import Bills from '@/pages/Bills';
import NotFound from '@/pages/NotFound';
import Setup from '@/pages/Setup';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/orders',
    element: <Orders />,
  },
  {
    path: '/menu',
    element: <Menu />,
  },
  {
    path: '/tables',
    element: <Tables />,
  },
  {
    path: '/tables/:id',
    element: <TableDetail />,
  },
  {
    path: '/bills',
    element: <Bills />,
  },
  {
    path: '/setup',
    element: <Setup />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

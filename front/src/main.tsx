import React from "react";
import ReactDOM from "react-dom/client";

import Layout from "./Components/Layout.tsx";
import NotFound from "./Components/NotFound.tsx";

import AddAuthor from "./Components/AddAuthor.tsx";
import AddBook from "./Components/AddBook.tsx";
import BookTable from "./Components/BookTable.tsx";
import EditPanel from "./Components/EditBook.tsx";
import LoginPage from "./Components/LoginPage.tsx"
import CreateAccountPage from "./Components/CreateAccountPage.tsx";


import { createBrowserRouter, RouterProvider } from "react-router-dom";


const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <LoginPage />,
            },
            {
                path: "/createAccount",
                element: <CreateAccountPage />,
            },
            

            {
                path: "/table",
                element: <BookTable />,
            },
            
            {
                path: "/addAuthor",
                element: <AddAuthor />,
            },
            {
                path: "/addBook",
                element: <AddBook />,
            },
            {
                path: "/edit",
                element: <EditPanel />,
            },
            
            {
              path: "*",
              element: <NotFound />,
          },

        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Global level componets.
import PageLoadProgressBar from "@layouts/PageLoadProgressBarComponent";
import AlertModals from "@/views/modals/AlertModalsComponent";

// View components.
import SignInView from "@/views/signIn/SignInView";
import MainLayout from "@/views/layouts/MainLayout";

// Router.
const router = createBrowserRouter([
    { path: "/signIn", element: <SignInView /> },
    { path: "/*", element: <MainLayout /> }
]);

const App = () => {
    return (
        <>
            <PageLoadProgressBar/>
            <RouterProvider router={router} />
            <AlertModals />
        </>
    );
};

export default App;
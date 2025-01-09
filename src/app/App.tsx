import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Global level componets.
import PageLoadProgressBar from "@layouts/PageLoadProgressBarComponent";
import AlertModals from "@/views/modals/AlertModalsComponent";

// View components.
import SignInView from "@/views/signIn/SignInView";
import MainLayout from "@/views/layouts/MainLayout";

const App = () => {
    return (
        <>
            <PageLoadProgressBar/>
            <BrowserRouter>
                <Routes>
                    {/* SignIn */}
                    <Route path="/signIn" element={<SignInView />} />

                    {/* AuthenticationRequired */}
                    <Route path="/*" element={<MainLayout />} />
                </Routes>
            </BrowserRouter>
            <AlertModals />
        </>
    );
};

export default App;
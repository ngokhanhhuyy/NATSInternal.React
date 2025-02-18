import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainContainer from "@layouts/MainContainerComponent";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";

const HomeView = () => <LoadingView />;

const LoadingView = () => {
    const store = useAlertModalStore();
    const navigate = useNavigate();
    const [confirmation, setConfirmation] = useState<boolean | string>();

    const columnClassName = "col col-xxl-3 col-xl-4 col-md-6 col-12 d-flex flex-column";
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();

    // Effect.
    useEffect(() => {
        setTimeout(onInitialLoadingFinished, 300);
    }, []);

    if (isInitialLoading) {
        return null;
    }

    return (
        <MainContainer>
            <div className="row g-3">
                {/* DeletingConfirmation */}
                <div className={columnClassName}>
                    <button className="btn btn-primary mb-3"
                        onClick={() => store.getDeletingConfirmationAsync()
                            .then(answer => setConfirmation(answer))}>
                        DeletingConfirmation
                    </button>
                    <span className="border border-primary-subtle bg-primary-subtle
                                    rounded-3 text-primary px-3 py-2 text-center fw-bold">
                        {JSON.stringify(confirmation)}
                    </span>
                </div>


                {/* NotFoundConfirmation */}
                <div className={columnClassName}>
                    <button className="btn btn-primary mb-3"
                        onClick={() => store.getNotFoundConfirmationAsync()
                            .then(() => {
                                setConfirmation("NotFound");
                                navigate("/products");
                            })}>
                        NotFoundConfirmation
                    </button>
                    <span className="border border-primary-subtle bg-primary-subtle
                                    rounded-3 text-primary px-3 py-2 text-center fw-bold">
                        {JSON.stringify(confirmation)}
                    </span>
                </div>

                {/* DiscardingConfirmation */}
                <div className={columnClassName}>
                    <button className="btn btn-primary mb-3"
                        onClick={() => store.getDiscardingConfirmationAsync()
                            .then(answer => setConfirmation(answer))}>
                        DiscardingConfirmation
                    </button>
                    <span className="border border-primary-subtle bg-primary-subtle
                                    rounded-3 text-primary px-3 py-2 text-center fw-bold">
                        {JSON.stringify(confirmation)}
                    </span>
                </div>

                {/* SubmissionErrorConfirmation */}
                <div className={columnClassName}>
                    <button className="btn btn-primary mb-3"
                        onClick={() => store.getSubmissionErrorConfirmationAsync()
                            .then(() => setConfirmation("SubmissionError"))}>
                        SubmissionErrorConfirmation
                    </button>
                    <span className="border border-primary-subtle bg-primary-subtle
                                    rounded-3 text-primary px-3 py-2 text-center fw-bold">
                        {JSON.stringify(confirmation)}
                    </span>
                </div>

                {/* SubmissionSuccessConfirmation */}
                <div className={columnClassName}>
                    <button className="btn btn-primary mb-3"
                        onClick={() => store.getSubmissionSuccessConfirmationAsync()
                            .then(() => setConfirmation("SubmissionSuccess"))}>
                        SubmissionSuccessConfirmation
                    </button>
                    <span className="border border-primary-subtle bg-primary-subtle
                                    rounded-3 text-primary px-3 py-2 text-center fw-bold">
                        {JSON.stringify(confirmation)}
                    </span>
                </div>

                {/* UnauthorizationConfirmation */}
                <div className={columnClassName}>
                    <button className="btn btn-primary mb-3"
                        onClick={() => store.getUnauthorizationConfirmationAsync()
                            .then(() => setConfirmation("Unauthorized"))}>
                        UnauthorizationConfirmation
                    </button>
                    <span className="border border-primary-subtle bg-primary-subtle
                                    rounded-3 text-primary px-3 py-2 text-center fw-bold">
                        {JSON.stringify(confirmation)}
                    </span>
                </div>

                {/* UndefinedErrorConfirmation */}
                <div className={columnClassName}>
                    <button className="btn btn-primary mb-3"
                        onClick={() => store.getUndefinedErrorConfirmationAsync()
                            .then(() => setConfirmation("Undefined"))}>
                        UndefinedErrorConfirmation
                    </button>
                    <span className="border border-primary-subtle bg-primary-subtle
                                    rounded-3 text-primary px-3 py-2 text-center fw-bold">
                        {JSON.stringify(confirmation)}
                    </span>
                </div>

                {/* FileTooLargeConfirmation */}
                <div className={columnClassName}>
                    <button className="btn btn-primary mb-3"
                        onClick={() => store.getFileTooLargeConfirmationAsync()
                            .then(() => setConfirmation("FileTooLarge"))}>
                        FileTooLargeConfirmation
                    </button>
                    <span className="border border-primary-subtle bg-primary-subtle
                                    rounded-3 text-primary px-3 py-2 text-center fw-bold">
                        {JSON.stringify(confirmation)}
                    </span>
                </div>
            </div>
        </MainContainer>
    );
};

export default HomeView;
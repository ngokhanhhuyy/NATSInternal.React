import React from "react";
import Form from "../form/FormComponent";
import type { IModelState } from "@/hooks/modelStateHook";
import MainBlock from "@layouts/MainBlockComponent";

// Props.
interface Props<TSubmissionResult> {
    children: React.ReactNode | React.ReactNode[];
    modelState: IModelState;
    formId?: string;
    isInitialLoading?: boolean;
    submittingAction: () => Promise<TSubmissionResult>;
    onSubmissionSucceeded: (submissionResult: TSubmissionResult) => Promise<void>;
    submissionSucceededModal?: boolean;
    deletingAction?: () => Promise<void>;
    onDeletionSucceeded?: () => Promise<void>;
    deletionSucceededModal?: boolean;
}

const UpsertViewContainer = <TSubmissionResult,>(props: Props<TSubmissionResult>) => {
    const { children, modelState, isInitialLoading, ...rest } = props;

    const computeClassName = () => {
        const classNames = ["container-fluid d-flex flex-column px-2 pb-1"];
        if (isInitialLoading) {
            classNames.push("d-none");
        }

        return classNames.join(" ");
    };

    return (
        <Form className={computeClassName()} modelState={modelState} {...rest}>
            {modelState.hasAnyError() && (
                <div className="row g-3">
                    <div className="col col-12">
                        <ErrorBlock modelState={modelState}/>
                    </div>
                </div>
            )}

            {children}
        </Form>
    );
};

interface ErrorBlockProps {
    modelState: IModelState;
}

const ErrorBlock = ({modelState}: ErrorBlockProps) => {
    if (!modelState.hasAnyError()) {
        return null;
    }

    const errors = modelState.getAllErrorMessages();

    return (
        <div className="col col-12">
            <MainBlock title="Dữ liệu không hợp lệ" color="danger" bodyPadding={[2, 1]}
                bodyClassName="row gx-3 gy-2" closeButton={false}>
                <div className="col col-12 d-flex flex-column">
                    {errors.length === 1 ? (
                        <span className="text-danger">{errors[0]}</span>
                    ) : errors.map((error, index) => (
                        <span className="text-danger" key={index}>
                            <span className="me-2">-</span> {error}
                        </span>
                    ))}
                </div>
            </MainBlock>
        </div>
    );
};

export default UpsertViewContainer;
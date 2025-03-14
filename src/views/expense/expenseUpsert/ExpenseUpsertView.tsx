import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useExpenseService } from "@/services/expenseService";
import { ExpenseCategory } from "@/services/dtos/enums";
import { ExpenseUpsertModel } from "@/models/expense/expenseUpsertModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useDirtyModelChecker } from "@/hooks/dirtyModelCheckerHook";
import { useRouteGenerator } from "@/router/routeGenerator";
import { AuthorizationError } from "@/errors";

// Layout components.
import UpsertViewContainer from "@layouts/UpsertViewContainerComponent";
import MainBlock from "@layouts/MainBlockComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import MoneyInput from "@/views/form/MoneyInputComponent";
import StatsDateTimeInput from "@/views/form/StatsDateTimeInputComponent";
import TextInput from "@/views/form/TextInputComponent";
import TextAreaInput from "@/views/form/TextAreaInputComponent";
import SelectInput, { type SelectInputOption } from "@/views/form/SelectInputComponent";
import SubmitButton from "@/views/form/SubmitButtonComponent";
import DeleteButton from "@/views/form/DeleteButtonComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Component.
const ExpenseUpsertView = ({ id }: { id?: number }) => {
    // Dependencies.
    const navigate = useNavigate();
    const initialData = useInitialDataStore(store => store.data);
    const service = useExpenseService();
    const routeGenerator = useRouteGenerator();

    // Model and states.
    const { modelState } = useUpsertViewStates();
    const initialModel = useAsyncModelInitializer({
        initializer: async () => {
            if (id == null) {
                const authorization = initialData.consultant.creatingAuthorization;
                if (!authorization) {
                    throw new AuthorizationError();
                }

                return new ExpenseUpsertModel(authorization.canSetStatsDateTime);
            } else {
                const responseDto = await service.getDetailAsync(id);
                return new ExpenseUpsertModel(responseDto);
            }
        },
        cacheKey: id == null ? "expenseCreate" : "expenseUpdate"
    });
    const [model, setModel] = useState(() => initialModel);
    const isModelDirty = useDirtyModelChecker(initialModel, model, ["updatedReason"]);

    // Computed.
    const blockTitle: string = id == null ? "Tạo chi phí mới" : "Chỉnh sửa chi phí";
    const categoryOptions: SelectInputOption[] = [
        {
            value: ExpenseCategory[ExpenseCategory.Equipment],
            displayName: "Trang thiết bị"
        },
        {
            value: ExpenseCategory[ExpenseCategory.Office],
            displayName: "Thuê mặt bằng"
        },
        {
            value: ExpenseCategory[ExpenseCategory.Staff],
            displayName: "Lương/thưởng"
        },
        {
            value: ExpenseCategory[ExpenseCategory.Utilities],
            displayName: "Tiện ích"
        },
    ];

    // Callbacks.
    const handleSubmissionAsync = async (): Promise<number> => {
        if (id == null) {
            return await service.createAsync(model.toRequestDto());
        }
        
        await service.updateAsync(model.id, model.toRequestDto());
        return model.id;
    };

    const handleSucceededSubmissionAsync = async (submittedId: number): Promise<void> => {
        await navigate(routeGenerator.getExpenseDetailRoutePath(submittedId));
    };

    const handleDeletionAsync = async () => {
        await service.deleteAsync(model.id);
    };

    const handleSucceededDeletionAsync = useCallback(async () => {
        await navigate(routeGenerator.getExpenseListRoutePath());
    }, []);

    return (
        <UpsertViewContainer
            modelState={modelState}
            submittingAction={handleSubmissionAsync}
            onSubmissionSucceeded={handleSucceededSubmissionAsync}
            deletingAction={handleDeletionAsync}
            onDeletionSucceeded={handleSucceededDeletionAsync}
            isModelDirty={isModelDirty}
        >
            <div className="row g-3">
                {/* Expense detail */}
                <div className="col col-12">
                    <MainBlock title={blockTitle} closeButton bodyPadding={[0, 2, 2, 2]}>
                        <div className="row g-3">
                            {/* Amount */}
                            <div className="col col-xxl-4 col-md-6 col-12">
                                <Label text="Số tiền thanh toán" required />
                                <MoneyInput
                                    name="amount"
                                    suffix=" đồng"
                                    value={model.amount}
                                    onValueChanged={amount => {
                                        setModel(model => model.from({ amount }));
                                    }}
                                />
                                <ValidationMessage name="amount" />
                            </div>
    
                            {/* Category */}
                            <div className="col col-xxl-4 col-md-6 col-12">
                                <Label text="Phân loại" required />
                                <SelectInput
                                    name="category"
                                    options={categoryOptions}
                                    value={ExpenseCategory[model.category]}
                                    onValueChanged={category => {
                                        setModel(model => model.from({
                                            category: ExpenseCategory[category]
                                        }));
                                    }}
                                />
                                <ValidationMessage name="category" />
                            </div>
    
                            {/* PayeeName */}
                            <div className="col col-xxl-4 col-lg-6 col-12">
                                <Label text="Tên người/tổ chức nhận" required />
                                <TextInput
                                    name="payeeName"
                                    placeholder="Công ty TNHH ABC"
                                    maxLength={100}
                                    value={model.payeeName}
                                    onValueChanged={payeeName => {
                                        setModel(model => model.from({ payeeName }));
                                    }}
                                />
                                <ValidationMessage name="payeeName" />
                            </div>
    
                            {/* StatsDateTime */}
                            <div className="col col-xxl-12 col-lg-6 col-12">
                                <Label text="Ngày thanh toán" />
                                <StatsDateTimeInput
                                    name="statsDateTime"
                                    disabled={!model.canSetStatsDateTime}
                                    value={model.statsDateTime}
                                    onValueChanged={statsDateTime => {
                                        setModel(model => model.from({ statsDateTime }));
                                    }}
                                />
                                <ValidationMessage name="statsDateTime" />
                            </div>
    
                            {/* Note */}
                            <div className="col col-12">
                                <Label text="Ghi chú" />
                                <TextAreaInput
                                    name="note"
                                    maxLength={255}
                                    placeholder="Ghi chú ..."
                                    value={model.note}
                                    onValueChanged={note => {
                                        setModel(model => model.from({ note }));
                                    }}
                                />
                                <ValidationMessage name="note" />
                            </div>
    
                            {/* UpdatedReason */}
                            {id != null && (
                                <div className="col col-12">
                                    <Label text="Lý do chỉnh sửa" required />
                                    <TextAreaInput 
                                        name="updatedReason"
                                        maxLength={255}
                                        placeholder="Lý do chỉnh sửa ..."
                                        value={model.updatedReason}
                                        onValueChanged={updatedReason => {
                                            setModel(model => model.from({ updatedReason }));
                                        }}
                                    />
                                    <ValidationMessage name="updatedReason" />
                                </div>
                            )}
                        </div>
                    </MainBlock>
                </div>
            </div>
            <div className="row g-3 justify-content-end">
                {/* Action buttons */}
                {(id != null && (model.canDelete ?? false)) && (
                    <div className="col col-auto">
                        <DeleteButton />
                    </div>
                )}
    
                <div className="col col-auto">
                    <SubmitButton />
                </div>
            </div>
        </UpsertViewContainer>
    );
};

export default ExpenseUpsertView;
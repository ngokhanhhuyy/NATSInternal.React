import React, { useState, useMemo, useEffect, useContext, useTransition } from "react";
import { CustomerListModel } from "@/models/customer/customerListModel";
import { CustomerBasicModel } from "@/models/customer/customerBasicModel";
import { useCustomerService } from "@/services/customerService";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form components.
import { FormContext } from "@/views/form/FormComponent";

// Child components.
import Picker from "./picker/PickerComponent";
import PickedCustomer from "./PickedCustomerComponent";

// Request dto for initial model.
export const requestDtoForInitialModel: RequestDtos.Customer.List = { resultsPerPage: 10 };

// Props.
interface CustomerPickerProps {
    value: CustomerBasicModel | null;
    onValueChanged(value: CustomerBasicModel | null): void;
    isInitialRendering: boolean;
    initialModel: CustomerListModel;
    disabled?: boolean;
}

// Component.
const CustomerPicker = (props: CustomerPickerProps) => {
    // Dependency.
    const service = useCustomerService();
    const formContext = useContext(FormContext);

    // Model.
    const modelState = formContext?.modelState;
    const [model, setModel] = useState(() => props.initialModel);
    const [isReloading, startReloadingTransition] = useTransition();

    // Effect.
    useEffect(() => {
        if (!props.isInitialRendering) {
            startReloadingTransition(async () => {
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            });
        }
    }, [model.page, model.sortingByAscending, model.sortingByField, model.searchByContent]);

    // Computed.
    const computeBlockTitle = (): string => {
        const errorMessage = modelState?.getError("customerId");
        if (!props.value && errorMessage) {
            return errorMessage;
        }

        return props.value ? "Khách hàng" : "Tìm chọn khách hàng";
    };
    
    const computeBlockColor = (): "primary" | "danger" => {
        if (!props.value && modelState?.hasError("customerId")) {
            return "danger";
        }

        return "primary";
    };

    const avatarStyle = useMemo<React.CSSProperties>(() => ({
        objectFit: "contain",
        objectPosition: "50% 50%",
        aspectRatio: 1,
        width: 50,
        height: 50
    }), []);

    // Header.
    const computeHeader = (): React.ReactNode => {
        if (props.value && !props.disabled) {
            return (
                <button type="button" className="btn btn-outline-danger btn-sm"
                        onClick={() => props.onValueChanged(null)}>
                    <i className="bi bi-x-lg"></i>
                    <span className="ms-2">Chọn khách hàng khác</span>
                </button>
            );
        }

        return null;
    };

    return (
        <MainBlock title={computeBlockTitle()}
            color={computeBlockColor()}
            header={computeHeader()}
            bodyPadding={[0, 2, 2, 2]}
        >
            {props.value ? (
                <PickedCustomer model={props.value} avatarStyle={avatarStyle} />
            ) : (
                <Picker
                    model={model}
                    onModelChanged={(changedData) => {
                        setModel(model => model.from(changedData));
                    }}
                    avatarStyle={avatarStyle}
                    isReloading={isReloading}
                    onSelected={customer => props.onValueChanged(customer)}
                />
            )}
        </MainBlock>
    );
};

export default CustomerPicker;
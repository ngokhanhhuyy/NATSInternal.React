import React, { useRef, useState, useMemo, useEffect } from "react";
import { ProductBasicModel } from "@/models/product/productBasicModel";
import { useModelState, type IModelState } from "@/hooks/modelStateHook";
import { Modal } from "bootstrap";

// Form components.
import Label from "@/views/form/LabelComponent";

// Type.
interface ChangedData {
    productAmountPerUnit: number | null;
    vatPercentagePerUnit: number | null;
    quantity: number | null;
}

// Props.
interface ExportProductItemInputModalProps<
        TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>> {
    resourceType: string;
    model: IExportProductUpsertItemModel<TUpsertItem> | null;
    onSaved: (changedData: Partial<TUpsertItem>) => void;
    onCancel: () => void;
}

interface ExportProductItemInputModalBodyProps {
    model: ChangedData;
    product: ProductBasicModel | null;
    modelState: IModelState;
    onChanged: (changedData: ChangedData) => void;
}

// Component.
const ExportProductItemInputModal = <
            TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>>
        (props: ExportProductItemInputModalProps<TUpsertItem>) => {
    // Model and states.
    const [changedData, setChangedData] = useState<ChangedData>(() => ({
        productAmountPerUnit: null,
        vatPercentagePerUnit: null,
        quantity: null
    }));
    const modalController = useRef<Modal | null>(null);
    const modelState = useModelState();

    // Effect.
    useEffect(() => {
        modalController.current = new Modal(`#${modalId}`);
        return () => {
            modalController.current?.dispose();
            modalController.current = null;
        };
    }, []);

    useEffect(() => {
        if (props.model) {
            modelState.resetErrors();
            setChangedData({
                productAmountPerUnit: props.model.productAmountPerUnit,
                vatPercentagePerUnit: props.model.vatPercentagePerUnit,
                quantity: props.model.quantity
            });
            modalController.current?.show();
        } else {
            modalController.current?.hide();
        }
    }, [props.model]);

    // Computed.
    const modalId = useMemo(() => `${props.resourceType}ItemInputModal`, []);
    const style = useMemo<React.CSSProperties>(() => ({
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    }), []);
    
    // Callbacks.
    const handleOkButtonClicked = () => {
        let errors: Record<string, string[]> = {};
        
        // Validate ProductAmountPerUnit.
        if (changedData.productAmountPerUnit == null) {
            errors = {
                ...errors,
                productAmountPerUnit: ["Số tiền mỗi sản phẩm không được bỏ trống."]
            };
        } else if (changedData.productAmountPerUnit <= 0) {
            errors = {
                ...errors,
                productAmountPerUnit: ["Số tiền mỗi sản phẩm phải lớn hơn 0."]
            };
        }

        // Validate VatPercentagePerUnit.
        if (changedData.vatPercentagePerUnit == null) {
            errors = {
                ...errors,
                vatPercentagePerUnit: ["Phần trăm VAT mỗi sản phẩm không được bỏ trống."]
            };
        } else if (changedData.vatPercentagePerUnit < 0) {
            errors = {
                ...errors,
                vatPercentagePerUnit: ["Phần trăm VAT mỗi sản phẩm phải lớn hơn hoặc bằng 0."]
            };
        }

        // Validate Quantity.
        if (changedData.quantity == null) {
            errors = {
                ...errors,
                quantity: ["Số lượng sản phẩm không được bỏ trống."]
            };
        } else if (changedData.quantity <= 0) {
            errors = {
                ...errors,
                quantity: ["Số lượng sản phẩm phải lớn hơn hoặc bằng 1."]
            };
        }

        if (Object.keys(errors).length) {
            modelState.setErrors(errors);
            return;
        }

        props.onSaved({
            ...changedData.productAmountPerUnit != null ? {
                productAmountPerUnit: changedData.productAmountPerUnit
            } : undefined,
            ...changedData.vatPercentagePerUnit != null ? {
                vatPercentagePerUnit: changedData.vatPercentagePerUnit
            } : undefined,
            ...changedData.quantity != null ? {
                quantity: changedData.quantity
            } : undefined
        } as Partial<TUpsertItem>);
    };

    return (
        <div
            className="modal fade p-3"
            id={modalId}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="staticBackdropLabel"
        >
            <div className="modal-dialog" style={style}>
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between">
                        <h5 className="modal-title">Thông tin sản phẩm</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    <div className="modal-body p-3 pt-2">
                        <Body
                            model={changedData}
                            product={props.model?.product ?? null}
                            modelState={modelState}
                            onChanged={setChangedData}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button"
                                className="btn btn-outline-danger me-2 px-3"
                                data-bs-dismiss="modal"
                                onClick={() => {
                                    modelState.clearErrors();
                                    props.onCancel();
                                }}>
                            <i className="bi bi-x-lg me-2" />
                            Huỷ
                        </button>
                        <button type="button"
                                className="btn btn-primary px-3"
                                onClick={handleOkButtonClicked}>
                            <i className="bi bi-floppy me-2" />
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Body = (props: ExportProductItemInputModalBodyProps) => {
    // Computed.
    const computeProductAmountPerUnitInputClassName = (): string => {
        const names = [
            "form-control",
            props.modelState.inputClassName("productAmountPerUnit")
        ];

        return names.filter(n => n).join(" ");
    };

    const computeProductAmountPerUnitMessageClassName = (): string => {
        return props.modelState.messageClass("productAmountPerUnit") ?? "d-none";
    };

    const computeVatPercentagePerUnitInputClassName = (): string => {
        const names = [
            "form-control",
            props.modelState.inputClassName("vatPercentagePerUnit")
        ];

        return names.filter(n => n).join(" ");
    };

    const computeVatPercentagePerUnitMessageClassName = (): string => {
        return props.modelState.messageClass("vatPercentagePerUnit") ?? "d-none";
    };

    const computeQuantityInputClassName = (): string => {
        const names = [
            "form-control",
            props.modelState.inputClassName("quantity")
        ];
        return names.filter(n => n).join(" ");
    };

    const computeQuantityMessageClassName = (): string => {
        return props.modelState.messageClass("quantity") ?? "d-none";
    };

    // Callbacks.
    const handleProductAmountPerUnitChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value;

        if (!value) {
            props.onChanged({ ...props.model, productAmountPerUnit: null });
            return;
        }

        const productAmountPerUnit = parseInt(value);
        if (Number.isNaN(productAmountPerUnit)) {
            event.preventDefault();
            return;
        }

        props.onChanged({ ...props.model, productAmountPerUnit });
    };

    const handleVatPercentagePerUnitChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value;

        if (!value) {
            props.onChanged({ ...props.model, vatPercentagePerUnit: null });
            return;
        }

        const vatPercentagePerUnit = parseInt(value);
        if (Number.isNaN(vatPercentagePerUnit)) {
            event.preventDefault();
            return;
        }

        props.onChanged({ ...props.model, vatPercentagePerUnit });
    };

    const handleQuantityChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value;

        if (!value) {
            props.onChanged({ ...props.model, quantity: null });
            return;
        }

        const quantity = parseInt(value);
        if (Number.isNaN(quantity)) {
            event.preventDefault();
            return;
        }

        props.onChanged({ ...props.model, quantity });
    };

    return (
        <div className="row g-3">
            {/* ProductAmountPerUnit */}
            <div className="col col-12">
                <Label text="Giá tiền mỗi đơn vị (vnđ)" required />
                <input
                    type="number"
                    className={computeProductAmountPerUnitInputClassName()}
                    min={0}
                    value={props.model.productAmountPerUnit?.toString() ?? ""}
                    onChange={handleProductAmountPerUnitChanged}
                />
                <span className={computeProductAmountPerUnitMessageClassName()}>
                    {props.modelState.getMessage("productAmountPerUnit")}
                </span>
            </div>

            <div className="col col-12">
                <Label text="Thuế VAT mỗi đơn vị (%)" required />
                <input
                    type="number"
                    className={computeVatPercentagePerUnitInputClassName()}
                    min={0}
                    max={1000}
                    value={props.model.vatPercentagePerUnit?.toString() ?? ""}
                    onChange={handleVatPercentagePerUnitChanged}
                />
                <span className={computeVatPercentagePerUnitMessageClassName()}>
                    {props.modelState.getMessage("vatPercentagePerUnit")}
                </span>
            </div>

            {/* Quantity */}
            <div className="col col-12">
                <Label text="Số lượng" required />
                <input
                    type="number"
                    name="items[i].quantity"
                    className={computeQuantityInputClassName()}
                    min={0}
                    value={props.model.quantity?.toString() ?? ""}
                    onChange={handleQuantityChanged}
                />
                <span className={computeQuantityMessageClassName()}>
                    {props.modelState.getMessage("quantity")}
                </span>
            </div>
        </div>
    );
};

export default ExportProductItemInputModal;
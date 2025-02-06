import React, { useMemo } from "react";
import { useAmountUtility } from "@/utilities/amountUtility";

// Form component.
import MoneyInput from "@/views/form/MoneyInputComponent";

// Props.
interface PickedItemListProps<TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>> {
    model: TUpsertItem[];
    onChanged: (index: number, changedData: Partial<TUpsertItem>) => void;
    onUnpicked: (index: number) => void;
}

interface PickedItemProps<TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>> {
    model: TUpsertItem;
    onChanged: (changedData: Partial<TUpsertItem>) => void;
    onUnpicked: () => void;
    index: number;
}

// Component.
const PickedItemList = <TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>>
    ({ model, onChanged, onUnpicked }: PickedItemListProps<TUpsertItem>) =>
{
    // Dependency.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const computeAmountTexts = () => {
        let itemsAmount = 0, vatAmount = 0;
        model.forEach(i => {
            itemsAmount += i.productAmountPerUnit * i.quantity;
            vatAmount += i.vatAmountPerUnit * i.quantity;
        });

        return {
            itemsAmount: amountUtility.getDisplayText(itemsAmount),
            vatAmount: amountUtility.getDisplayText(vatAmount),
            totalAmount: amountUtility.getDisplayText(itemsAmount + vatAmount)
        };
    };

    const computedAmountTexts = computeAmountTexts();

    return (
        <ul className="list-group list-group-flush">
            {model.length
                ? (
                    <>
                        {model.map((item, index) => (
                            <Item
                                model={item}
                                onChanged={(changedData: TUpsertItem) => {
                                    onChanged(index, changedData);
                                }}
                                onUnpicked={() => onUnpicked(index)}
                                index={index}
                                key={index}
                            />
                        ))}
                        <li className="list-group-item d-flex flex-column align-items-end
                                        small bg-transparent">
                            <span>{computedAmountTexts.itemsAmount}</span>
                            <span>VAT {computedAmountTexts.vatAmount}</span>
                            <div className="border-top mt-1 pt-1">
                                <span className="fw-bold me-3">Tổng cộng</span>
                                <span className="text-primary">
                                    {computedAmountTexts.totalAmount}
                                </span>
                            </div>
                        </li>
                    </>
                ) : (
                    <li className="list-group-item d-flex justify-content-center
                                    align-items-center p-3 bg-transparent">
                        <span className="opacity-50">
                            Chưa chọn sản phẩm nào
                        </span>
                    </li>
                )}

        </ul>
    );
};

const Item = <TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>>
        (props: PickedItemProps<TUpsertItem>) =>
{
    const { model, onChanged, onUnpicked, index } = props;

    // Computed.
    const thumbnailStyle = useMemo((): React.CSSProperties => ({
        width: "55px",
        height: "55px",
        objectFit: "contain",
        objectPosition: "50% 50%",
        aspectRatio: 1
    }), []);

    const inputStyle = useMemo((): React.CSSProperties => ({
        maxWidth: 60,
        flexShrink: 0,
    }), []);

    // Callback.
    const handleProductAmountPerUnitChanged = (productAmountPerUnit: number) => {
        onChanged({ productAmountPerUnit } as Partial<TUpsertItem>);
    };

    const handleVatPercentagePerUnitChanged = (vatPercentagePerUnit: number) => {
        onChanged({ vatPercentagePerUnit } as Partial<TUpsertItem>);
    };

    const handleQuantityChanged = (quantity: number) => {
        onChanged({ quantity } as Partial<TUpsertItem>);
    };

    return (
        <li className="list-group-item bg-transparent d-flex">
            {/* Thumbnail */}
            <img
                className="img-thumbnail me-2"
                style={thumbnailStyle}
                src={model.product?.thumbnailUrl}
            />

            {/* Detail */}
            <div className="detail w-100">
                {/* Upper row */}
                <span className="product-name fw-bold">
                    {model.product.name}
                </span>

                {/* Lower row */}
                <div className="d-flex justify-content-end w-100">
                    {/* Inputs */}
                    <div className="input-group input-group-sm flex-fill">
                        {/* Amount input */}
                        {/* <MoneyInput name={`items[${index}].amount`}
                            className="text-end amount-input"
                            suffix=" vnđ" min={0}
                            value={model.productAmountPerUnit}
                            onValueChanged={handleProductAmountPerUnitChanged}
                        /> */}

                        {/* VatFactor input */}
                        {/* <MoneyInput name={`items[${index}].vatFactor`}
                            className="text-end"
                            style={inputStyle}
                            suffix="%" min={0} max={100}
                            value={model.vatPercentagePerUnit}
                            onValueChanged={handleVatPercentagePerUnitChanged}
                        /> */}
                        
                        {/* Quantity input */}
                        {/* <MoneyInput name={`items[${index}].quantity`}
                            className="text-end"
                            style={inputStyle}
                            prefix="×" min={1} max={99}
                            value={model.quantity}
                            onValueChanged={handleQuantityChanged}
                        /> */}
                    </div>
                    {/* Edit button */}
                    <button className="btn btn-outline-primary btn-sm ms-2 flex-shrink-0"
                            type="button">
                        <i className="bi bi-pencil-square"></i>
                    </button>

                    {/* Unpick button */}
                    <button className="btn btn-outline-danger btn-sm ms-2 flex-shrink-0"
                            type="button"
                            onClick={onUnpicked}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        </li>
    );
};

export default PickedItemList;
import React, { useMemo } from "react";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Props.
interface ItemListProps<TItem extends IExportProductDetailItemModel> {
    model: TItem[];
}

interface ItemProps<TItem extends IExportProductDetailItemModel> {
    model: TItem;
    index: number;
}

// Component.
const ItemList = <TItem extends IExportProductDetailItemModel>
        ({ model }: ItemListProps<TItem>) =>
{
    // Dependencies.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const computeAmountText = (): string => {
        const productAmountBeforeVat = model.reduce((vatAmount, item) => {
            return vatAmount + item.productAmountPerUnit * item.quantity;
        }, 0);

        const vatAmount = model.reduce((vatAmount, item) => {
            return vatAmount + item.vatAmountPerUnit * item.quantity;
        }, 0);

        return amountUtility.getDisplayText(productAmountBeforeVat + vatAmount);
    };

    return (
        <MainBlock
            title="Sản phẩm"
            className="h-100"
            bodyPadding={0}
            bodyClassName="d-flex flex-column"
        >
            <ul className="list-group list-group-flush flex-fill">
                {model.map((item, index) => <Item model={item} index={index} key={index} />)}
            </ul>
            <div className="bg-secondary bg-opacity-10 border-top rounded-bottom-3
                            text-secondary-emphasis d-flex justify-content-end px-3 py-1">
                <strong className="me-2 opacity-75">Tổng cộng:</strong>
                <span className="text-primary">
                    {computeAmountText()}
                </span>
            </div>
        </MainBlock>
    );
};


const Item = <TItem extends IExportProductDetailItemModel>(props: ItemProps<TItem>) => {
    const { model, index } = props;

    // Dependencies.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const computeDetailText = (): string => {
        const amount = amountUtility.getDisplayText(model.productAmountPerUnit);
        const quantity = model.quantity.toString();
        const unit = model.product!.unit.toLowerCase();
        const vatAmountPerUnit = model.vatAmountPerUnit;
        const productAmountPerUnit = model.productAmountPerUnit;
        const vatPercentage = Math.round(vatAmountPerUnit / productAmountPerUnit * 100);
        return `${amount} × ${quantity} ${unit} (${vatPercentage}% VAT)`;
    };

    const thumbnailStyle = useMemo((): React.CSSProperties => ({
        objectFit: "contain",
        objectPosition: "50% 50%",
        width: 55,
        height: 55
    }), []);
    
    return (
        <li className="list-group-item bg-transparent d-flex
                        justify-content-start align-items-center">
            {/* Index */}
            <span className="bg-primary-subtle border border-primary-subtle rounded
                            px-2 py-1 text-primary small fw-bold">
                #{index + 1}
            </span>

            {/* Thumbnail */}
            <img
                className="img-thumbnail mx-3"
                style={thumbnailStyle}
                src={model.product!.thumbnailUrl}
            />

            {/* Detail */}
            <div className="detail d-flex flex-column small flex-fill
                            align-self-stretch py-1">
                {/* ProductName */}
                <span className="product-name fw-bold">
                    {model.product!.name}
                </span>

                {/* ItemDetail */}
                <span>{computeDetailText()}</span>
            </div>
        </li>
    );
};

export default ItemList;
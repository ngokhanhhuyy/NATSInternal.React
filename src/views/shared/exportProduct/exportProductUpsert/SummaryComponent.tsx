import React, { useMemo } from "react";
import { Gender } from "@/services/dtos/enums";
import { useAmountUtility } from "@/utilities/amountUtility";
import { useInitialDataStore } from "@/stores/initialDataStore";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";
import SubBlock from "@/views/layouts/SubBlockComponent";

// Props.
interface SummaryProps<
        TUpsert extends IExportProductUpsertModel<TUpsert, TUpsertItem, TUpsertPhoto>,
        TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>,
        TUpsertPhoto extends IUpsertPhotoModel<TUpsertPhoto>> {
    isForCreating: boolean;
    resourceType: string;
    model: TUpsert;
    render?: ((model: TUpsert, labelColumnClassName: string) => React.ReactNode) | undefined;
}

// Component.
const Summary = <
            TUpsert extends IExportProductUpsertModel<TUpsert, TUpsertItem, TUpsertPhoto>,
            TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>,
            TUpsertPhoto extends IUpsertPhotoModel<TUpsertPhoto>>
        (props: SummaryProps<TUpsert, TUpsertItem, TUpsertPhoto>) => {
    const { isForCreating, resourceType, model, render } = props;

    // Dependencies.
    const amountUtility = useMemo(useAmountUtility, []);
    const getDisplayName = useInitialDataStore(store => store.getDisplayName);
    
    // Computed.
    const labelColumnClassName = useMemo<string>(() => {
        return "col col-12";
    }, []);

    const displayName = getDisplayName(resourceType);
    const amountAfterVatClassName = model.amountAfterVat ? "" : "text-danger";
    
    const customerGenderClassName: string | undefined = (() => {
        if (model.customer != null) {
            if (model.customer!.gender === Gender.Male) {
                return "text-primary";
            }
            return "text-danger";
        }
    })();

    const customerGenderText: string = model.customer?.gender === Gender.Male ? "Nam" : "Nữ";

    const productThumbnailStyle = useMemo<React.CSSProperties>(() => ({
        width: 50,
        height: 50
    }), []);

    const computeItemDetailText = (item: TUpsertItem): string => {
        const amountPerUnit = amountUtility.getDisplayText(
            item.productAmountPerUnit + item.vatAmountPerUnit);
        const vatPercentagePerUnit = item.vatPercentagePerUnit;
        const amountAfterVATText = amountUtility.getDisplayText(
            (item.productAmountPerUnit + item.vatAmountPerUnit) * item.quantity);
        const quantityText = item.quantity.toString() + " " + item.product!.unit.toLowerCase();
        return `${amountPerUnit} (${vatPercentagePerUnit}% VAT) x ${quantityText}` +
            ` = ${amountAfterVATText}`;
    };

    return (
        <MainBlock
            title={`Tổng quan ${displayName.toLowerCase()}`}
            bodyPadding={0}
            bodyBorder={false}
        >
            {/* Information */}
            <SubBlock
                title={`Thông tin ${displayName.toLowerCase()}`}
                borderTop={false}
                bodyPadding={2}
            >
                {/* StatsDateTime */}
                <div className="row gx-3 gy-0">
                    <div className={labelColumnClassName}>
                        <span className="fw-bold">Ngày đặt hàng</span>
                    </div>
                    <div className="col">
                        {model.statsDateTime.displayText
                            ? (
                                <span className="text-primary">
                                    {model.statsDateTime.displayText}
                                </span>
                            ) : <span className="opacity-50">Chưa nhập ngày đặt hàng</span>
                        }
                    </div>
                </div>
                
                {/* Note */}
                <div className="row gx-3 gy-0 mt-3">
                    <div className={labelColumnClassName}>
                        <span className="fw-bold">Ghi chú</span>
                    </div>
                    <div className="col">
                        {model.note
                            ? <span className="text-primary">{model.note}</span>
                            : <span className="opacity-50">Không có ghi chú</span>
                        }
                    </div>
                </div>

                {render?.(model, labelColumnClassName)}

                {/* AmountAfterVat */}
                <div className="row gx-3 gy-0 mt-3">
                    <div className={labelColumnClassName}>
                        <span className="fw-bold">Tổng giá</span>
                    </div>
                    <div className={`col ${amountAfterVatClassName}`}>
                        <span>
                            {amountUtility.getDisplayText(model.amountAfterVat)}
                        </span>&nbsp;

                        <span className="opacity-50 small">
                            ({amountUtility.getDisplayText(model.amountBeforeVat)} +&nbsp;
                            {amountUtility.getDisplayText(model.vatAmount)} VAT)
                        </span>
                    </div>
                </div>

                {/* UpdateReason */}
                {!isForCreating && (
                    <div className="row gx-3 gy-0 mt-3">
                        <div className={labelColumnClassName}>
                            <span className="fw-bold">Lý do chỉnh sửa</span>
                        </div>
                        <div className="col">
                            {model.updatedReason
                                ? <span className="text-primary">{model.updatedReason}</span>
                                : <span className="text-danger">Chưa khai báo</span>
                            }
                        </div>
                    </div>
                )}
            </SubBlock>

            {/* Customer information */}
            <SubBlock title="Thông tin khách hàng" bodyPadding={2}>
                {model.customer != null ? (
                    <div className="w-100">
                        {/* FullName */}
                        <div className="row gx-3 gy-0">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Tên đầy đủ</span>
                            </div>
                            <div className="col text-primary">
                                <span>{model.customer?.fullName}</span>
                            </div>
                        </div>

                        {/* NickName */}
                        {model.customer.nickName && (
                            <div className="row gx-3 gy-0 mt-3">
                                <div className={labelColumnClassName}>
                                    <span className="fw-bold">Biệt danh</span>
                                </div>
                                <div className="col text-primary">
                                    <span>{model.customer?.nickName}</span>
                                </div>
                            </div>
                        )}

                        {/* Gender */}
                        <div className="row gx-3 gy-0 mt-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Giới tính</span>
                            </div>
                            <div className="col text-primary">
                                <span className={customerGenderClassName}>
                                    {customerGenderText}
                                </span>
                            </div>
                        </div>

                        {/* PhoneNumber */}
                        {model.customer.phoneNumber && (
                            <div className="row gx-3 gy-0 mt-3">
                                <div className={labelColumnClassName}>
                                    <span className="fw-bold">Số điện thoại</span>
                                </div>
                                <div className="col text-primary">
                                    <span>{model.customer.phoneNumber}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="d-flex justify-content-center align-items-center
                                    p-4 text-danger">
                        Chưa chọn khách hàng
                    </div>
                )}
            </SubBlock>

            {/* Product information */}
            <SubBlock title="Danh sách sản phẩm" bodyPadding={2} roundedBottom>
                {model.items.length > 0 ? model.items.map((item, index) => (
                    <div className="row gx-3 gy-0" key={index}>
                        {/* Index */}
                        <div className="col col-1 d-flex align-items-center"
                                style={{ maxWidth: 40 }}>
                            {index + 1}.
                        </div>

                        {/* Thumbnail */}
                        <div className="col col-auto py-2">
                            <a href={item.product.detailRoute}
                                    target="_blank" rel="noopener noreferrer">
                                <img
                                    className="img-thumbnail"
                                    style={productThumbnailStyle}
                                    src={item.product.thumbnailUrl}
                                />
                            </a>
                        </div>

                        <div className="col d-flex flex-column justify-content-center">
                            {/* ProductName */}
                            <a href={item.product.detailRoute}
                                    className="fw-bold d-block"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                {item.product!.name}
                            </a>

                            {/* ProductDetail */}
                            <span className="small d-block">
                                {computeItemDetailText(item)}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="d-flex justify-content-center align-items-center
                                    p-4 text-danger">
                        Chưa chọn sản phẩm
                    </div>
                )}
            </SubBlock>
        </MainBlock>
    );
};

export default Summary;
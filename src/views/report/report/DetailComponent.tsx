import React from "react";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";
import SubBlock from "@/views/layouts/SubBlockComponent";

// Props.
interface Props {
    model: IStatsDetailModel;
    isReloading: boolean;
}

// Component.
const Detail = (props: Props) => {
    // Dependencies.
    const amountUtility = useAmountUtility();

    // Computed.
    const className = props.isReloading ? "pe-none opacity-50" : undefined;

    const closedDateTimeClassName = props.model.officialClosedDateTime
        ? "text-primary"
        : "text-danger";
    const closedDateTimeText = props.model.officialClosedDateTime?.toString() ?? "Chưa khoá";

    return (
        <MainBlock title="Chi tiết" bodyPadding={0} bodyBorder={false} className={className}>
            {/* Revenue */}
            <SubBlock
                title="Doanh thu"
                borderTop={false}
                bodyClassName="row g-3"
                bodyPadding={[2, 0]}
            >
                {/* RetailGrossRevenue */}
                <div className="col col-xl-4 col-md-6 col-12 d-flex flex-column">
                    <span className="fw-bold">Doanh thu bán lẻ</span>
                    <span className="text-primary">
                        {amountUtility.getDisplayText(props.model.retailGrossRevenue)}
                    </span>
                </div>

                {/* RetailGrossRevenue */}
                <div className="col col-xl-4 col-md-6 col-12 d-flex flex-column">
                    <span className="fw-bold">Doanh thu liệu trình</span>
                    <span className="text-primary">
                        {amountUtility.getDisplayText(props.model.treatmentGrossRevenue)}
                    </span>
                </div>

                {/* ConsultantGrossRevenue */}
                <div className="col col-xl-4 col-md-6 col-12 d-flex flex-column">
                    <span className="fw-bold">Doanh thu dịch vụ tư vấn</span>
                    <span className="text-primary">
                        {amountUtility.getDisplayText(props.model.consultantGrossRevenue)}
                    </span>
                </div>
            </SubBlock>

            {/* VAT */}
            <SubBlock title="Thuế" bodyPadding={[2, 0]} bodyClassName="row g-3">
                {/* VatCollectedAmount */}
                <div className="col col-12 d-flex flex-column">
                    <span className="fw-bold">Thuế đã thu</span>
                    <span className="text-primary">
                        {amountUtility.getDisplayText(props.model.vatCollectedAmount)}
                    </span>
                </div>
            </SubBlock>

            {/* Debt */}
            <SubBlock title="Nợ" bodyPadding={[2, 0]} bodyClassName="row g-3">
                {/* DebtIncurredAmount */}
                <div className="col col-md-6 col-12 d-flex flex-column">
                    <span className="fw-bold">Nợ đã ghi</span>
                    <span className="text-primary">
                        {amountUtility.getDisplayText(props.model.debtIncurredAmount)}
                    </span>
                </div>

                {/* DebtPaidAmount */}
                <div className="col col-md-6 col-12 d-flex flex-column">
                    <span className="fw-bold">Nợ đã được thanh toán</span>
                    <span className="text-primary">
                        {amountUtility.getDisplayText(props.model.debtPaidAmount)}
                    </span>
                </div>
            </SubBlock>

            {/* Cost and expenses */}
            <SubBlock title="Chi phí" bodyPadding={[2, 0]} bodyClassName="row g-3">
                {/* Cost */}
                <div className="col col-md-6 col-12 d-flex flex-column">
                    <span className="fw-bold">Chi phí nhập hàng và vận chuyển</span>
                    <span className="text-primary">
                        {amountUtility.getDisplayText(props.model.cost)}
                    </span>
                </div>

                {/* Expenses */}
                <div className="col col-md-6 col-12 d-flex flex-column">
                    <span className="fw-bold">Chi phí vận hành</span>
                    <span className="text-primary">
                        {amountUtility.getDisplayText(props.model.expenses)}
                    </span>
                </div>
            </SubBlock>

            {/* Customer */}
            <SubBlock title="Khách hàng" bodyPadding={[2, 0]} bodyClassName="row g-3">
                {/* NewCustomers */}
                <div className="col col-12 d-flex flex-column">
                    <span className="fw-bold">Khách hàng mới</span>
                    <span className="text-primary">
                        {props.model.newCustomers} khách
                    </span>
                </div>
            </SubBlock>

            {/* Other */}
            <SubBlock title="Khác" bodyPadding={[2, 0]} bodyClassName="row g-3" roundedBottom>
                {/* ClosedDateTime */}
                <div className="col col-12 d-flex flex-column">
                    <span className="fw-bold">Đã khoá vào lúc</span>
                    <span className={closedDateTimeClassName}>
                        {closedDateTimeText}
                    </span>
                </div>
            </SubBlock>
        </MainBlock>
    );
};

export default Detail;
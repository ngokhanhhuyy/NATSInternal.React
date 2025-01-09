import React, { useMemo } from "react";
import { NotificationModel } from "@/models/notificationModels";
import { NotificationType } from "@/services/dtos/enums";
import * as styles from "./NotificationItemComponent.module.css";

interface Props {
    notification: NotificationModel;
    onClick: () => void;
}

const NotificationItem = ({ notification, onClick }: Props) => {
    const className = useMemo<string>(() => {
        if (!notification.isRead) {
            return "bg-success bg-opacity-10 text-success-emphasis";
        }
        return "";
    }, [notification]);

    const containerClassName = useMemo<string>(() => {
        if (notification.isRead) {
            return "bg-secondary-subtle text-secondary";
        }
        return "bg-success text-white";
    }, [notification]);

    const iconClassName = useMemo<string>(() => {
        const typeName = NotificationType[notification.type];
        if (typeName.includes("Creation")) {
            return "bi bi-plus-square";
        }

        if (typeName.includes("Modification")) {
            return "bi bi-pencil-square";
        }

        return "bi bi-x-square";
    }, [notification]);

    return (
        <li className={`list-group-item d-flex flex-row align-items-center px-3 py-2
                        ${className} ${styles["notificationItem"]}`}
                onClick={onClick}>
            {/* Icon */}
            <div className={`d-flex h-100 justify-content-center align-items-center
                            ${containerClassName} ${styles["notificationIconContainer"]}`}>
                <i className={iconClassName}></i>
            </div>
    
            {/* Text */}
            <div className={`d-flex flex-column flex-fill detail ms-3
                            ${styles["notificationText"]}`}>
                <Content notification={notification}/>
                <span className="opacity-50 small">
                    { notification.dateTime.deltaText }
                </span>
            </div>
        </li>
    );
};

const Content = ({ notification }: { notification: NotificationModel }) => {
    function computeContent(): JSX.Element {
        const createdUserName = <b>{notification.createdUser?.userName}</b>;
        const typeName: string = NotificationType[notification.type];
        const pairs: Record<string, () => JSX.Element> = {
            "UserCreation": () => <span>{createdUserName} đã tạo tài khoản mới</span>,
            "UserModification": () => <span>{createdUserName} đã chỉnh sửa một tài khoản</span>,
            "UserDeletion": () => <span>{createdUserName} đã xoá một tài khoản.</span>,
            "UserBirthday": () => <span>Nhân viên có sinh nhật vào hôm nay.</span>,
            "UserJoiningDateAnniversary": () => <span>Kỷ niệm ngày gia nhập của nhân viên.</span>,
        
            "CustomerCreation": () => <span>{createdUserName} đã tạo một khách hàng mới.</span>,
            "CustomerModification": () => <span>{createdUserName} đã chỉnh sửa một khách hàng.</span>,
            "CustomerDeletion": () => <span>{createdUserName} đã xoá một khách hàng.</span>,
            "CustomerBirthday": () => <span>Khách hàng có sinh nhật vào hôm nay.</span>,

            "BrandCreation": () => <span>{createdUserName} đã tạo một thương hiệu mới</span>,
            "BrandModification": () => <span>{createdUserName} đã chỉnh sửa một thương hiệu.</span>,
            "BrandDeletion": () => <span>{createdUserName} đã xoá một thương hiệu.</span>,
        
            "ProductCreation": () => <span>{createdUserName} đã tạo một sản phẩm mới</span>,
            "ProductModification": () => <span>{createdUserName} đã chỉnh sửa một sản phẩm.</span>,
            "ProductDeletion": () => <span>{createdUserName} đã xoá một sản phẩm.</span>,

            "ProductCategoryCreation": () => <span>{createdUserName} đã tạo một phân loại sản phẩm mới</span>,
            "ProductCategoryModification": () => <span>{createdUserName} đã chỉnh sửa một phân loại sản phẩm.</span>,
            "ProductCategoryDeletion": () => <span>{createdUserName} đã xoá một phân loại sản phẩm.</span>,
        
            "ExpenseCreation": () => <span>{createdUserName} đã tạo một chi phí mới</span>,
            "ExpenseModification": () => <span>{createdUserName} đã chỉnh sửa một chi phí.</span>,
            "ExpenseDeletion": () => <span>{createdUserName} đã xoá một chi phí.</span>,
        
            "SupplyCreation": () => <span>{createdUserName} đã tạo một đơn nhập hàng mới.</span>,
            "SupplyModification": () => <span>{createdUserName} đã chỉnh sửa một đơn nhập hàng.</span>,
            "SupplyDeletion": () => <span>{createdUserName} đã xoá một đơn nhập hàng.</span>,
        
            "ConsultantCreation": () => <span>{createdUserName} đã tạo một tư vấn mới.</span>,
            "ConsultantModification": () => <span>{createdUserName} đã chỉnh sửa một tư vấn.</span>,
            "ConsultantDeletion": () => <span>{createdUserName} đã xoá một tư vấn.</span>,
        
            "OrderCreation": () => <span>{createdUserName} đã tạo một đơn bán lẻ mới.</span>,
            "OrderModification": () => <span>{createdUserName} đã chỉnh sửa một đơn bán lẻ.</span>,
            "OrderDeletion": () => <span>{createdUserName} đã xoá một đơn bán lẻ.</span>,
        
            "TreatmentCreation": () => <span>{createdUserName} đã tạo một liệu trình mới.</span>,
            "TreatmentModification": () => <span>{createdUserName} đã chỉnh sửa một liệu trình.</span>,
            "TreatmentDeletion": () => <span>{createdUserName} đã xoá một liệu trình.</span>,
        
            "DebtIncurrenceCreation": () => <span>{createdUserName} đã ghi nhận một khoản nợ mới.</span>,
            "DebtIncurrenceModification": () => <span>{createdUserName} đã chỉnh sửa một khoản nợ.</span>,
            "DebtIncurrenceDeletion": () => <span>{createdUserName} đã xoá một khoản nợ.</span>,
        
            "DebtPaymentCreation": () => <span>{createdUserName} đã tạo một khoản thanh toán nợ mới.</span>,
            "DebtPaymentModification": () => <span>{createdUserName} đã chỉnh sửa một khoản thanh toán nợ.</span>,
            "DebtPaymentDeletion": () => <span>{createdUserName} đã xoá một khoản thanh toán nợ.</span>,

            "AnnouncementCreation": () => <span>{createdUserName} đã tạo một thông báo mới.</span>,
            "AnnouncementModification": () => <span>{createdUserName} đã chỉnh sửa một thông báo.</span>,
            "AnnouncementDeletion": () => <span>{createdUserName} đã xoá một thông báo.</span>
        };

        return pairs[typeName]();
    }

    return computeContent();
};

export default NotificationItem;
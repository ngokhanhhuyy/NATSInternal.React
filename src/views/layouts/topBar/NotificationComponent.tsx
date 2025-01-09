import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationService } from "@/services/notificationService";
import { NotificationListModel, NotificationModel } from "@/models/notificationModels";
import { useHubClient, type Resource } from "@/services/hubClient";
import { Dropdown } from "bootstrap";
import NotificationItem from "./NotificationItemComponent";
import * as styles from "./NotificationComponent.module.css";

const notificationService = useNotificationService();

const Notification = () => {
    // Model and state.
    const [model, setModel] = useState(() => new NotificationListModel());
    const onNotificationSingleReceived =
        (_: Resource, responseDto: ResponseDtos.Notification.Single) => {
            setModel(model?.add(responseDto));
        };

    // Dependencies.
    const navigate = useNavigate();
    const hubClient = useHubClient();
    hubClient.onNotificationSingleResponse(onNotificationSingleReceived);

    useEffect(() => {
        notificationService
            .getListAsync()
            .then(responseDto => setModel(m => m.fromResponseDto(responseDto)));
        return () => hubClient.offNotificationSingleResponse(onNotificationSingleReceived);
    }, []);

    useEffect(() => {
            if (model) {
                notificationService
                    .getListAsync(model.toRequestDto())
                    .then(responseDto => setModel(model.fromResponseDto(responseDto)));
            }
        },
        [ model?.page, model?.resultsPerPage ]);

    if (!model) {
        return null;
    }

    // Computed.
    const unreadNotificationCount = model?.items.filter(n => !n.isRead).length ?? 0;

    const previousPageButtonClass: string = (() => {
        if (model.page === 1) {
            return "btn-outline-secondary";
        }
        return "btn-outline-success";
    })();

    const previousPageButtonDisabled: boolean = (() => {
        return model.pageCount <= 1 || model.page === 1;
    })();

    const nextPageButtonClass: string = (() => {
        if (model.page === model.pageCount) {
            return "btn-outline-secondary";
        }
        return "btn-outline-success";
    })();

    const nextPageButtonDisabled: boolean = (() => {
        return model.pageCount <= 1 || model.page === model.pageCount;
    })();

    // Functions.
    async function markAllNotficationsAsReadAsync(): Promise<void> {
        if (model) {
            await notificationService.markAllAsReadAsync();
            for (const notification of model!.items) {
                if (!notification.isRead) {
                    notification.isRead = true;
                }
            }

            setModel(model.from({ items: [] }));
        }
    }

    async function onNotificationClicked(notification: NotificationModel): Promise<void> {
        await notificationService.markAsReadAsync(notification.id);
        notification.isRead = true;
        const dropdownController = new Dropdown("notification-button");
        dropdownController.hide();
        dropdownController.dispose();
        await navigate(notification.route);
    }

    return (
        <div className="dropdown" id="notification">
            <button className="btn btn-lg text-primary border-0 p-0 fs-4"
                    id="notification-button"
                    type="button" data-bs-auto-close="outside"
                    data-bs-toggle="dropdown" aria-expanded="false">
                <Icon unreadCount={unreadNotificationCount} />
            </button>
            <div className={`dropdown-menu dropdown-menu-end border border-primary-subtle
                            p-0 shadow bg-white ${styles["dropdownMenu"]}`}
                    id="notification-list">
                <ul className="list-group list-group-flush">
                    {/* Header */}
                    <li className="list-group-item p-2 ps-3 d-flex justify-content-between
                                    bg-transparent">
                        <span className="text-primary fw-bold">Thông báo</span>
                        <NotificationCount unreadCount={unreadNotificationCount}/>
                    </li>

                    {/* Items */}
                    <ItemList items={model.items} onItemClick={onNotificationClicked}/>

                    {/* Footer */}
                    <li className="list-group-item p-2 align-middle text-center
                                    d-flex justify-content-between">
                        {/* Pagination */}
                        <div className="d-flex">
                            {/* Previous page button */}
                            <button className={`btn btn-sm me-1 ${previousPageButtonClass}
                                                ${styles["button"]}`}
                                    disabled={previousPageButtonDisabled}
                                    onClick={() => {
                                        setModel(model.from({ page: model.page - 1 }));
                                    }}>
                                <i className="bi bi-chevron-left"></i>
                            </button>

                            {/* Next page button */}
                            <button className={`btn btn-sm ms-1 ${nextPageButtonClass}
                                                ${styles["button"]}`}
                                    disabled={nextPageButtonDisabled}
                                    onClick={() => {
                                        setModel(m => m.from({ page: m.page + 1 }));
                                    }}>
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>

                        {/* Mark all as read button */}
                        <button className={`btn btn-outline-primary btn-sm
                                            ${styles["button"]}`}
                                disabled={!unreadNotificationCount}
                                onClick={markAllNotficationsAsReadAsync}>
                            Đánh dấu đã đọc tất cả
                        </button>
                    </li>
                </ul>

                {/* Indicator */}
                <div className="indicator"></div>
            </div>
        </div>
    );
};

const Icon = ({ unreadCount }: { unreadCount: number }) => {
    if (unreadCount > 0) {
        return (
            <i className="bi bi-bell-fill">
                <small className="badge rounded-circle notification-dot bg-danger"></small>
            </i>
        );
    }

    return <i className="bi bi-bell"></i>;
};

const NotificationCount = (props: { unreadCount: number }) => {
    if (props.unreadCount > 0) {
        return (
            <span className="badge bg-success-subtle text-success d-flex align-items-center">
                Chưa đọc: { props.unreadCount }
            </span>
        );
    }

    return (
        <div className="badge bg-secondary-subtle text-secondary d-flex align-items-center">
            Đã đọc tất cả
        </div>
    );
};

interface ItemList {
    items: NotificationModel[];
    onItemClick(notification: NotificationModel): void;
}

const ItemList = ({ items, onItemClick }: ItemList) => {
    if (items.length) {
        const itemComponents: ReturnType<typeof NotificationItem>[] = [];
        for (let index = 0; index < items.length; index++) {
            const notification = items[index];
            itemComponents.push((
                <NotificationItem notification={notification} key={index}
                        onClick={() => onItemClick(notification)} />
            ));
        }

        return itemComponents;
    }

    return (
        <li className="list-group-item d-flex justify-content-center
                        align-items-center p-3 opacity-50">
            Không có thông báo mới
        </li>
    );
};

export default Notification;
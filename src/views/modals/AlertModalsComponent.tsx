import React, { useRef, useMemo, useEffect } from "react";
import { useAlertModalStore, type Mode, IAlertModalStore } from "@/stores/alertModalStore";
import { Modal as BootstrapModal } from "bootstrap";

const AlertModals = () => (
    <>
        <Modal mode="deletingConfirmation"
                resolveGetter={(store => store.deletingConfirmationResolve)} />
        <Modal mode="notFoundNotification"
                resolveGetter={(store => store.notFoundConfirmationResolve)} />
        <Modal mode="discardingConfirmation"
                resolveGetter={(store => store.discardingConfirmationResolve)} />
        <Modal mode="submissionErrorNotification"
                resolveGetter={(store => store.submissionErrorConfirmationResolve)} />
        <Modal mode="submissionSuccessNotification"
                resolveGetter={(store => store.submissionSuccessConfirmationResolve)} />
        <Modal mode="unauthorizationConfirmation"
                resolveGetter={(store => store.unauthorizationConfirmationResolve)} />
        <Modal mode="undefinedErrorNotification"
                resolveGetter={(store => store.undefinedErrorConfirmationResolve)} />
        <Modal mode="fileTooLargeConfirmation"
                resolveGetter={(store => store.fileTooLargeConfirmationResolve)} />
    </>
);

type Resolve<T> = (value: PromiseLike<T> | T) => void;

interface ModalProps<TResolve extends Resolve<TResult>, TResult> {
    mode: Mode;
    resolveGetter: (store: IAlertModalStore) => TResolve | null
}

const Modal = <TResolve extends Resolve<TResult>, TResult>(
        { mode, resolveGetter }: ModalProps<TResolve, TResult>) => {
    // Dependencies.
    const store = useAlertModalStore();
    const modal = useRef<BootstrapModal | null>(null);

    // Memo.
    const elements = useMemo<ElementsContent>(() => getElementContent(mode), []);
    const resolve = resolveGetter(store);
    const isVisible = useMemo<boolean>(() => resolve != null, [resolve]);

    // Effect.
    useEffect(() => {
        modal.current = new BootstrapModal("#" + mode);
        return () => {
            modal.current?.dispose();
            modal.current = null;
        };
    }, []);

    useEffect(() => {
        if (isVisible) {
            modal.current?.show();
        } else {
            modal.current?.hide();
        }
    }, [isVisible]);

    // Callback.
    const onOkButtonClicked = () => {
        (resolve as Resolve<boolean>)(true);
        store.reset();
    };

    const onCancelButtonClicked = () => {
        (resolve as Resolve<boolean>)(false);
        store.reset();
    };

    // Template.
    return (
        <div
            className="modal fade text-center px-2"
            id={mode}
            tabIndex={-1}
            data-bs-backdrop="static"
            aria-labelledby="modal-label"
            aria-hidden={!isVisible}
        >
            <div className="modal-dialog modal-dialog-centered mx-auto">
                <div className="modal-content">

                    {/* Header */}
                    <div className="modal-header d-flex flex-row justify-content-between">
                        <h1 className="modal-title fs-5" id="modal-label">
                            {elements.title}
                        </h1>

                        {elements.buttons.cancelButton && (
                            <button type="button" className="btn-close"
                                    data-bs-dismiss="modal" aria-label="Close"
                                    onClick={onCancelButtonClicked}>
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        <div className="row px-4">
                            <div className="col col-auto pe-3">
                                <i className={elements.iconClassName}></i>
                            </div>
                            <div className="col d-flex flex-column justify-content-center
                                        align-items-start">
                                {elements.content.map(text => (
                                    <span className="text-start" key={text}>
                                        { text }
                                    </span>
                                ))}

                                {/* {errorElements} */}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        {/* Cancel button */}
                        {elements.buttons.cancelButton && (
                            <button className={elements.buttons.cancelButton.className}
                                    onClick={onCancelButtonClicked}>
                                {elements.buttons.cancelButton.text}
                            </button>
                        )}

                        {/* Ok button */}
                        {elements.buttons.okButton && (
                        <button className={`ms-2 ${elements.buttons.okButton.className}`}
                                onClick={onOkButtonClicked}>
                            {elements.buttons.okButton.text}
                        </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ButtonMetaData {
    text: string;
    className?: string;
}

interface ElementsContent {
    title: string;
    content: string[];
    iconClassName: string;
    buttons: {
        cancelButton?: ButtonMetaData;
        okButton: ButtonMetaData;
    };
}

function getElementContent(mode: Mode): ElementsContent {
    switch (mode) {
        case "discardingConfirmation":
            return {
                title: "Xác nhận huỷ bỏ",
                content: [
                    "Mọi thay đổi chưa được lưu sẽ mất.",
                    "Bạn có chắc chắn muốn huỷ bỏ?"
                ],
                iconClassName: "bi bi-exclamation-triangle-fill fs-1 text-warning",
                buttons: {
                    cancelButton: { text: "Huỷ bỏ", className: "btn btn-primary" },
                    okButton: { text: "Chắc chắn", className: "btn btn-outline-danger" }
                }
            };
        case "deletingConfirmation":
            return {
                title: "Xác nhận xoá bỏ",
                content: [
                    "Dữ liệu sau khi xoá có thể sẽ không thể khôi phục lại được.",
                    "Bạn có chắc chắn muốn xoá bỏ?"
                ],
                iconClassName: "bi bi-exclamation-triangle-fill fs-1 text-warning",
                buttons: {
                    cancelButton: { text: "Huỷ bỏ", className: "btn btn-primary" },
                    okButton: { text: "Chắc chắn", className: "btn btn-outline-danger" }
                }
            };
        case "notFoundNotification":
            return {
                title: "Không tìm thấy dữ liệu",
                content: [
                    "Dữ liệu bạn yêu cầu đã bị xoá hoặc không tồn tại.",
                    "Vui lòng kiểm tra lại.",
                ],
                iconClassName: "bi bi-x-octagon-fill fs-1 text-danger",
                buttons: {
                    okButton: { text: "Xác nhận", className: "btn btn-primary" }
                }
            };
        case "connectionErrorNotification":
            return {
                title: "Không thể kết nối đến máy chủ",
                content: [
                    "Kết nối đến máy chủ bị gián đoạn.",
                    "Vui lòng kiểm tra lại đường truyền internet.",
                    "Nếu lỗi này không xuất phát từ thiết bị của bạn, vui lòng báo với nhà phát triển."
                ],
                iconClassName: "bi bi-wifi-off",
                buttons: {
                    okButton: { text: "Xác nhận", className: "btn btn-primary" }
                }
            };
        case "submissionErrorNotification":
            return{
                title: "Dữ liệu không hợp lệ",
                content: [
                    "Dữ liệu đã nhập không hợp lệ.",
                    "Vui lòng kiểm tra lại."
                ],
                iconClassName: "bi bi-x-octagon-fill fs-1 text-danger",
                buttons: {
                    okButton: { text: "Xác nhận", className: "btn btn-primary" }
                }
            };
        case "submissionSuccessNotification":
            return {
                title: "Lưu thành công",
                content: [
                    "Dữ liệu đã được lưu thành công."
                ],
                iconClassName: "bi bi-exclamation-circle-fill fs-1 text-success",
                buttons: {
                    okButton: { text: "Xác nhận", className: "btn btn-primary" }
                }
            };
        case "unauthorizationConfirmation":
            return {
                title: "Không đủ quyền truy cập",
                content: [
                    "Bạn không đủ quyền hạn để truy cập trang này."
                ],
                iconClassName: "bi bi-x-octagon-fill fs-1 text-danger",
                buttons: {
                    okButton: { text: "Quay về trang chủ", className: "btn btn-primary" }
                }
            };
        case "fileTooLargeConfirmation":
            return {
                title: "File tải lên quá lớn",
                content: [
                    "File bạn đã tải lên quá lớn và vượt quá dung lượng cho phép.",
                    "Hãy đảm bảo rằng file tải lên có dung lượng không vượt quá 2Mb."
                ],
                iconClassName: "bi bi-x-octagon-fill fs-1 text-danger",
                buttons: {
                    okButton: { text: "Xác nhận", className: "btn btn-primary" }
                }
            };
        default:
            return {
                title: "Lỗi không xác định",
                content: [
                    "Đã xảy ra lỗi không xác định.",
                    "Vui lòng báo với nhà phát triển để khắc phục trong thời gian sớm nhất."
                ],
                iconClassName: "bi bi-x-octagon-fill fs-1 text-danger",
                buttons: {
                    okButton: { text: "Xác nhận", className: "btn btn-primary" }
                }
            };
    }
}

export default AlertModals;
import React, { useMemo } from "react";
import { CustomerDetailModel } from "@/models/customer/customerDetailModel";
import { Gender } from "@/services/dtos/enums";
import { usePhotoUtility } from "@/utilities/photoUtility";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form component.
import Label from "@/views/form/LabelComponent";

// Props.
interface CustomerDetailProps {
    model: CustomerDetailModel;
}

// Component.
const CustomerDetail = ({ model }: CustomerDetailProps) => {
    return (
        <MainBlock title="HỒ SƠ KHÁCH HÀNG" closeButton bodyPadding={[4, 3]}
                bodyClassName="placeholder-glow">
            <Body model={model} />
        </MainBlock>
    );
};

const Body = ({ model }: { model: CustomerDetailModel }) => {
    // Dependency.
    const photoUtility = useMemo(usePhotoUtility, []);

    // Computed.
    const genderClassName = (() => {
        if (!model) {
            return "";
        }

        return model.gender === Gender.Male ? "text-primary" : "text-danger";
    })();

    const avatarUrl = model?.avatarUrl ?? photoUtility.getDefaultPlainPhotoUrl();

    return (
        <>
            {/* Avatar and names */}
            <div className="row g-0">
                <div className="col col-12 avatar-and-names
                                d-flex flex-row align-items-center">
                    {/* Avatar */}    
                    <img src={avatarUrl}
                        className="rounded-circle me-3"
                        style={{ width: "70px", height: "70px" }}
                    />

                    {/* Names */}
                    <div className="names d-flex flex-column flex-fill justify-content-start">
                        <span className="fs-5 fw-bold">{model.fullName}</span>
                        <span className="opacity-50">{model.nickName}</span>
                    </div>
                </div>
            </div>

            {/* Personal information */}
            {/* Gender */}
            <div className="row g-0 mt-3">
                <div className="col col-12">
                    <label className="form-label">Giới tính</label>
                </div>

                <div className="col">
                    <span className={genderClassName}>
                        {model.gender === Gender.Male ? "Nam" : "Nữ"}
                    </span>
                </div>
            </div>

            {/* Birthday */}
            {model.birthday && (
                <div className="row g-0 mt-3">
                    <div className="col col-12">
                        <Label text="Ngày sinh" />
                    </div>

                    <div className="col">
                        <span className="text-primary">
                            {model.birthday.date}
                        </span>
                    </div>
                </div>
            )}

            {/* PhoneNumber */}
            {model.phoneNumber && (
                <div className="row g-0 mt-3">
                    <div className="col col-12">
                        <Label text="Số điện thoại" />
                    </div>

                    <div className="col text-primary">
                        <a href={"tel:" + model.phoneNumber} target="_blank"
                                rel="noopener noreferrer">
                            {model.phoneNumber}
                        </a>
                    </div>
                </div>
            )}

            {/* ZaloNumber */}
            {model.zaloNumber && (
                <div className="row g-0 mt-3">
                    <div className="col col-12">
                        <Label text="Số Zalo" />
                    </div>

                    <div className="col text-primary">
                        <a href={"https://zalo.me/" + model.zaloNumber} target="_blank"
                                rel="noopener noreferrer">
                            {model.zaloNumber}
                        </a>
                    </div>
                </div>
            )}

            {/* FacebookUrl */}
            {model.facebookUrl && (
                <div className="row g-0 mt-3">
                    <div className="col col-12">
                        <Label text="Facebook" />
                    </div>

                    <div className="col text-primary">
                        <a href={model.facebookUrl} target="_blank"
                                rel="noopener noreferrer">
                            {model.facebookUrl}
                        </a>
                    </div>
                </div>
            )}

            {/* Email */}
            {model.email && (
                <div className="row g-0 mt-3">
                    <div className="col col-12">
                        <Label text="Email" />
                    </div>

                    <div className="col text-primary">
                        <a href={"mailto:" + model.email}
                                target="_blank" rel="noopener noreferrer">
                            {model.email}
                        </a>
                    </div>
                </div>
            )}

            {/* Address */}
            {model.address && (
                <div className="row g-0 mt-3">
                    <div className="col col-12">
                        <Label text="Địa chỉ" />
                    </div>

                    <div className="col col-lg-10 col-sm-9 col-12 text-primary">
                        {model.address}
                    </div>
                </div>
            )}

            {/* CreatedDateTime */}
            <div className="row g-0 mt-3">
                <div className="col col-12">
                    <Label text="Tạo lúc" />
                </div>

                <div className="col col-lg-10 col-sm-9 col-12 text-primary">
                    {model.createdDateTime.dateTime}
                </div>
            </div>

            {/* UpdatedDateTime */}
            {model.updatedDateTime && (
                <div className="row g-0 mt-3">
                    <div className="col col-12">
                        <Label text="Chỉnh sửa lúc" />
                    </div>

                    <div className="col col-lg-10 col-sm-9 col-12 text-primary">
                        {model.updatedDateTime.dateTime}
                    </div>
                </div>
            )}

            {/* Introducer */}
            {model?.introducer && (
                <div className="row g-0 mt-3">
                    <div className="col col-12 d-flex
                                flex-row align-items-center">
                        <Label text="Người giới thiệu" />
                    </div>

                    <div className="col col-lg-10 col-sm-9 col-12 d-flex flex-row
                                    align-items-center">
                        <img className="img-thumbnail introducer-avatar rounded-circle me-2"
                                src={model.introducer.avatarUrl}
                                style={{ width: "40px", height: "40px" }} />
                        <span className="text-primary underline fw-bold">
                            {model.introducer.fullName}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default CustomerDetail;
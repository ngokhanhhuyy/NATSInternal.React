import React from "react";
import { Gender } from "@/services/dtos/enums";
import type { UserPersonalInformationDetailModel }
    from "@/models/user/userPersonalInformationDetailModel";

// Layout components.
import MainBlock from "@layouts/MainBlockComponent";

// Form component.
import Label from "@/views/form/LabelComponent";

// Placeholder.
import PlaceholderText from "@/views/shared/placeholder/PlaceholderTextComponent";

// Props.
interface UserInformationProps {
    model: UserPersonalInformationDetailModel | null;
}

// Component.
const PersonalInformation = ({ model }: UserInformationProps) => (
    <MainBlock title="Thông tin cá nhân" bodyPadding="2">
        {/* Gender */}
        <div className="row gx-3">
            <div className="col col-12">
                <Label text="Giới tính" />
            </div>
            <div className="col field text-primary">
                <PlaceholderText isPlaceholder={!model} width={30}>
                    {model?.gender === Gender.Male ? "Nam" : "Nữ"}
                </PlaceholderText>
            </div>
        </div>

        {/* Birthday */}
        {(!model || model.birthday) && (
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <Label text="Ngày sinh"/>
                </div>
                <div className="col field text-primary">
                    <PlaceholderText width={170}>
                        {model?.birthday?.toString()}
                    </PlaceholderText>
                </div>
            </div>
        )}

        {/* PhoneNumber */}
        {!model || model.phoneNumber && (
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <Label text="Số điện thoại"/>
                </div>
                <div className="col field text-primary">
                    <PlaceholderText width={90}>
                        {model?.phoneNumber}
                    </PlaceholderText>
                </div>
            </div>
        )}

        {/* Email */}
        {(!model || model.email) && (
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <Label text="Email"/>
                </div>
                <div className="col field text-primary">
                    <PlaceholderText width={120}>
                        {model?.email}
                    </PlaceholderText>
                </div>
            </div>
        )}
    </MainBlock>
);

export default PersonalInformation;
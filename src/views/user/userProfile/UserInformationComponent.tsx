import React, { useMemo } from "react";
import type { UserDetailAuthorizationModel } from "@models/user/userDetailAuthorizationModel";
import type { UserUserInformationDetailModel }
    from "@models/user/userUserInformationDetailModel";
import { useRoleUtility } from "@/utilities/roleUtility";

// Layout component.
import MainBlock from "@layouts/MainBlockComponent";

// Form component.
import Label from "@form/LabelComponent";

// Placeholder component.
import PlaceholderText from "@/views/shared/placeholder/PlaceholderTextComponent";

interface Props {
    userInformation: UserUserInformationDetailModel | null | undefined;
    authorization: UserDetailAuthorizationModel | undefined;
}

const UserInformation = ({ userInformation, authorization }: Props) => {
    // Dependency.
    const roleUtility = useMemo(useRoleUtility, []);

    // Computed.
    const computeRoleBadgeClassName = () => {
        const color = roleUtility.getRoleBootstrapColor(userInformation?.role.name ?? "Staff");
        return `bg-${color}-subtle border-${color}-subtle text-${color}`;
    };

    const computeNote = () => {
        if (userInformation?.note != null && !!authorization?.canGetNote) {
            return userInformation.note;
        }
    };

    return (
        <MainBlock title="Thông tin nhân viên" bodyPadding="2">
            <div className="row gx-3">
                {/* Role */}
                <div className="col col-12">
                    <Label text="Vị trí" />
                </div>
                <div className="col field text-primary">
                    <span className={`badge border ${computeRoleBadgeClassName()}`}>
                        <PlaceholderText isPlaceholder={!userInformation} width={80}>
                            { userInformation?.role.displayName }
                        </PlaceholderText>
                    </span>
                </div>
            </div>

            {/* JoiningDate */}
            {(!userInformation || userInformation.joiningDate) && (
                <div className="row gx-3 mt-3">
                    <div className="col col-12">
                        <Label text="Gia nhập"/>
                    </div>
                    <div className="col field text-primary">
                        <PlaceholderText isPlaceholder={!userInformation} width={120}>
                            {userInformation?.joiningDate?.toString()}
                        </PlaceholderText>
                    </div>
                </div>
            )}

            {/* CreatedDateTime */}
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <Label text="Tạo lúc"/>
                </div>
                <div className="col field text-primary">
                    <PlaceholderText isPlaceholder={!userInformation} width={150}>
                        {userInformation?.createdDateTime.dateTime}
                    </PlaceholderText>
                </div>
            </div>

            {/* UpdatedDateTime */}
            {(!userInformation || userInformation.updatedDateTime) && (
                <div className="row gx-3 mt-3">
                    <div className="col col-12">
                        <Label text="Chỉnh sửa lúc"/>
                    </div>
                    <div className="col field text-primary">
                        <PlaceholderText isPlaceholder={!userInformation} width={150}>
                            {userInformation?.updatedDateTime?.dateTime}
                        </PlaceholderText>
                    </div>
                </div>
            )}

            {/* Note */}
            {(!userInformation || userInformation.note) && (
                <div className="row gx-3 mt-3">
                    <div className="col col-12">
                        <Label text="Note"/>
                    </div>
                    <div className="col field text-primary">
                        <PlaceholderText isPlaceholder={!userInformation} width={150}>
                            {computeNote()}
                        </PlaceholderText>
                    </div>
                </div>
            )}
        </MainBlock>
    );
};

export default UserInformation;
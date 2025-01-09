import React from "react";
import { type UserCreateModel } from "@/models/user/userCreateModel";

// Layout components.
import SubBlock from "@/views/layouts/SubBlockComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import TextInput from "@/views/form/TextInputComponent";
import PasswordInput from "@/views/form/PasswordInputComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Props.
interface AccountInformationProps {
    model: UserCreateModel,
    setModel: React.Dispatch<React.SetStateAction<UserCreateModel>>;
}

// Component.
const AccountInformation = ({ model, setModel }: AccountInformationProps) => {
    return (
        <SubBlock title="Thông tin tài khoản" bodyClassName="row g-3" borderTop={false}>
            {/* UserName */}
            <div className="col col-12">
                <div className="form-group">
                    <Label text="Tên đăng nhập" required />
                    <div className="input-group">
                        <span className="input-group-text border-end-0">@</span>
                        <TextInput name="userName" regex="a-zA-Z0-9_" maxLength={20}
                                placeholder="nguyenvana"
                                value={model.userName}
                                onValueChanged={userName => {
                                    setModel(model => model.from({ userName }));
                                }} />
                    </div>
                    <ValidationMessage name="userName" />
                </div>
            </div>

            {/* Password */}
            <div className="col col-sm-6 col-12">
                <div className="form-group">
                    <Label text="Mật khẩu" required />
                    <PasswordInput name="password" placeholder="Mật khẩu" maxLength={20}
                            value={model.password}
                            onValueChanged={password => {
                                setModel(model => model.from({ password }));
                            }} />
                    <ValidationMessage name="password" />
                </div>
            </div>

            {/* Confirmation password */}
            <div className="col col-sm-6 col-12">
                <div className="form-group">
                    <Label text="Xác nhận mật khẩu" required />
                    <PasswordInput name="confirmationPassword" placeholder="Xác nhận mật khẩu"
                            maxLength={20}
                            value={model.confirmationPassword}
                            onValueChanged={confirmationPassword => {
                                setModel(model => model.from({ confirmationPassword }));
                            }} />
                </div>
                <ValidationMessage name="confirmationPassword" />
            </div>
        </SubBlock>
    );
};

export default AccountInformation;
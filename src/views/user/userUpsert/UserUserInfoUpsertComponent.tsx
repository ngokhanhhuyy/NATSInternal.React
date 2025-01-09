import React from "react";
import type { UserDetailAuthorizationModel } from "@/models/user/userDetailAuthorizationModel";
import type { UserUserInformationUpsertModel }
    from "@/models/user/userUserInformationUpsertModel";

// Layout components.
import SubBlock from "@/views/layouts/SubBlockComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import TextAreaInput from "@/views/form/TextAreaInputComponent";
import SelectInput from "@/views/form/SelectInputComponent";
import DateInput from "@/views/form/DateInputComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Interface.
interface Props {
    model: UserUserInformationUpsertModel;
    setModel: React.Dispatch<React.SetStateAction<UserUserInformationUpsertModel>>;
    authorization?: UserDetailAuthorizationModel;
}

// Component.
const UserUserInformationUpsert = (props: Props) => {
    const { model, setModel, authorization } = props;

    // Memo.
    const options = model.roleOptions.map(option => ({
        value: option.name,
        displayName: option.displayName
    }));

    return (
        <SubBlock title="Thông tin nhân viên" bodyClassName="row g-3" roundedBottom>
            {/* JoiningDate */}
            <div className="col col-sm-6 col-12">
                <div className="form-group">
                    <Label text="Ngày gia nhập" />
                    <DateInput name="userInformation.joiningDate"
                            value={model.joiningDate}
                            onValueChanged={joiningDate => {
                                setModel(model => model.from({ joiningDate }));
                            }} />
                    <ValidationMessage name="userInformation.joiningDate" />
                </div>
            </div>
            
            {/* Role */}
            {(authorization?.canAssignRole ?? true) && (
                <div className="col col-sm-6 col-12">
                    <div className="form-group">
                        <Label text="Vị trí" required/>
                        <SelectInput name="userInformation.role" options={options}
                                value={model.roleName}
                                onValueChanged={roleName => {
                                    setModel(m => m.from({ roleName: roleName }));
                                }}>
                        </SelectInput>
                        <ValidationMessage name="userInformation.role" />
                    </div>
                </div>
            )}
            
            {/* Note */}
            <div className="col col-12">
                <div className="form-group">
                    <div className="form-group">
                        <Label text="Ghi chú" />
                        <TextAreaInput name="userInformation.joiningDate"
                                maxLength={255} placeholder="Ghi chú ..."
                                value={model.note}
                                onValueChanged={note => {
                                    setModel(model => model.from({ note }));
                                }} />
                        <ValidationMessage name="userInformation.joiningDate" />
                    </div>
                </div>
            </div>
        </SubBlock>
    );
};

export default UserUserInformationUpsert;
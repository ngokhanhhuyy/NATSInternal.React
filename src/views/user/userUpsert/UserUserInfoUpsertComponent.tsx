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
    onModelChanged: (changedData: Partial<UserUserInformationUpsertModel>) => any;
    authorization?: UserDetailAuthorizationModel;
}

// Component.
const UserUserInformationUpsert = (props: Props) => {
    // Computed.
    const options = props.model.roleOptions.map(option => ({
        value: option.name,
        displayName: option.displayName
    }));

    return (
        <SubBlock title="Thông tin nhân viên" bodyClassName="row g-3" roundedBottom>
            {/* JoiningDate */}
            <div className="col col-sm-6 col-12">
                <div className="form-group">
                    <Label text="Ngày gia nhập" />
                    <DateInput
                        name="userInformation.joiningDate"
                        value={props.model.joiningDate}
                        onValueChanged={joiningDate => {
                            props.onModelChanged({ joiningDate });
                        }}
                    />
                    <ValidationMessage name="userInformation.joiningDate" />
                </div>
            </div>
            
            {/* Role */}
            {(props.authorization?.canAssignRole ?? true) && (
                <div className="col col-sm-6 col-12">
                    <div className="form-group">
                        <Label text="Vị trí" required/>
                        <SelectInput
                            name="userInformation.role"
                            options={options}
                            value={props.model.roleName}
                            onValueChanged={roleName => {
                                props.onModelChanged({ roleName });
                            }}
                        />
                        <ValidationMessage name="userInformation.role" />
                    </div>
                </div>
            )}
            
            {/* Note */}
            <div className="col col-12">
                <div className="form-group">
                    <div className="form-group">
                        <Label text="Ghi chú" />
                        <TextAreaInput
                            name="userInformation.joiningDate"
                            maxLength={255}
                            placeholder="Ghi chú ..."
                            value={props.model.note}
                            onValueChanged={note => {
                                props.onModelChanged({ note });
                            }}
                        />
                        <ValidationMessage name="userInformation.joiningDate" />
                    </div>
                </div>
            </div>
        </SubBlock>
    );
};

export default UserUserInformationUpsert;
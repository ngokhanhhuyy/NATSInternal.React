import React, { useMemo } from "react";
import { type UserListModel } from "@models/user/userListModel";
import { RoleMinimalModel } from "@models/roleModels";
import { useRoleUtility } from "@/utilities/roleUtility";

// Layout components.
import MainBlock from "@layouts/MainBlockComponent";
import CreatingLink from "@/views/layouts/CreateLinkComponent";

// Form components.
import { FormContext } from "@/views/form/FormComponent";
import Label from "@/views/form/LabelComponent";
import BooleanSelectInput from "@/views/form/BooleanSelectInputComponent";
import SortingByFieldSelectInput from "@/views/form/SortingByFieldSelectInputComponent";
import TextInput from "@/views/form/TextInputComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Props.
interface Props {
    model: UserListModel;
    onChanged: (changedData: Partial<UserListModel>) => any;
    isReloading: boolean;
}

// Dependencies.
const roleUtility = useRoleUtility();

const Filters = (props: Props) => {
    // Computed.
    const blockTitle = useMemo<string>(() => "Danh sách nhân viên", []);

    // Header.
    const header = (
        <>
            {props.isReloading && (
                <div className="spinner-border spinner-border-sm me-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}
            
            <CreatingLink
                to={props.model.createRoute}
                canCreate={props.model.canCreate}
                disabled={props.isReloading}
            />
        </>
    );

    // Style.
    const style = `
        .role-button {
            --purple-color: 111, 66, 193;
            box-sizing: border-box;
        }

        .text-purple {
            color: rgb(var(--purple-color)) !important;
        }

        .border-purple {
            border-color: rgba(var(--purple-color), 1);
        }

        .border-purple-subtle {
            border-color: rgba(var(--purple-color), 0.4);
        }

        .bg-purple {
            --bs-bg-opacity: 1;
            background-color: rgb(var(--purple-color), var(--bs-bg-opacity)) !important;
        }

        .bg-purple.bg-opacity-10 {
            --bs-bg-opacity: 0.1;
            background-color: rgb(var(--purple-color), var(--bs-bg-opacity)) !important;
        }
    `;

    return (
        <MainBlock title={blockTitle} header={header} bodyPadding={2}>
            <FormContext.Provider value={null}>
                <div className="row g-3">
                    {/* Search content */}
                    <div className="col col-12">
                        <div className="input-group">
                            <TextInput
                                className="border-end-0"
                                type="text"
                                maxLength={255}
                                placeholder="Họ và tên, số điện thoại ..."
                                value={props.model.content}
                                onValueChanged={(content) => {
                                    props.onChanged({ content, page: 1 });
                                }}
                            />

                            {/* Advance filters / collapse button */}
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                disabled={props.isReloading}
                                data-bs-toggle="collapse"
                                data-bs-target="#advanced-filters-container"
                                role="button" 
                                aria-expanded="false"
                                aria-controls="advanced-filters-container"
                            >
                                <i className="bi bi-sliders" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row g-3 collapse" id="advanced-filters-container">
                    {/* Sort by field */}
                    <div className="col col-sm-6 col-12">
                        <Label text="Trường sắp xếp" />
                        <SortingByFieldSelectInput
                            name="sortingByField"
                            options={(data) => data.user.listSortingOptions}
                            value={props.model.sortingByField}
                            onValueChanged={(sortingByField) => {
                                props.onChanged({ sortingByField, page: 1 });
                            }}
                        />
                        <ValidationMessage name="orderByField" />
                    </div>

                    {/* Sort by direction */}
                    <div className="col col-sm-6 col-12">
                        <Label text="Thứ tự sắp xếp" />
                        <BooleanSelectInput 
                            name="orderByAscending"
                            trueDisplayName="Từ nhỏ đến lớn"
                            falseDisplayName="Từ lớn đến nhỏ"
                            value={props.model.sortingByAscending}
                            onValueChanged={(sortingByAscending) => {
                                props.onChanged({ sortingByAscending, page: 1 });
                            }}
                        >
                        </BooleanSelectInput>
                        <ValidationMessage name="orderByAscending" />
                    </div>

                    {/* Role options */}
                    <div className="col col-12 pb-0">
                        <Label text="Vị trí" />
                        <div className="d-flex flex-row flex-wrap">
                            <RoleButtons
                                selectedRoleId={props.model.roleId}
                                roleOptions={props.model.roleOptions}
                                onClick={(role) => {
                                    props.onChanged({ roleId: role?.id, page: 1 });
                                }}
                            />
                        </div>
                    </div>
                </div>
                <style>{style}</style>
            </FormContext.Provider>
        </MainBlock>
    );
};

export default Filters;

interface RoleButtonsProps {
    selectedRoleId: number | undefined;
    roleOptions: RoleMinimalModel[] | undefined;
    onClick: (role: RoleMinimalModel | null) => any;
}

const RoleButtons = ({ selectedRoleId, roleOptions, onClick }: RoleButtonsProps) => {
    // Computed.
    const getRoleButtonClassName = (roleName: string | null): string => {
        const color  = roleName ? roleUtility.getRoleBootstrapColor(roleName) : "purple";
        const classNames = [`bg-${color}`];
        const currentRole = roleOptions?.find(role => role.id === selectedRoleId);
        if (roleName === (currentRole?.name ?? null)) {
            classNames.push("text-white");
        } else {
            classNames.push(`border-${color}-subtle bg-opacity-10 text-${color}`);
        }
        return classNames.join(" ");
    };

    const getRoleButtonIcon = (roleName: string): string => {
        return roleUtility.getRoleBootstrapIconClassName(roleName);
    };

    return roleOptions?.map(role => (
        <div className={"btn btn-sm me-2 mb-2 role-button " + 
                        `${getRoleButtonClassName(role.name)}`}
                key={role.id}
                onClick={() => onClick(role)}>
            <i className={getRoleButtonIcon(role.name)}></i>
            <span className="ms-1">{role.displayName}</span>
        </div>
    ));
};
import React, { useMemo, useCallback } from "react";
import { type UserListModel } from "@models/user/userListModel";
import { RoleMinimalModel } from "@models/roleModels";
import { useRoleUtility } from "@/utilities/roleUtility";
import type { IModelState } from "@/hooks/modelStateHook";

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

// Placeholder component.
import { LoadingFiltersBlock } from "@/views/layouts/LoadingView";

// Props.
interface Props {
    model: UserListModel;
    setModel: React.Dispatch<React.SetStateAction<UserListModel>>;
    modelState: IModelState;
    isInitialLoading: boolean;
    isReloading: boolean;
    onSearchButtonClicked: () => Promise<void>;
}

// Dependencies.
const roleUtility = useRoleUtility();

const Filters = (props: Props) => {
    const { model, setModel, isInitialLoading, isReloading, onSearchButtonClicked } = props;

    // Computed.
    const blockTitle = useMemo<string>(() => "Danh sách nhân viên", []);
    const isSearchContentValid = !model.content.length || model.content.length >= 3;
    const searchContentColumnClassName = !isSearchContentValid ? "pb-0" : "";

    // Callbacks.
    const handleRoleChange = useCallback((role: RoleMinimalModel | null): void => {
        setModel(model => model.from({
            roleId: role?.id,
            page: 1
        }));
    }, [setModel]);

    const handleContentTextBoxInput = (newContent: string): void => {
        setModel(model => model.from({
            content: newContent,
            page: 1
        }));
    };

    // Header.
    const header = (
        <CreatingLink to={model.createRoute} canCreate={model.canCreate}
                isPlaceholder={isInitialLoading} disabled={isReloading} />
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

    if (isInitialLoading) {
        return <LoadingFiltersBlock mode="SearchTextBox" />;
    }

    return (
        <MainBlock title={blockTitle} bodyPadding={2} header={header}>
            <FormContext.Provider value={null}>
                <div className="row g-3">
                    {/* Search content */}
                    <div className={`col ${searchContentColumnClassName}`}>
                        <div className="input-group">
                            <TextInput className="border-end-0" type="text"
                                    maxLength={255} placeholder="Họ và tên, số điện thoại ..."
                                    value={model.content}
                                    onValueChanged={handleContentTextBoxInput} />

                            {/* Advance filters / collapse button */}
                            <button type="button" className="btn btn-outline-primary"
                                    disabled={isReloading}
                                    data-bs-toggle="collapse"
                                    data-bs-target="#advanced-filters-container"
                                    role="button" 
                                    aria-expanded="false"
                                    aria-controls="advanced-filters-container">
                                <i className="bi bi-sliders" />
                            </button>
                        </div>

                        {/* Search content validation message */}
                        {isSearchContentValid && (
                            <span className={`small opacity-50
                                            ${isSearchContentValid ? "d-none" : ""}`}>
                                * Nội dung tìm kiếm phải chứa ít nhất 3 ký tự.
                            </span>
                        )}
                    </div>

                    {/* Search button */}
                    <div className="col col-auto">
                        <button className="btn btn-primary"
                                type="button"
                                onClick={onSearchButtonClicked}>
                            <i className="bi bi-search"></i>
                            <span className="d-sm-inline d-none ms-2">Tìm kiếm</span>
                        </button>
                    </div>
                </div>
                <div className="row g-3 collapse" id="advanced-filters-container">
                    {/* Sort by field */}
                    <div className="col col-sm-6 col-12">
                        <Label text="Trường sắp xếp" />
                        <SortingByFieldSelectInput name="sortingByField"
                                options={(data) => data.user.listSortingOptions}
                                value={model.sortingByField}
                                onValueChanged={(sortingByField) => {
                                    setModel(model => model.from({ sortingByField}));
                                }} />
                        <ValidationMessage name="orderByField" />
                    </div>

                    {/* Sort by direction */}
                    <div className="col col-sm-6 col-12">
                        <Label text="Thứ tự sắp xếp" />
                        <BooleanSelectInput name="orderByAscending"
                                trueDisplayName="Từ nhỏ đến lớn"
                                falseDisplayName="Từ lớn đến nhỏ"
                                value={model.sortingByAscending}
                                onValueChanged={(sortingByAscending) => {
                                    setModel(model => model.from({ sortingByAscending  }));
                                }}>
                        </BooleanSelectInput>
                        <ValidationMessage name="orderByAscending" />
                    </div>

                    {/* Role options */}
                    <div className="col col-12 pb-0">
                        <Label text="Vị trí" />
                        <div className="d-flex flex-row flex-wrap">
                            <RoleButtons selectedRoleId={model.roleId}
                                    roleOptions={model.roleOptions}
                                    onClick={handleRoleChange} />
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

    const elements: React.JSX.Element[] = [(
        <div className={`btn btn-sm me-2 mb-2 role-button ${getRoleButtonClassName(null)}`}
                onClick={() => onClick(null)} key={0}>
            <i className="bi bi-grid-3x3-gap me-1"></i>
            Tất cả
        </div>
    )];

    if (roleOptions) {
        for (const role of roleOptions) {
            const className = getRoleButtonClassName(role.name);
            elements.push(
                <div className={`btn btn-sm me-2 mb-2 role-button ${className}`}
                        key={role.id}
                        onClick={() => onClick(role)}>
                    <i className={getRoleButtonIcon(role.name)}></i>
                    <span className="ms-1">{role.displayName}</span>
                </div>
            );
        }
    }

    return elements;
};
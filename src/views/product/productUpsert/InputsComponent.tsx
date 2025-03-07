import React, { useMemo } from "react";
import type { ProductUpsertModel } from "@/models/product/productUpsertModel";

// Form components.
import Label from "@/views/form/LabelComponent";
import TextInput from "@/views/form/TextInputComponent";
import TextAreaInput from "@/views/form/TextAreaInputComponent";
import ImageInput from "@/views/form/ImageInputComponent";
import NumberInput from "@/views/form/NumberInputComponent";
import SelectInput from "@/views/form/SelectInputComponent";
import BooleanSelectInput from "@/views/form/BooleanSelectInputComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Props.
interface Props {
    model: ProductUpsertModel;
    onModelChanged: (changedData: Partial<ProductUpsertModel>) => any;
    onThumbnailFileChanged(file: string | null): any;
}

const Inputs = (props: Props) => {
    // Memo.
    const categoryOptions = useMemo(() => {
        let defaultText = "Chưa chọn phân loại";
        if (!props.model.categoryOptions.length) {
            defaultText = "Không có phân loại";
        }
        
        return [
            { value: "", displayName: defaultText },
            ...props.model.categoryOptions.map(option => ({
                value: option.id.toString(), displayName: option.name
            }))
        ];
    }, [props.model.categoryOptions]);

    const brandOptions = useMemo(() => {
        let defaultText = "Chưa chọn thương hiệu";
        if (!props.model.brandOptions.length) {
            defaultText = "Không có thương hiệu";
        }

        return [
            { value: "", displayName: defaultText },
            ...props.model.brandOptions.map(option => ({
                value: option.id.toString(), displayName: option.name
            }))
        ];
    }, [props.model.categoryOptions]);

    return (
        <>
            <div className="row">
                <div className="col col-md-auto col-sm-12 col-12 pt-3 pb-3 d-flex
                                flex-column align-items-center justify-content-start">
                    <ImageInput
                        name="thumbnailFile"
                        defaultSrc="/images/default.jpg"
                        url={props.model.thumbnailUrl}
                        onValueChanged={props.onThumbnailFileChanged}
                    />
                    <ValidationMessage name="thumbnailFile" />
                </div>
                <div className="col ps-md-2 ps-0 pe-0">
                    <div className="row g-3">
                        {/* Name */}
                        <div className="col col-md-7 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Tên sản phẩm" required />
                                <TextInput
                                    name="name"
                                    maxLength={50}
                                    placeholder="Tên sản phẩm"
                                    value={props.model.name}
                                    onValueChanged={name => props.onModelChanged({ name })}
                                />
                                <ValidationMessage name="name" />
                            </div>
                        </div>

                        {/* Unit */}
                        <div className="col col-md-5 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Đơn vị" required />
                                <TextInput
                                    name="unit"
                                    maxLength={12}
                                    placeholder="Hộp, chai, ..."
                                    value={props.model.unit}
                                    onValueChanged={unit => props.onModelChanged({ unit })}
                                />
                                <ValidationMessage name="unit" />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="col col-md-6 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Giá niêm yết" required />
                                <div className="input-group">
                                    <NumberInput
                                        name="defaultPrice"
                                        min={0}
                                        placeholder="Giá niêm yết"
                                        value={props.model.defaultPrice}
                                        onValueChanged={defaultPrice => {
                                            props.onModelChanged({ defaultPrice });
                                        }}
                                    />
                                    <span className="input-group-text border-start-0">đ</span>
                                </div>
                                <ValidationMessage name="price" />
                            </div>
                        </div>

                        {/* VatFactor */}
                        <div className="col col-md-6 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Thuế VAT" required />
                                <div className="input-group">
                                    <NumberInput
                                        name="defaultVatPercentage"
                                        min={0}
                                        max={100}
                                        placeholder="10"
                                        value={props.model.defaultVatPercentage}
                                        onValueChanged={defaultVatPercentage => {
                                            props.onModelChanged({ defaultVatPercentage });
                                        }}
                                    />
                                    <span className="input-group-text border-start-0">%</span>
                                </div>
                                <ValidationMessage name="vatFactor" />
                            </div>
                        </div>

                        {/* IsForRetail */}
                        <div className="col col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Mục đích sử dụng" />
                                <BooleanSelectInput
                                    name="isForRetail"
                                    trueDisplayName="Chỉ liệu trình"
                                    falseDisplayName="Cả liệu trình và bán lẻ"
                                    value={props.model.isForRetail}
                                    onValueChanged={isForRetail => {
                                        props.onModelChanged({ isForRetail });
                                    }}
                                />
                                <ValidationMessage name="isForRetail" />
                            </div>
                        </div>

                        {/* IsDiscontinued */}
                        <div className="col col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Tình trạng" />
                                <BooleanSelectInput
                                    name="isDiscontinued"
                                    trueDisplayName="Có thể nhập hàng"
                                    falseDisplayName="Đã ngưng nhập hàng"
                                    value={props.model.isDiscontinued}
                                    onValueChanged={isDiscontinued => {
                                        props.onModelChanged({ isDiscontinued });
                                    }}
                                />
                                <ValidationMessage name="isDiscontinued" />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="col col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Phân loại" />
                                <SelectInput
                                    name="category"
                                    options={categoryOptions}
                                    value={props.model.categoryId?.toString() ?? ""}
                                    onValueChanged={categoryIdAsString => {
                                        const categoryId = JSON.parse(categoryIdAsString);
                                        props.onModelChanged({ categoryId });
                                    }}
                                />
                                <ValidationMessage name="category" />
                            </div>
                        </div>

                        {/* Brand */}
                        <div className="col col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Thương hiệu" />
                                <SelectInput
                                    name="brand"
                                    options={brandOptions}
                                    value={props.model.brandId?.toString() ?? ""}
                                    onValueChanged={brandIdAsString => {
                                        const brandId = JSON.parse(brandIdAsString);
                                        props.onModelChanged({ brandId });
                                    }}
                                />
                                <ValidationMessage name="brand" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="row g-3">
                <div className="col col-12">
                    <div className="form-group">
                        <Label text="Mô tả" />
                        <TextAreaInput
                            name="description"
                            maxLength={1000}
                            placeholder="Mô tả"
                            style={{ minHeight: "200px" }}
                            value={props.model.description}
                            onValueChanged={description => {
                                props.onModelChanged({ description });
                            }}
                        />
                        <ValidationMessage name="description" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Inputs;
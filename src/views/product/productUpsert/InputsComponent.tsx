import React, { useMemo } from "react";
import type { ProductUpsertModel } from "@/models/product/productUpsertModel";

// Form components.
import Label from "@/views/form/LabelComponent";
import TextInput from "@/views/form/TextInputComponent";
import TextAreaInput from "@/views/form/TextAreaInputComponent";
import ImageInput from "@/views/form/ImageInputComponent";
import NumberInput from "@/views/form/NumberInputComponent";
import SelectInput from "@/views/form/SelectInputComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Props.
interface Props {
    model: ProductUpsertModel;
    setModel: React.Dispatch<React.SetStateAction<ProductUpsertModel>>;
    isInitialLoading: boolean;
    onThumbnailFileChanged(file: string | null): any;
}

const Inputs = ({ model, setModel, isInitialLoading, onThumbnailFileChanged }: Props) => {
    // Memo.
    const categoryOptions = useMemo(() => {
        let defaultText = "Chưa chọn phân loại";
        if (!model.categoryOptions.length) {
            defaultText = "Không có phân loại";
        }
        
        return [
            { value: "", displayName: defaultText },
            ...model.categoryOptions.map(option => ({
                value: option.id.toString(), displayName: option.name
            }))
        ];
    }, [model.categoryOptions]);

    const brandOptions = useMemo(() => {
        let defaultText = "Chưa chọn thương hiệu";
        if (!model.brandOptions.length) {
            defaultText = "Không có thương hiệu";
        }

        return [
            { value: "", displayName: defaultText },
            ...model.brandOptions.map(option => ({
                value: option.id.toString(), displayName: option.name
            }))
        ];
    }, [model.categoryOptions]);

    return (
        <>
            <div className="row">
                <div className="col col-md-auto col-sm-12 col-12 pt-3 pb-3 d-flex
                                flex-column align-items-center justify-content-start">
                    <ImageInput name="thumbnailFile"
                            defaultSrc="/images/default.jpg" url={model.thumbnailUrl}
                            onValueChanged={onThumbnailFileChanged} />
                    <ValidationMessage name="thumbnailFile" />
                </div>
                <div className="col ps-md-2 ps-0 pe-0">
                    <div className="row g-3">
                        {/* Name */}
                        <div className="col col-md-7 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Tên sản phẩm" required />
                                <TextInput name="name" maxLength={50}
                                        placeholder="Tên sản phẩm" disabled={isInitialLoading}
                                        value={model.name}
                                        onValueChanged={name => {
                                            setModel(model => model.from({ name }));
                                        }} />
                                <ValidationMessage name="name" />
                            </div>
                        </div>

                        {/* Unit */}
                        <div className="col col-md-5 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Đơn vị" required />
                                <TextInput name="unit" maxLength={12}
                                        disabled={isInitialLoading}
                                        placeholder="Hộp, chai, ..."
                                        value={model.unit}
                                        onValueChanged={unit => {
                                            setModel(model => model.from({ unit }));
                                        }} />
                                <ValidationMessage name="unit" />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="col col-md-6 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Giá niêm yết" required />
                                <div className="input-group">
                                    <NumberInput name="defaultPrice" min={0}
                                            disabled={isInitialLoading}
                                            placeholder="Giá niêm yết"
                                            value={model.defaultPrice}
                                            onValueChanged={defaultPrice => {
                                                setModel(model => model.from({ defaultPrice }));
                                            }} />
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
                                    <NumberInput name="defaultVatPercentage" min={0} max={100}
                                            placeholder="10" disabled={isInitialLoading}
                                            value={model.defaultVatPercentage}
                                            onValueChanged={defaultVatPercentage => {
                                                setModel(m => m.from({
                                                    defaultVatPercentage
                                                }));
                                            }} />
                                    <span className="input-group-text border-start-0">%</span>
                                </div>
                                <ValidationMessage name="vatFactor" />
                            </div>
                        </div>

                        {/* IsForRetail */}
                        <div className="col col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Mục đích sử dụng" />
                                <SelectInput name="isForRetail" disabled={isInitialLoading}
                                        options={[
                                            {
                                                value: "false",
                                                displayName: "Chỉ liệu trình"
                                            },
                                            {
                                                value: "true",
                                                displayName: "Cả liệu trình và bán lẻ"
                                            },
                                        ]}
                                        value={model.isForRetail.toString()}
                                        onValueChanged={isForRetailAsString => {
                                            const isForRetail = JSON.parse(isForRetailAsString);
                                            setModel(model => model.from({ isForRetail }));
                                        }} />
                                <ValidationMessage name="isForRetail" />
                            </div>
                        </div>

                        {/* IsDiscontinued */}
                        <div className="col col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Tình trạng" />
                                <SelectInput name="isDiscontinued" disabled={isInitialLoading}
                                        options={[
                                            { value: "false", displayName: "Có thể nhập hàng" },
                                            { value: "true", displayName: "Đã ngưng nhập hàng" },
                                        ]}
                                        value={model.isDiscontinued.toString()}
                                        onValueChanged={discontinued => {
                                            const isDiscontinued = JSON.parse(discontinued);
                                            setModel(model => model.from({ isDiscontinued }));
                                        }} />
                                <ValidationMessage name="isDiscontinued" />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="col col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Phân loại" />
                                <SelectInput name="category" options={categoryOptions}
                                        disabled={isInitialLoading}
                                        value={model.categoryId?.toString() ?? ""}
                                        onValueChanged={categoryIdAsString => {
                                            const categoryId = JSON.parse(categoryIdAsString);
                                            setModel(model => model.from({
                                                categoryId: categoryId || null
                                            }));
                                        }} />
                                <ValidationMessage name="category" />
                            </div>
                        </div>

                        {/* Brand */}
                        <div className="col col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="form-group">
                                <Label text="Thương hiệu" />
                                <SelectInput name="brand" options={brandOptions}
                                        disabled={isInitialLoading}
                                        value={model.brandId?.toString() ?? ""}
                                        onValueChanged={brandIdAsString => {
                                            const brandId = JSON.parse(brandIdAsString);
                                            setModel(model => model.from({
                                                brandId: brandId || null
                                            }));
                                        }} />
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
                        <TextAreaInput name="description" maxLength={1000} placeholder="Mô tả"
                                disabled={isInitialLoading}
                                style={{ minHeight: "200px" }}
                                value={model.description}
                                onValueChanged={description => {
                                    setModel(model => model.from({ description }));
                                }} />
                        <ValidationMessage name="description" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Inputs;
import React from "react";
import type { ProductListModel } from "@/models/product/productListModel";
import type { IModelState } from "@/hooks/modelStateHook";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";
import Label from "@/views/form/LabelComponent";
import CreatingLink from "@/views/layouts/CreateLinkComponent";

// Child components.
import OptionsSelectInput from "./OptionsSelectInputComponent";

// Props.
interface FiltersProps {
    model: ProductListModel;
    setModel: React.Dispatch<React.SetStateAction<ProductListModel>>;
    modelState: IModelState;
    isReloading: boolean;
}

const Filters = (props: FiltersProps) => {
    const { model, setModel, isReloading } = props;

    // Computed.
    const computeRowClassName = () => isReloading ? "opacity-50 pe-none" : "";

    // Callbacks.
    const handleBrandIdChange = (brandId: number) => {
        setModel(model => model.from({ page: 1, brandId }));
    };

    const handleCategoryIdChange = (categoryId: number) => {
        setModel(model => model.from({ page: 1, categoryId }));
    };

    // Header.
    const computeHeader = () => {
        const className = props.isReloading ? "placeholder disabled" : "";
        return (
            <CreatingLink to={model.createRoute} className={className}
                canCreate={model.canCreate} />
        );
    };

    return (
        <MainBlock title="Sản phẩm" header={computeHeader()} bodyPadding={[0, 2, 2, 2]}>
            <div className={`row g-3 justify-content-end ${computeRowClassName()}`}>
                {/* Brand options */}
                <div className="col col-md-6 col-sm-12 col-12">
                    <Label text="Thương hiệu" />
                    <OptionsSelectInput resourceType="brand" name="brandId"
                        disabled={isReloading}
                        options={model.brandOptions}
                        value={model.brandId}
                        onValueChanged={handleBrandIdChange}
                    />
                </div>

                {/* Category options */}
                <div className="col col-md-6 col-sm-12 col-12">
                    <Label text="Phân loại" />
                    <OptionsSelectInput resourceType="brand" name="categoryId"
                        disabled={isReloading}
                        options={model.categoryOptions}
                        value={model.categoryId}
                        onValueChanged={handleCategoryIdChange}
                    />
                </div>
            </div>
        </MainBlock>
    );
};

export default Filters;
import type { ProductListModel } from "@/models/product/productListModel";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";
import Label from "@/views/form/LabelComponent";
import CreatingLink from "@/views/layouts/CreateLinkComponent";

// Child components.
import OptionsSelectInput from "./OptionsSelectInputComponent";

// Props.
interface FiltersProps {
    model: ProductListModel;
    onModelChanged: (changedData: Partial<ProductListModel>) => void;
    isReloading: boolean;
}

const Filters = (props: FiltersProps) => {
    // Computed.
    const computeRowClassName = () => props.isReloading ? "opacity-50 pe-none" : "";

    // Header.
    const computeHeader = () => {
        const className = props.isReloading ? "placeholder disabled" : "";
        return (
            <>
                {props.isReloading && (
                    <div className="spinner-border spinner-border-sm me-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                <CreatingLink
                    to={props.model.createRoute}
                    className={className}
                    canCreate={props.model.canCreate}
                />
            </>
        );
    };

    return (
        <MainBlock title="Sản phẩm" header={computeHeader()} bodyPadding={[0, 2, 2, 2]}>
            <div className={`row g-3 justify-content-end ${computeRowClassName()}`}>
                {/* Brand options */}
                <div className="col col-md-6 col-sm-12 col-12">
                    <Label text="Thương hiệu" />
                    <OptionsSelectInput
                        name="brandId"
                        resourceType="brand"
                        disabled={props.isReloading}
                        options={props.model.brandOptions}
                        value={props.model.brandId}
                        onValueChanged={(brandId) => props.onModelChanged({ brandId })}
                    />
                </div>

                {/* Category options */}
                <div className="col col-md-6 col-sm-12 col-12">
                    <Label text="Phân loại" />
                    <OptionsSelectInput
                        name="categoryId"
                        resourceType="brand"
                        disabled={props.isReloading}
                        options={props.model.categoryOptions}
                        value={props.model.categoryId}
                        onValueChanged={(categoryId) => props.onModelChanged({ categoryId })}
                    />
                </div>
            </div>
        </MainBlock>
    );
};

export default Filters;
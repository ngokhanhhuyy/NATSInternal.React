import React from "react";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import StatsDateTimeInput from "@/views/form/StatsDateTimeInputComponent";
import TextAreaInput from "@/views/form/TextAreaInputComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Props.
interface InformationProps<
        TUpsert extends IExportProductUpsertModel<TUpsert, TUpsertItem, TPhoto>,
        TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>,
        TPhoto extends IUpsertPhotoModel<TPhoto>>
{
    model: TUpsert;
    setModel: React.Dispatch<React.SetStateAction<TUpsert>>;
    isForCreating: boolean;
    render: () => React.ReactNode | undefined;
}

// Component.
const Information = <
            TUpsert extends IExportProductUpsertModel<TUpsert, TUpsertItem, TPhoto>,
            TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>,
            TPhoto extends IUpsertPhotoModel<TPhoto>>
        (props: InformationProps<TUpsert, TUpsertItem, TPhoto>) =>
{
    const { model, setModel, isForCreating, render } = props;

    return (
        <MainBlock title="Thông tin đơn đặt hàng" closeButton bodyPadding={[0, 2, 2, 2]}>
            <div className="row g-3">
                {/* StatsDateTime */}
                {model.canSetStatsDateTime && (
                <div className="col col-12">
                    <Label text="Ngày giờ thanh toán" />
                    <StatsDateTimeInput
                        name="statsDateTime"
                        value={model.statsDateTime}
                        onValueChanged={statsDateTime => {
                            setModel(m => m.from({ statsDateTime } as Partial<TUpsert>));
                        }}
                    />
                    <ValidationMessage name="statsDateTime`" />
                </div>
                )}

                {render?.()}

                {/* Note */}
                <div className="col col-12">
                    <Label text="Ghi chú" />
                    <TextAreaInput name="note"
                        placeholder="Ghi chú ..."
                        value={model.note}
                        onValueChanged={note => {
                            setModel(m => m.from({ note } as Partial<TUpsert>));
                        }}
                    />
                    <ValidationMessage name="note" />
                </div>

                {/* UpdatedReason */}
                {!isForCreating && (
                    <div className="col col-12">
                        <Label text="Lý do chỉnh sửa" required />
                        <TextAreaInput name="updatedReason"
                            placeholder="Lý do chỉnh sửa"
                            value={model.updatedReason}
                            onValueChanged={updatedReason => {
                                setModel(m => m.from({ updatedReason } as Partial<TUpsert>));
                            }}
                        />
                        <ValidationMessage name="updatedReason" />
                    </div>
                )}
            </div>
        </MainBlock>
    );
};

export default Information;
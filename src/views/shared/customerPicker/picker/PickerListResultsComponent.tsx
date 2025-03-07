import type { CustomerBasicModel } from "@/models/customer/customerBasicModel";

// Child component.
import PickerListResultsItem from "./PickerListResultsItemComponent";

// Props.
interface PickerListResultsProps {
    model: CustomerBasicModel[];
    avatarStyle: React.CSSProperties;
    onSelected(customer: CustomerBasicModel): void;
}

// Components.
const PickerListResults = (props: PickerListResultsProps) => {
    return (
        <ul className="list-group">
            {props.model.map(customer => (
                <PickerListResultsItem
                    model={customer}
                    avatarStyle={props.avatarStyle}
                    onSelected={() => props.onSelected(customer)}
                    key={customer.id}
                />
            ))}
        </ul>
    );
};

export default PickerListResults;
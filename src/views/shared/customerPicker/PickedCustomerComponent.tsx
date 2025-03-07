import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { CustomerBasicModel } from "@/models/customer/customerBasicModel";
import { Gender } from "@/services/dtos/enums";

// Props.
interface PickedCustomerProps {
    model: CustomerBasicModel;
    avatarStyle: React.CSSProperties;
}

const PickedCustomer = (props: PickedCustomerProps) => {
    // Memo.
    const genderClassName = useMemo((): string => {
        if (props.model.gender === Gender.Male) {
            return "text-primary";
        }
        return "text-danger";
    }, []);

    return (
        <div className="row gx-4 pt-2 align-items-stretch">
            <div className="col col-auto d-flex align-items-center justify-content-center">
                {/* Thumbnail */}
                <img
                    className="img-thumbnail rounded-circle"
                    style={props.avatarStyle}
                    src={props.model.avatarUrl}
                />
            </div>
            <div className="col d-flex flex-column">
                {/* FullName */}
                <Link to={props.model.detailRoute} className="fw-bold">
                    {props.model.fullName}
                </Link>

                {/* NickName */}
                {props.model.nickName && (
                    <span className="fst-italic small">
                        {props.model.nickName}
                    </span>
                )}

                {/* Gender and PhoneNumber */}
                <div className="small">
                    {/* Gender */}
                    <span className={genderClassName}>
                        {props.model.gender === Gender.Male ? "Nam" : "Nữ"}
                    </span>,&nbsp;

                    {/* PhoneNumber */}
                    {props.model.phoneNumber && (
                        <span>
                            {props.model.phoneNumber}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PickedCustomer;
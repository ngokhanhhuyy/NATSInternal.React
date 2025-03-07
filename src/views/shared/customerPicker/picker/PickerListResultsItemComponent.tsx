import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Gender } from "@/services/dtos/enums";
import type { CustomerBasicModel } from "@/models/customer/customerBasicModel";

// Props.
interface PickerListResultsItemProps {
    model: CustomerBasicModel;
    avatarStyle: React.CSSProperties;
    onSelected(): void;
}

const PickerListResultsItem = (props: PickerListResultsItemProps) => {
    // Memo.
    const genderClassName = useMemo((): string => {
        if (props.model.gender === Gender.Male) {
            return "text-primary";
        }
        return "text-danger";
    }, []);

    return (
        <li className="list-group-item d-flex align-items-center">
            {/* Avatar */}
            <Link to={props.model.detailRoute}>
                <img
                    className="img-thumbnail rounded-circle me-2"
                    src={props.model.avatarUrl}
                />
            </Link>

            {/* Detail */}
            <div className="detail d-flex flex-column justify-content-center
                            align-items-start flex-fill">
                {/* FullName */}
                <Link className="fullname fw-bold" to={props.model.detailRoute}>
                    {props.model.fullName}
                </Link>

                {/* NickName */}
                <span className="nickname small">
                    {props.model.nickName}
                </span>
                
                {/* Additional details */}
                <div className="small">
                    {/* Gender */}
                    <span className={genderClassName}>
                        {props.model.gender === Gender.Male ? "Nam" : "Nữ"}
                    </span>,&nbsp;

                    {/* PhoneNumber */}
                    {props.model.phoneNumber && (
                        <span>{props.model.phoneNumber}</span>
                    )}
                </div>
            </div>

            {/* Select button */}
            <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => props.onSelected()}
            >
                <i className="bi bi-check2-circle"></i>
                <span className="d-sm-inline d-none ms-2">Chọn</span>
            </button>
        </li>
    );
};

export default PickerListResultsItem;
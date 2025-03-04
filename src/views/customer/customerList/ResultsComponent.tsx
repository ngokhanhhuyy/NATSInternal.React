import React from "react";
import { useNavigate, Link } from "react-router-dom";
import type { CustomerBasicModel } from "@/models/customer/customerBasicModel";

interface Props {
    model: CustomerBasicModel[];
    isReloading: boolean;
}

const Results = ({ model, isReloading }: Props) => {
    // Computed.
    const computeUlClassName = (): string => {
        const classNames = ["list-group list-group-flush w-100 transition-reloading"];
        if (isReloading) {
            classNames.push("opacity-50 pe-none");
        }

        return classNames.join(" ");
    };

    return (
        <div className={computeUlClassName()}>
            {model.length > 0 ? (
                <ul className="list-group list-group-flush w-100 transition-reloading">
                    {model.map(customer => (
                        <ResultItem model={customer} key={customer.id} />
                    ))}
                </ul>
            ) : (
                <div className="opacity-50 my-4 text-center">
                    Không tìm thấy kết quả
                </div>
            )}
        </div>
    );
};

export default Results;

const ResultItem = ({ model }: { model: CustomerBasicModel }) => {
    // Dependencies.
    const navigate = useNavigate();

    return (
        <li className="list-group-item d-flex px-3 py-2 align-items-center">
            {/* Avatar */}
            <img
                className="img-thumbnail rounded-circle"
                src={model.avatarUrl}
                onClick={async () => model && navigate(model.detailRoute)}
                style={{ width: "60px", height: "60px" }}
            />

            {/* Names */}
            <div className="d-flex flex-column flex-fill ps-3 justify-content-center">
                {/* FullName */}
                <Link className="fw-bold fullname" to={model.detailRoute}>
                    {model.fullName}
                </Link>

                {/* NickName */}
                <span className="small">{model.nickName}</span>
            </div>

            {/* DetailRoute */}
            <Link to={model.detailRoute} className="btn btn-outline-primary btn-sm">
                <i className="bi bi-info-circle"></i>
                <span className="d-sm-inline d-none ms-1">Xem</span>
            </Link>

            {/* UpdateRoute */}
            {model.authorization?.canEdit && (
                <Link to={model.updateRoute} className="btn btn-outline-primary btn-sm ms-2">
                    <i className="bi bi-pencil-square"></i>
                    <span className="d-sm-inline d-none ms-1">Sửa</span>
                </Link>
            )}
        </li>
    );
};
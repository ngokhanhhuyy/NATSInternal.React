import React from "react";
import { useNavigate, Link } from "react-router-dom";
import type { CustomerBasicModel } from "@/models/customer/customerBasicModel";

interface Props {
    model: CustomerBasicModel[];
    isInitialLoading: boolean;
    isReloading: boolean;
}

const Results = ({ model, isReloading }: Props) => {
    const computedClassName = (): string => isReloading ? "opacity-50 pe-none" : "";

    const computeContent = (): React.ReactNode | React.ReactNode[] => {
        if (!model.length) {
            return <div className="opacity-50 my-4"> Không tìm thấy kết quả</div>;
        }

        return (
            <ul className="list-group list-group-flush w-100">
                {model.map(customer => <ResultItem model={customer} key={customer.id} />)}
            </ul>
        );
    };

    return (
        <div className={`block-body w-100 flex-fill d-flex justify-content-center
                        align-items-center ${computedClassName()}`}>
            {computeContent()}
        </div>
    );
};

export default Results;

const ResultItem = ({ model }: { model: CustomerBasicModel }) => {
    const navigate = useNavigate();

    return (
        <li className="list-group-item d-flex px-3 py-2 align-items-center">
            {/* Avatar */}
            <img className="img-thumbnail rounded-circle" src={model.avatarUrl}
                    onClick={async () => model && navigate(model.detailRoute)}
                    style={{ width: "60px", height: "60px" }} />

            {/* Names */}
            <div className="d-flex flex-column flex-fill ps-3 justify-content-center">
                
                {/* FullName */}
                <Link className="fw-bold fullname" to={model?.detailRoute}>
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
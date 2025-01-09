import React, { useMemo } from "react";
import type { UserBasicModel } from "@/models/user/userBasicModel";

// Child component.
import ResultsItem from "./ResultsItemComponent";

// Props.
interface ResultsProps {
    model: UserBasicModel[];
    isReloading: boolean;
}

// Component.
const Results = ({ model, isReloading }: ResultsProps) => {
    const itemColumnClassName = useMemo<string>(() => {
        return "col col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6";
    }, []);

    const computeItemColumnReloadingClassName = () => {
        if (isReloading) {
            return "opacity-50 pe-none";
        }

        return "";
    };

    if (model.length) {
        return model.map(user => (
            <div className={`${itemColumnClassName} ${computeItemColumnReloadingClassName()}`}
                    key={user.id}>
                <ResultsItem model={user}/>
            </div>
        ));
    }

    return (
        <div className="col col-12">
            <div className="block border rounded-3 py-4 bg-white d-flex
                            justify-content-center align-items-center">
                <span className="opacity-50">Không tìm thấy kết quả nào</span>
            </div>
        </div>
    );
};

export default Results;
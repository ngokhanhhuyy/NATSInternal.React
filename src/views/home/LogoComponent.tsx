import React from "react";

const Logo = () => {
    return (
        <div className="bg-primary-subtle border border-primary-subtle text-white rounded-3
                        d-flex flex-column justify-content-center align-items-center
                        h-100 py-md-0 py-5">
            <img
                src="/images/main-logo.png"
                className="mx-5 mb-3 w-100 h-auto rounded-circle shadow"
                style={{ aspectRatio: 1, maxWidth: 170 }}
            />
            <span className="text-primary text-center fw-bold fs-5 mx-3">
                Trung tâm
                <br className="d-md-inline d-none"/>
                <span className="d-md-none d-inline"> </span>
                Đào Tạo Thẩm Mỹ
                <br className="d-xxl-inline d-none"/>
                <span className="d-xxl-none d-inline"> </span>
                Quốc Gia
            </span>
        </div>
    );
};

export default Logo;
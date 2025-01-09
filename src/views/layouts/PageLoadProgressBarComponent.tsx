import React from "react";
import { usePageLoadProgressBarStore } from "@/stores/pageLoadProgressBarStore";
import * as styles from "./PageLoadProgressBarComponent.module.css";

const progressBarClassNames = {
    pending: styles["pending"],
    waiting: styles["waiting"],
    finishing: styles["finishing"],
    hiding: styles["hiding"]
};

const PageLoadProgressBarComponent = () => {
    const store = usePageLoadProgressBarStore();

    return (
        <div className={`progress w-100 ${styles["progress"]}`} role="progressbar"
                aria-label="Animated striped example"
                aria-valuenow={store.percentage}
                aria-valuemin={0} aria-valuemax={100}>
            <div className={`progress-bar progress-bar-striped progress-bar-animated h-100
                            ${progressBarClassNames[store.phase]}`}
                    style={{ width: `${store.percentage}%` }}></div>
        </div>
    );
};

export default PageLoadProgressBarComponent;
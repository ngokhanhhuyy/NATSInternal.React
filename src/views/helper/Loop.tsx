import React, { ReactNode } from "react";

interface ForEachProps<T> {
    collection: T[];
    render: (item: T, index: number) => ReactNode | ReactNode[];
    itemKey?: (item: T, index: number) => React.Key | null;
}

const ForEach = <T,>({ collection, render, itemKey }: ForEachProps<T>) => {
    const elements: ReactNode[] = [];
    for (let index = 0; index < collection.length; index++) {
        const item = collection[index];
        elements.push(
            <React.Fragment key={itemKey?.(item, index)}>
                {render(collection[index], index)}
            </React.Fragment>
        );
    }

    return <>{elements}</>;
};

export default ForEach;
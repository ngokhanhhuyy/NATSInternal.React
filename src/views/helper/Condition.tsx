import React, { ReactNode } from "react";

interface IfProps {
    condition: any;
    children: ReactNode | ReactNode[];
}

const If = ({ condition, children }: IfProps) => {
    if (condition) {
        return (
            <>
                {React.Children.map(children, child => {
                    if (!React.isValidElement(child) || child.type !== False) {
                        return child;
                    }

                    return null;
                })}
            </>
        );  
    }

    return (
        <>
            {React.Children.map(children, child => {
                if (React.isValidElement(child) && child.type === False) {
                    return child;
                }

                return null;
            })}
        </>
    );  
};

export default If;

type TrueFalseProps = { children: ReactNode | ReactNode[] };

export const True: React.FC<TrueFalseProps> = ({ children }: TrueFalseProps) => {
    return <>{children}</>;
};

export const False: React.FC<TrueFalseProps> = ({ children }: TrueFalseProps) => {
    return <>{children}</>;
};
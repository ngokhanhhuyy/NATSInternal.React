import React, { useState } from "react";

export type ObjectStateUpdater<T> = (updateFunction: ObjectStateUpdateFunction<T>) => void;
export type ObjectStateUpdateFunction<T> = (newObject: T) => void;

export function useObjectState<T extends object>():
    [T | undefined, ObjectStateUpdater<T>, React.Dispatch<React.SetStateAction<T | undefined>>];
export function useObjectState<T extends object>(initialValue: T):
    [T, ObjectStateUpdater<T>, React.Dispatch<React.SetStateAction<T | undefined>>];
export function useObjectState<T extends object>(initialValue?: T):
        [T | undefined, ObjectStateUpdater<T | undefined>, React.Dispatch<React.SetStateAction<T | undefined>>] {
    const [obj, setObj] = useState(initialValue);

    function update(updateFunction: ObjectStateUpdateFunction<T>): void {
        const newObject: T = Object.create(Object.getPrototypeOf(this));
        updateFunction(newObject);
        setObj(newObject);
    }

    return [obj, update, setObj];
}
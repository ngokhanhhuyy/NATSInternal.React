export class ClonableArrayModel<TElementModel extends IClonableModel<TElementModel>>
        extends Array<TElementModel>
        implements IClonableArrayModel<TElementModel>
{
    public add(element: TElementModel): this {
        const Constructor = this.constructor as new (...args: TElementModel[]) => this;
        return new Constructor(...this, element);
    }

    public addMultiple(elements: TElementModel[]): this {
        const Constructor = this.constructor as new (...args: TElementModel[]) => this;
        return new Constructor(...this, ...elements);
    }

    public from(index: number, data: Partial<MethodsOmitted<TElementModel>>): this;
    public from(element: TElementModel, data: Partial<MethodsOmitted<TElementModel>>): this;
    public from(
        condition: (element: TElementModel) => boolean,
        data: Partial<MethodsOmitted<TElementModel>>): this;
    public from(
            arg: number | TElementModel | ((element: TElementModel) => boolean),
            data: Partial<MethodsOmitted<TElementModel>>): this {
        const Constructor = this.constructor as new (...args: TElementModel[]) => this;
        const clonedArray: this = new Constructor(...this);
        if (typeof arg === "number") {
            clonedArray[arg] = clonedArray[arg].from(data);
            return clonedArray;
        }
        let index: number;
        if (typeof arg === "function") {
            index = clonedArray.findIndex(arg);
        } else {
            index = clonedArray.findIndex(element => element === arg);
        }

        clonedArray[index] = clonedArray[index].from(data);
        return clonedArray;
    }

    public replace(index: number, newElement: TElementModel): this {
        const Constructor = this.constructor as new (...args: TElementModel[]) => this;
        const clonedArray: this = new Constructor(...this);
        clonedArray[index] = newElement;
        return clonedArray;
    }

    public remove(element: TElementModel): this;
    public remove(index: number): this;
    public remove(arg: TElementModel | number): this {
        const Constructor = this.constructor as new (...args: TElementModel[]) => this;
        return new Constructor(...this.filter((evaluatingElement, evaluatingIndex) => {
            if (typeof arg === "object") {
                return evaluatingElement != arg;
            } else {
                return evaluatingIndex != arg;
            }
        }));
    }
}
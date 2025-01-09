declare global {
    interface IClonableModel<TModel extends object> {
        from(data: Partial<TModel>): TModel;
    }

    interface IClonableArrayModel<TElementModel extends IClonableModel<TElementModel>> {
        add(element: TElementModel): this;
        addMultiple(elements: TElementModel[]): this;

        from(index: number, data: Partial<TElementModel>): this;
        from(element: TElementModel, data: Partial<TElementModel>): this;
        from(
            condition: (element: TElementModel) => boolean,
            data: Partial<TElementModel>): this;

        replace(index: number, newElement: TElementModel): this
        
        remove(element: TElementModel): this;
        remove(index: number): this;
    }
}

export { };
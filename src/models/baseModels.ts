export abstract class AbstractClonableModel<TModel extends object>
        implements IClonableModel<TModel> {
    public from(data: Partial<TModel>): TModel {
        const model: TModel = Object.create(Object.getPrototypeOf(this));
        Object.assign(model, this);
        Object.assign(model, data);
        return model;
    }
}
declare global {
    namespace ResponseDtos {
        type InitialData = {
            displayNames: { [key: string]: string };
            announcement: ResponseDtos.Announcement.Initial;
            brand: ResponseDtos.Brand.Initial;
            consultant: ResponseDtos.Consultant.Initial;
            country: ResponseDtos.Country.Initial;
            customer: ResponseDtos.Customer.Initial;
            debtIncurrence: ResponseDtos.DebtIncurrence.Initial;
            debtPayment: ResponseDtos.DebtPayment.Initial;
            expense: ResponseDtos.Expense.Initial;
            order: ResponseDtos.Order.Initial;
            product: ResponseDtos.Product.Initial;
            productCategory: ResponseDtos.ProductCategory.Initial;
            role: ResponseDtos.Role.Initial;
            supply: ResponseDtos.Supply.Initial;
            treatment: ResponseDtos.Treatment.Initial;
            user: ResponseDtos.User.Initial;
            stats: ResponseDtos.Stats.Initial;
        };
    }
}

export { };
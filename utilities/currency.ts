export const formatCurrency = (price: Price): string => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currencyCode,
        minimumFractionDigits: 2,
    });

    return formatter.format(price.amount);
};

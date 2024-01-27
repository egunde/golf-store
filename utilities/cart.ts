export const getStoredCart = () => {
    const storedCart = localStorage.getItem("storedCart");
    return storedCart ? JSON.parse(storedCart) : [];
};

export const saveStoredCart = (cart: StoredCart) => {
    localStorage.setItem("storedCart", JSON.stringify(cart));
};

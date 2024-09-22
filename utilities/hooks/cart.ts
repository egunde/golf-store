import { useState, useEffect } from "react";
import { addCartItem, createCartWithItems, getCartById, removeCartItem, updateCartItem } from "../shopify";

export const getStoredCart = () => {
    const storedCart = localStorage.getItem("storedCart");
    const dateStored = localStorage.getItem("dateStored");
    if (dateStored && isMoreThanTwoWeeksOld(new Date(dateStored))) {
        localStorage.removeItem("storedCart");
        localStorage.removeItem("dateStored");
        return [];
    }
    return storedCart ? JSON.parse(storedCart) : [];
};

export const saveStoredCart = (cart: StoredCart) => {
    const dateStored = new Date();
    localStorage.setItem("dateStored", dateStored.toISOString());
    localStorage.setItem("storedCart", JSON.stringify(cart));
};

function isMoreThanTwoWeeksOld(dateToCompare: Date): boolean {
    const today = new Date();
    const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000;
    const differenceInTime = today.getTime() - dateToCompare.getTime();
    
    return differenceInTime > twoWeeksInMilliseconds;
}

const useCart = () => {
    const [cart, setCart] = useState<Cart>();
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(true);
    const [refreshCounter, setRefreshCounter] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        const fetchCart = async () => {
            const id = localStorage.getItem("cartId")
                ? localStorage.getItem("cartId")
                : null;
            const items: StoredCart = getStoredCart();
            try {
                const response = id
                    ? await getCartById(id)
                    : await createCartWithItems(items);
                localStorage.setItem("cartId", JSON.stringify(response.id));
                updateItems(response);
            } catch (error) {
                console.log(error);
            }
        };

        //Syncs storedCart with Shopify cart
        const updateItems = async (cart: Cart) => {
            //Retrieve necessary data
            const items: StoredCart = getStoredCart();
            const itemIds = items.map((item) => item.merchandiseId);
            const cartIds = cart.lines.nodes.map((node) => node.merchandise.id);

            //Filter unchanged items
            const itemsToRemove = cartIds.filter((id) => !itemIds.includes(id));
            const itemsToUpdate = itemIds.filter((id) => cartIds.includes(id));
            const itemsToAdd = itemIds.filter((id) => !cartIds.includes(id));

            let updatedCart: Cart = cart;
            //Form and execute queries
            if (itemsToRemove) {
                const removeItems: string[] = cart.lines.nodes
                    .filter((node) =>
                        itemsToRemove.includes(node.merchandise.id)
                    )
                    .map((node) => node.id);

                updatedCart = await removeCartItem(cart.id, removeItems);
            }
            if (itemsToUpdate) {
                const updateItems: CartUpdateItem[] = cart.lines.nodes
                    .filter((node) =>
                        itemsToUpdate.includes(node.merchandise.id)
                    )
                    .map((node) => {
                        const item = items.find(
                            (item) => item.merchandiseId === node.merchandise.id
                        );
                        return {
                            id: node.id,
                            merchandiseId: node.merchandise.id,
                            quantity: item ? item.quantity : node.quantity,
                        };
                    });

                updatedCart = await updateCartItem(cart.id, updateItems);
            }
            if (itemsToAdd) {
                const addItems: CartAddItem[] = items
                    .filter((item) => itemsToAdd.includes(item.merchandiseId))
                    .map((item) => ({
                        merchandiseId: item.merchandiseId,
                        quantity: item.quantity,
                    }));

                updatedCart = await addCartItem(cart.id, addItems);
            }
            setCart(updatedCart);
            setIsLoading(false);
            setIsCheckoutDisabled(false);
        };

        fetchCart();
    }, [refreshCounter]);

    return { cart, isLoading, isCheckoutDisabled, setIsCheckoutDisabled, setRefreshCounter };
};

export default useCart;

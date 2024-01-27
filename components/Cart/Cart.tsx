"use client";
import { getStoredCart } from "@/utilities/cart";
import {
    addCartItem,
    createCartWithItems,
    getCartById,
    removeCartItem,
    updateCartItem,
} from "@/utilities/shopify";
import CartBackdrop from "./CartBackdrop";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartItem from "./CartItem";
import CartLoading from "./CartLoading";
import CartSkeleton from "./CartSkeleton";
import { formatCurrency } from "@/utilities/currency";

export default function Cart() {
    const pathname = usePathname();
    const [cart, setCart] = useState<Cart>();
    const [refreshCounter, setRefreshCounter] = useState(0); //used as a callback to refresh on update/remove
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(false);

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

    const refreshCart = () => {
        setRefreshCounter((c) => c + 1);
    };

    const handleQuantityChange = () => {
        setIsCheckoutDisabled(true);
    };

    //need to make these scrollable
    const cartItems = cart?.lines.nodes.map((item, index) => {
        return (
            <CartItem
                key={index}
                cartId={cart.id}
                item={item}
                refreshCart={refreshCart}
                handleChange={handleQuantityChange}
            />
        );
    });

    return (
        <div className="z-50">
            <CartBackdrop />
            <div className="overflow-auto fixed right-0 top-0 w-full sm:w-3/4 md:w-2/4 2xl:w-1/4 p-4 h-screen bg-slate-900 shadow-lg text-gray-50">
                <div className="flex justify-between">
                    <p>Your Cart:</p>
                    <Link
                        href={pathname}
                        className="text-white font-bold py-2 px-4 border border-white hover:bg-white hover:text-black transition-colors"
                    >
                        Close
                    </Link>
                </div>

                {isLoading ? (
                    <>
                        <CartSkeleton count={getStoredCart().length} />
                        <CartLoading />
                    </>
                ) : (
                    <div className="overflow-auto">{cartItems}</div>
                )}

                {cart && (
                    <div className="flex flex-col justify-center px-10">
                        <div className="flex text-lg justify-between pt-6">
                            <div>Subtotal:</div>
                            <div>
                                {formatCurrency(cart.cost.subtotalAmount)}
                            </div>
                        </div>
                        <div className="flex text-gray-400 text-sm pb-6">
                            <div>Taxes and Shipping calculated at checkout</div>
                        </div>
                        <div className="flex justify-center text-lg pb-12">
                            {isCheckoutDisabled ? (
                                <button
                                    onClick={refreshCart}
                                    className="font-bold py-2 px-4 border transition-colors text-sand border-sand hover:text-gray-50 hover:bg-sand-hover hover:border-sand-hover"
                                >
                                    Update Cart
                                </button>
                            ) : (
                                <Link
                                    href={cart.checkoutUrl}
                                    className={`font-bold py-2 px-4 border transition-colors
                                        ${
                                            isCheckoutDisabled
                                                ? `text-gray-500 border-gray-500`
                                                : `text-greens-light border-greens-light hover:bg-greens-light hover:text-gray-50`
                                        }
                                    `}
                                    tabIndex={
                                        isCheckoutDisabled ? -1 : undefined
                                    }
                                    style={{
                                        pointerEvents: isCheckoutDisabled
                                            ? "none"
                                            : "auto",
                                    }}
                                >
                                    Checkout
                                </Link>
                            )}
                            {/* could make a really cool checkout button that shows
                            just the word "Checkout." where the . is a hole on 
                            green with a flag in it */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

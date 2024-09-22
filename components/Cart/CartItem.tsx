import { useEffect, useState } from "react";
import Image from "next/image";
import { getStoredCart, saveStoredCart } from "@/utilities/hooks/cart";
import { removeCartItem } from "@/utilities/shopify";
import { formatCurrency } from "@/utilities/currency";

export default function CartItem(props: {
    refreshCart: Function;
    handleChange: Function;
    cartId: string;
    item: LineItem;
}) {
    const item = props.item;
    const [quantity, setQuantity] = useState(0);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        setIsRemoving(false);
        setQuantity(item.quantity);
    }, [item.quantity]);

    const handleQuantityChange = (change: number) => {
        const newQuantity = Math.max(0, quantity + change);
        const cart = getStoredCart();
        const existingProduct = cart.find(
            (existingItem: StoredItem) =>
                existingItem.merchandiseId === item.merchandise.id
        );
        if (existingProduct) {
            existingProduct.quantity = newQuantity;
        } else {
            cart.push({
                merchandiseId: item.merchandise.id,
                quantity: newQuantity,
            });
        }
        saveStoredCart(cart);
        setQuantity(newQuantity);
        props.handleChange();
    };

    const handleRemoveInitial = () => {
        setIsRemoving(true);
    };

    const handleRemoveFromCart = async () => {
        const storedCart = getStoredCart();
        const updatedCart = storedCart.filter(
            (storedItem: StoredItem) =>
                storedItem.merchandiseId !== item.merchandise.id
        );
        saveStoredCart(updatedCart);

        try {
            const response = await removeCartItem(props.cartId, [item.id]);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
        setIsRemoving(false);
        props.refreshCart();
    };

    return (
        <div className="flex bg-slate-800 border-2 border-sand rounded p-4 m-2">
            <div className="w-1/3">
                <Image
                    src={item.merchandise.image.src}
                    height={128}
                    width={128}
                    alt={item.merchandise.title}
                    className="w-full h-auto"
                />
            </div>
            <div className="w-2/3 flex flex-col pl-4 p-2 justify-between">
                <div className="flex justify-between gap-4">
                    <h2 className="text-lg font-bold">
                        {item.merchandise.title}
                    </h2>
                    <p className="text-md">
                        {formatCurrency(item.cost.subtotalAmount)}
                    </p>
                </div>
                <div className="flex justify-end h-10">
                    {isRemoving ? (
                        <button
                            onClick={() => handleRemoveFromCart()}
                            className="flex items-center text-sand-hover bg-inherit p-3 border border-sand hover:text-gray-50 hover:bg-inherit hover:bg-sand-hover bg-slate-900"
                        >
                            <svg
                                className="text-greens-light"
                                width="20"
                                height="20"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m4.5 12.75 6 6 9-13.5"
                                />
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={() => handleRemoveInitial()}
                            className="flex items-center text-sand-hover bg-inherit p-3 border border-sand hover:text-gray-50 hover:bg-inherit hover:bg-sand-hover bg-slate-900"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-inherit"
                            >
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    )}

                    <div className="flex w-32 items-center border border-sand divide-x divide-sand bg-slate-900">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            className="w-full h-full focus:outline-none hover:bg-slate-700 "
                        >
                            &#8722;
                        </button>
                        <input
                            type="number"
                            className="w-full h-full focus:outline-none text-center bg-slate-900"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(
                                    Math.max(0, parseInt(e.target.value) || 0)
                                )
                            }
                            min="0"
                        />
                        <button
                            onClick={() => handleQuantityChange(1)}
                            className="w-full h-full px-0 focus:outline-none hover:bg-slate-700 "
                        >
                            &#43;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

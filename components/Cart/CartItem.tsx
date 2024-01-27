import { getStoredCart, saveStoredCart } from "@/utilities/cart";
import { formatCurrency } from "@/utilities/currency";
import { removeCartItem, updateCartItem } from "@/utilities/shopify";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CartItem(props: {
    refreshCart: Function;
    handleChange: Function;
    cartId: string;
    item: LineItem;
}) {
    const item = props.item;
    const [quantity, setQuantity] = useState(0);
    const [isRemoving, setIsRemoving] = useState(false);

    //Sets isAdded to show/hide remove button
    //Sets quantity to what is in local storage
    useEffect(() => {
        setIsRemoving(false);
        setQuantity(item.quantity);
    }, [item.quantity]);

    //Sets quantity on state change
    const handleQuantityChange = (change: number) => {
        const newQuantity = Math.max(0, quantity + change)
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
        setIsRemoving(true)
    }

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
        setIsRemoving(false)
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
                            {/* Check Mark */}
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
                            {/* Trash Can */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
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
                    {/* <button
                        onClick={() => handleUpdateCart()}
                        className="flex group items-center bg-slate-900 p-3 border border-sand text-gray-50 bg-sand hover:bg-sand-hover hover:border-sand-hover fill-sand-hover "
                    >
                        {isUpdating ? (
                            <svg
                                className="fill-sand-hover group-hover:fill-gray-50"
                                height="20"
                                width="20"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="2 0 24 24"
                                x="0px"
                                y="0px"
                            >
                                <g>
                                    <path d="M22.29,6.06A3,3,0,0,0,20,5H6V4A3,3,0,0,0,3,1H2A1,1,0,0,0,2,3H3A1,1,0,0,1,4,4V14a5,5,0,0,0,2.9,4.52,3,3,0,1,0,5.42.48h2.36a3,3,0,1,0,5.46-.39,3,3,0,0,0,1.49-2.12l1.33-8A3,3,0,0,0,22.29,6.06ZM10.5,20a1,1,0,1,1-1-1A1,1,0,0,1,10.5,20Zm7,1a1,1,0,1,1,1-1A1,1,0,0,1,17.5,21Zm2.15-4.84a1,1,0,0,1-1,.84H9a3,3,0,0,1-3-3V7H20a1,1,0,0,1,.76.35,1,1,0,0,1,.23.82Z" />
                                    <path d="M16.08,11h-1.5V9.5a1,1,0,0,0-2,0V11h-1.5a1,1,0,1,0,0,2h1.5v1.5a1,1,0,0,0,2,0V13h1.5a1,1,0,0,0,0-2Z" />
                                </g>
                                <desc
                                    x="0"
                                    y="39"
                                    fill="#000000"
                                    font-size="5px"
                                    font-weight="bold"
                                    font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
                                >
                                    Created by Arkinasi from the Noun Project
                                </desc>
                            </svg>
                        ) : (
                            <svg
                                className="fill-green-500"
                                width="20"
                                height="20"
                                clip-rule="evenodd"
                                fill-rule="evenodd"
                                stroke-linejoin="round"
                                stroke-miterlimit="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="m11.998 2.005c5.517 0 9.997 4.48 9.997 9.997 0 5.518-4.48 9.998-9.997 9.998-5.518 0-9.998-4.48-9.998-9.998 0-5.517 4.48-9.997 9.998-9.997zm-5.049 10.386 3.851 3.43c.142.128.321.19.499.19.202 0 .405-.081.552-.242l5.953-6.509c.131-.143.196-.323.196-.502 0-.41-.331-.747-.748-.747-.204 0-.405.082-.554.243l-5.453 5.962-3.298-2.938c-.144-.127-.321-.19-.499-.19-.415 0-.748.335-.748.746 0 .205.084.409.249.557z"
                                    fill-rule="nonzero"
                                />
                            </svg>
                        )}
                    </button> */}
                </div>
            </div>
        </div>
    );
}

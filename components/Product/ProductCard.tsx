"use client";
import { getStoredCart, saveStoredCart } from "@/utilities/cart";
import { SetStateAction, useEffect, useState } from "react";
import VariantCard from "./VariantCard";

export default function ProductCard(props: { product: Product }) {
    const [cartUpdateCount, setCartUpdateCount] = useState(0); //used to call useEffect
    const [quantity, setQuantity] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const product = props.product;
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
        product.variants.nodes[0]
    );

    //Sets isAdded to show/hide remove button
    //Sets quantity to what is in local storage
    useEffect(() => {
        const storedCart = getStoredCart();
        const productInCart = storedCart.find(
            (item: StoredItem) => item.merchandiseId === selectedVariant.id
        );

        if (productInCart) {
            setIsAdded(productInCart.quantity > 0);
            setQuantity(productInCart.quantity);
        } else {
            setIsAdded(false);
            setQuantity(0);
        }
    }, [cartUpdateCount, product.id, product.variants.nodes, selectedVariant]);

    //Sets quantity on state change
    const handleQuantityChange = (change: number) => {
        setQuantity((prev) => Math.max(0, prev + change));
    };

    const handleUpdateCart = () => {
        if (quantity === 0) {
            return;
        }

        const cart = getStoredCart();
        const existingProduct = cart.find(
            (item: StoredItem) => item.merchandiseId === selectedVariant.id
        );

        if (existingProduct) {
            existingProduct.quantity = quantity;
        } else {
            cart.push({
                merchandiseId: selectedVariant.id,
                quantity: quantity,
            });
        }

        saveStoredCart(cart);
        setCartUpdateCount(cartUpdateCount + 1);
    };

    const handleRemoveFromCart = () => {
        let cart = getStoredCart();
        cart = cart.filter(
            (item: StoredItem) => item.merchandiseId !== selectedVariant.id
        );

        saveStoredCart(cart);
        setCartUpdateCount(cartUpdateCount + 1);
    };

    const handleSelection = (color: string) => {
        const selection =
            product.variants.nodes.find(
                (variant) => variant.selectedOptions.at(0)?.value === color
            ) || product.variants.nodes[0];
        setSelectedVariant(selection);
    };

    const colorOptions = product.options.at(0)
        ? product.options.at(0)?.values.map((value, index, array) => {
              const isSelected =
                  selectedVariant?.selectedOptions.at(0)?.value === value;
              const isLastValue = index === array.length - 1;

              return (
                  <button
                      key={index}
                      onClick={() => handleSelection(value)}
                      className={`m-0 mb-2 px-2 py-0 border-y-2 border-sand
                      ${
                          isSelected
                              ? "bg-slate-800 text-sand hover:text-sand-hover hover:border-sand-hover"
                              : "bg-slate-900 text-gray-500 hover:text-gray-600 hover:border-sand-hover"
                      }
                      ${index === 0 ? "rounded-bl-lg border-l-2" : ""}
                      ${isLastValue ? "rounded-br-lg border-r-2" : ""}
                      ${index !== 0 && !isLastValue ? "border-x" : ""}`}
                  >
                      {value}
                  </button>
              );
          })
        : null;



    return (
        <div className="flex flex-col justify-between align z-10 bg-slate-900 relative shadow p-0 m-2 mb-12 max-w-[500px] rounded-[24px]">
            <div>
                <div className="bg-sand rounded-t-[26px]">
                    <VariantCard
                        handle={product.handle}
                        product={product}
                        variant={selectedVariant}
                    />
                </div>
                <div className="p-0">{colorOptions}</div>
            </div>

            <div className="flex justify-end h-12">
                {isAdded ? (
                    <>
                        <button
                            onClick={handleRemoveFromCart}
                            className="text-sand bg-inherit p-3 border border-sand hover:text-gray-50 hover:bg-inherit hover:bg-sand"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                                <line x1="4" y1="7" x2="20" y2="7" />{" "}
                                <line x1="10" y1="11" x2="10" y2="17" />{" "}
                                <line x1="14" y1="11" x2="14" y2="17" />{" "}
                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />{" "}
                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                        </button>
                        <div className="flex w-1/4 items-center border border-sand divide-x divide-sand text-gray-50">
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
                                        Math.max(
                                            0,
                                            parseInt(e.target.value) || 0
                                        )
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
                        <button
                            onClick={handleUpdateCart}
                            className="p-3 border border-sand text-gray-50 bg-sand hover:bg-sand-hover hover:border-sand-hover rounded-br-[24px]"
                        >
                            Update Cart
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex grow"></div>
                        <div className="flex w-1/4 items-center border border-sand divide-x divide-sand text-gray-50">
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
                                        Math.max(
                                            0,
                                            parseInt(e.target.value) || 0
                                        )
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
                        <button
                            onClick={handleUpdateCart}
                            className="p-3 border border-sand text-gray-50 bg-sand hover:bg-sand-hover hover:border-sand-hover rounded-br-[24px]"
                        >
                            Add to Cart
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

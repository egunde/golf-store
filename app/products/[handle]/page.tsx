'use client'

import { formatCurrency } from "@/utilities/currency";
import { getProductByHandle } from "@/utilities/shopify";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image'
import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";
import { getStoredCart, saveStoredCart } from "@/utilities/hooks/cart";

export default function ProductPage() {
    const handle = usePathname().substring(10);
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] =
        useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(0);
    const [cartUpdateCount, setCartUpdateCount] = useState(0); //used to call useEffect
    const [isAdded, setIsAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setIsLoading(true)
        if (handle) {
            getProductByHandle(handle).then((productData) => {
                setProduct(productData);
                if (productData) {
                    setSelectedVariant(productData.variants.nodes[0]);
                }
                setIsLoading(false)
            });
        }
    }, [handle]);

    useEffect(() => {
        if(selectedVariant) {
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
        }
    }, [cartUpdateCount, selectedVariant])

    if (!product || !selectedVariant || isLoading) {
        return <ProductDetailSkeleton />;
    }

    const handleSelection = (color: string) => {
        const selection =
            product.variants.nodes.find(
                (variant) => variant.selectedOptions.at(0)?.value === color
            ) || product.variants.nodes[0];
        setSelectedVariant(selection);
    };

    const colorOptions = product.options.at(0)?.values.map((value, index) => {
        return (
            <button
                key={index}
                onClick={() => handleSelection(value)}
                className={`bg-slate-900 px-2 py-0 m-1 text-s border border-sand ${
                    selectedVariant?.selectedOptions.at(0)?.value === value
                        ? "bg-gray-500 text-sand hover:text-sand-hover hover:border-sand-hover"
                        : "bg-gray-900 text-gray-500 hover:text-gray-600 hover:border-sand-hover"
                }`}
            >
                {value}
            </button>
        );
    });

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

    return (
        <div className="max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
            <div className="flex flex-wrap -mx-4">
                <div className="w-full mb-0 md:w-1/2 md:mb-0">
                    <div className="sticky top-0 z-5 overflow-hidden ">
                        <div className="relative mb-0 lg:mb-10 lg:h-2/4 ">
                            <Image
                                className="rounded-lg p-4"
                                src={selectedVariant.image.src}
                                width={500}
                                height={500}
                                alt={selectedVariant.title}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full px-4 md:w-1/2 text-gray-50">
                    <div className="lg:pl-20">
                        <div className="md:hidden mb-0 text-gray-200">
                            {colorOptions}
                            <div className="w-full border-t border-sand"></div>
                        </div>

                        <div className="mb-0">
                            <h2 className="max-w-xl mb-6 text-2xl font-bold md:text-4xl">
                                {product.title}
                            </h2>
                            <p className="inline-block mb-6 text-4xl font-bold ">
                                <span>
                                    {formatCurrency(selectedVariant.price)}
                                </span>
                                <span className="text-base font-normal text-gray-500 line-through text-gray-400">
                                    $1800.99
                                </span>
                            </p>
                            <div
                                className="md:block hidden"
                                dangerouslySetInnerHTML={{
                                    __html: product.descriptionHtml,
                                }}
                            />
                        </div>
                        <div className="md:block hidden mb-4 text-gray-200">
                            <h2 className="w-16 pb-1 mb-2 text-2xl font-bold border-b border-sand">
                                Colors
                            </h2>
                            {colorOptions}
                        </div>
                        <div className="w-36 mb-4 ">
                            <label className="w-full pb-1 text-xl font-semibold border-b border-sand">
                                Quantity
                            </label>
                            <div className="h-10 w-full relative flex flex-row mt-4 rounded-none divide-x divide-sand bg-slate-900 border border-sand">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="h-full w-full bg-inherit px-3 focus:outline-none hover:bg-slate-950"
                                >
                                    &#8722;
                                </button>
                                <input
                                    type="number"
                                    className="h-full w-14 bg-inherit p-0 text-center focus:outline-none"
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
                                    className="h-full w-full bg-inherit px-3 focus:outline-none hover:bg-slate-950"
                                >
                                    &#43;
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            {isAdded ? (
                                <>
                                    <button
                                        onClick={handleUpdateCart}
                                        className="py-4 px-6 text-gray-50 font-bold border border-sand bg-sand hover:bg-sand-hover transition-colors"
                                    >
                                        Update Cart
                                    </button>
                                    <button
                                        onClick={handleRemoveFromCart}
                                        className="py-4 px-6 text-sand hover:text-gray-50 font-bold border border-sand hover:bg-sand-hover transition-colors"
                                    >
                                        Remove from Cart
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleUpdateCart}
                                    className="py-4 px-6 text-gray-50 font-bold border border-sand bg-sand hover:bg-sand-hover transition-colors"
                                >
                                    Add to cart
                                </button>
                            )}
                        </div>
                        <div
                            className="md:hidden mt-8"
                            dangerouslySetInnerHTML={{
                                __html: product.descriptionHtml,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

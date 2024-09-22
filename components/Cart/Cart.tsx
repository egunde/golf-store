import { useEffect, useCallback } from "react";
import { formatCurrency } from "@/utilities/currency";
import useCart, { getStoredCart } from "@/utilities/hooks/cart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../Logo";
import CartBackdrop from "./CartBackdrop";
import CartItem from "./CartItem";
import CartLoading from "./CartLoading";
import CartSkeleton from "./CartSkeleton";
import debounce from "@/utilities/debounce";

export default function Cart() {
    const pathname = usePathname();
    const {
        cart,
        isLoading,
        isCheckoutDisabled,
        setIsCheckoutDisabled,
        setRefreshCounter,
    } = useCart();

    const refreshCart = useCallback(() => {
        setRefreshCounter((c) => c + 1);
    }, [setRefreshCounter]);

    const handleQuantityChange = useCallback(() => {
        setIsCheckoutDisabled(true);
        const debouncedFunction = debounce(() => {
            refreshCart();
            setIsCheckoutDisabled(false);
        }, 1000);
        debouncedFunction();
    }, [refreshCart, setIsCheckoutDisabled]);

    const cartItems = cart?.lines.nodes.map((item, index) => (
        <CartItem
            key={index}
            cartId={cart.id}
            item={item}
            refreshCart={refreshCart}
            handleChange={handleQuantityChange}
        />
    ));

    return (
        <div className="z-50">
            <CartBackdrop />
            <div className="overflow-auto fixed right-0 top-0 w-full sm:w-3/4 md:w-2/4 2xl:w-1/4 p-4 h-screen bg-slate-900 shadow-lg text-gray-50">
                <div className="flex justify-between px-2 mb-2">
                    <Link href="/">
                        <Logo height="50" />
                    </Link>
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
                                    className={`font-bold py-2 px-4 border transition-colors ${
                                        isCheckoutDisabled
                                            ? "text-gray-500 border-gray-500"
                                            : "text-greens-light border-greens-light hover:bg-greens-light hover:text-gray-50"
                                    }`}
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
                        </div>

                        <p className="text-sm">
                            To checkout, you will need to enter a password:
                            colorstrike. After that, you can return to this site
                            and the checkout button will redirect to your
                            checkout page.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client'

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Cart from "./Cart/Cart";
import Logo from "./Logo";

export default function Navbar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const showCart = searchParams.get("showCart") === "true";
    const cartLinkHref = `${pathname}?showCart=true`;

    return (
        <nav className="sticky top-0 z-20 bg-slate-900 text-white text-2xl py-2 px-8 md:px-32 lg:px-96 flex justify-center items-center">
            <Link href="/">
                <Logo height="50" />
            </Link>
            <div
                className="w-1/3"
            />
            <Link href={cartLinkHref}>
                Cart
            </Link>
            {showCart && <Cart />}
        </nav>
    );
}
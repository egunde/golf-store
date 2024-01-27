'use client'

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Cart from "./Cart/Cart";

export default function Navbar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const showCart = searchParams.get("showCart") === "true";
    const cartLinkHref = `${pathname}?showCart=true`;

    return (
        <nav className="sticky w-full top-0 z-20 bg-slate-900 text-white text-2xl p-4 px-96 flex justify-between">
            <Link href="/" className="mx-4">
                Products
            </Link>
            <Link href={cartLinkHref}>Cart</Link>
            {showCart && <Cart />}
        </nav>
    );
}

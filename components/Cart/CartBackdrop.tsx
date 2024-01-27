import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CartBackdrop() {
    const pathname = usePathname();
    return <Link className="fixed inset-0 bg-black bg-opacity-50" href={pathname} />;
}

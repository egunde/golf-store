import ProductCard from "@/components/Product/ProductCard";
import { getAllProducts } from "@/utilities/shopify";

const getProducts = async () => {
    try {
        const product = await getAllProducts();
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
};

export default async function ProductPage() {
    const products = await getProducts();
    const productCards = products?.map((product, index) => (
        <ProductCard key={index} product={product} />
    ));

    return (
        <div className="flex flex-col md:flex-row md:justify-center gap-2">
            {productCards}
        </div>
    );
}

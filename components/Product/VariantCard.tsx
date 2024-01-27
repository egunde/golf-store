import { formatCurrency } from '@/utilities/currency';
import Image from 'next/image'

export default function VariantCard(props: { handle: string, product: Product, variant: ProductVariant | undefined }) {
    const variant = props.variant;
    const product = props.product;
    
    
    if(!variant) {
        return (
            <>
            </>
        )
    }

    return (
        <div className="p-0">
            <a href={`/products/${props.handle}`}>
                <div className="flex justify-between text-2xl px-4 pt-4 pb-1 text-white bg-slate-900 rounded-t-[24px]">
                    <h1 className="">
                        {product.title}: {variant.title}
                    </h1>
                    <p className="">{formatCurrency(variant.price)}</p>
                </div>
                <Image
                    className="rounded-bl-[24px]"
                    src={variant.image.src}
                    width={500}
                    height={500}
                    alt={variant.title}
                />
            </a>
        </div>
    );
}
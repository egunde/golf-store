type Cart = {
    id: string;
    createdAt: string;
    updatedAt: string;
    checkoutUrl: string;
    lines: {
        nodes: LineItem[];
    };
    cost: {
        totalAmount: Price;
        subtotalAmount: Price;
    };
};

type CartContentProps = {
    onClose: () => void;
};

type CartAddItem = {
    merchandiseId: string;
    quantity: number;
};

type CartUpdateItem = {
    id: string;
    merchandiseId: string;
    quantity: number;
};

type CartProps = {
    isOpen: boolean;
    onClose: () => void;
};

type CartModalProps = {
    items: StoredCart;
    cartId: string | null;
};

type LineItem = {
    id: string;
    quantity: number;
    cost: {
        subtotalAmount: Price
    }
    merchandise: {
        id: string;
        title: string;
        image: {
            id: string;
            src: string;
        };
    };
};

type Price = {
    amount: number;
    currencyCode: string;
}

type Product = {
    id: string;
    title: string;
    descriptionHtml: string;
    handle: string;
    options: {
        id: string;
        name: string;
        values: string[]
    }[]
    variants: {
        nodes: ProductVariant[];
    };
};

type ProductVariant = {
    id: string;
    title: string;
    image: {
        id: string;
        src: string;
    };
    price: Price;
    selectedOptions: {
        name: string;
        value: string;
    }[];
};

type SearchParamProps = {
    searchParams: Record<string, string> | null | undefined;
};

type ShopifyQuery = {
    query: string;
    variables?: Record<string, any>;
};

type StoredCart = StoredItem[];

type StoredItem = {
    merchandiseId: string;
    quantity: number;
};

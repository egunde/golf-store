/**
 * Posts a GraphQL query to the Shopify API.
 * Requires Shopify store domain and access token set as environment variables.
 *
 * @param {ShopifyQuery} { query, variables } - The GraphQL query and optional variables.
 * @returns An object containing the HTTP status and either the response body or an error message.
 */
export async function shopifyFetch({ query, variables }: ShopifyQuery) {
    const endpoint = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const key = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!endpoint || !key) {
        console.error("Shopify environment variables are not set.");
        return {
            status: 500,
            error: "Shopify configuration is missing",
        };
    }

    try {
        const result = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": key,
            },
            body: { query, variables } && JSON.stringify({ query, variables }),
        });

        return {
            status: result.status,
            body: await result.json(),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            status: 500,
            error: "Error receiving data",
        };
    }
}

//If changing fields, make sure to update Product type
const productFields = `
    id
    title
    descriptionHtml
    handle
    options(first: 10) {
        id
        name
        values
    }
    variants(first: 10) {
        nodes {
            id
            title
            price {
                amount
                currencyCode
            }
            selectedOptions {
                name
                value
            }
            image {
                id
                src
            }
        }
    }`;

/**
 * Fetches a list of products from the Shopify API.
 * Each product's data includes its id, title, and description.
 * The function returns a simplified array of product objects.
 */
export async function getAllProducts() {
    const response = await shopifyFetch({
        query: `{
            products(first: 10) {
                nodes {
                    ${productFields}
                }
            }
        }`,
    });

    const products: Product[] = response.body.data.products.nodes
    return products;
}

export async function getProductByHandle(handle: string) {
    const response = await shopifyFetch({
        query: `{
            productByHandle(handle: "${handle}") {
                ${productFields}
            }
        }`,
    });

    const product: Product = response.body.data.productByHandle;
    return product;
}

//If changing fields, make sure to update Cart type
const cartFields = `
    id
    createdAt
    updatedAt
    checkoutUrl
    lines(first: 10) {
        nodes {
            id
            quantity
            cost {
                subtotalAmount {
                    amount
                    currencyCode
                }
            }
            merchandise {
                ... on ProductVariant {
                    id
                    title
                    image {
                        src
                        id
                    }
                }
            }
        }
    }
    cost {
        totalAmount {
            amount
            currencyCode
        }
        subtotalAmount {
            amount
            currencyCode
        }
    }`;

export async function createCartWithItems(products: StoredItem[]) {
    const response = await shopifyFetch({
        query: `
        mutation createCart($cartInput: CartInput)
        {
            cartCreate(input: $cartInput) {
                cart {
                    ${cartFields}
                } 
            }
        }`,
        variables: {
            cartInput: {
                lines: products,
            },
        },
    });

    return response.body.data.cartCreate.cart;
}

export async function getCartById(id: string) {
    const response = await shopifyFetch({
        query: `
        {
            cart(id: ${id}) {
                ${cartFields}
            }
        }
    `,
    });

    return response.body.data.cart;
}

export async function updateCartItem(cartId: string, items: CartUpdateItem[]) {
    const response = await shopifyFetch({
        query: `
        mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!)
        {
            cartLinesUpdate(cartId: $cartId, lines: $lines) {
                cart {
                    ${cartFields}
                }
            }
        }`,
        variables: {
            cartId: cartId,
            lines: items,
        },
    });

    return response.body.data.cartLinesUpdate.cart;
}

export async function removeCartItem(cartId: string, lineIds: string[]) {
    const response = await shopifyFetch({
        query: `
        mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
            cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                cart {
                    ${cartFields}
                }
            }
        }`,
        variables: {
            cartId: cartId,
            lineIds: lineIds,
        },
    });

    //console.log(response);
    return response.body.data.cartLinesRemove.cart;
}

export async function addCartItem(cartId: string, items: CartAddItem[]) {
    const response = await shopifyFetch({
        query: `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) 
        {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
                cart {
                    ${cartFields}
                }
            }
        }`,
        variables: {
            cartId: cartId,
            lines: items,
        },
    });

    return response.body.data.cartLinesAdd.cart;
}

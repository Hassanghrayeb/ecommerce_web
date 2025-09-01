
export interface ProductModel {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
}

export interface CartItemModel {
    id: number; 
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
}

export interface CartModel {
    userId: number; 
    id: number;
    items: CartItemModel[];
}
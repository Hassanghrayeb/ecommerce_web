export interface OrderModel {
    userId?: number;
    status?: string;
    total?: number;
    currency?: string;
    items?: OrderItemModel[];
}

export interface OrderItemModel {
    productId?: number;
    productName?: string;
    name?: string;
    unitPrice?: number;
    quantity?: number;
    lineTotal?: number;
    currency?: string
}
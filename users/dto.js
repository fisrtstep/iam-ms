export function toUserDto(row) {
    return {
        id: row.id,
        email: row.email,
        displayName: row.full_name,
        role: row.role,
        ...(row.orders_count !== undefined && { ordersCount: row.orders_count, lastOrderAt: row.last_order_at }),
    };
}

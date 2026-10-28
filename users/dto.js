export function toUserDto(row) {
    return {
        id: row.id,
        email: row.email,
        fullName: row.display_name,
        role: row.role,
        ...(row.orders_count !== undefined && { ordersCount: row.orders_count, lastOrderAt: row.last_order_at }),
    };
}

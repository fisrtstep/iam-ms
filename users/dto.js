export function toUserDto(row) {
    return {
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        role: row.role,
    };
}

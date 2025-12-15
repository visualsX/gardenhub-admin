export const buildCouponWhereClause = ({ searchTerm, selectedStatus }) => {
    const conditions = [];

    if (searchTerm) {
        conditions.push({
            or: [
                { code: { contains: searchTerm } },
                { name: { contains: searchTerm } },
            ],
        });
    }

    if (selectedStatus === 'active') {
        conditions.push({ isActive: { eq: true } });
    } else if (selectedStatus === 'inactive') {
        conditions.push({ isActive: { eq: false } });
    }

    return conditions.length > 0 ? { and: conditions } : null;
};

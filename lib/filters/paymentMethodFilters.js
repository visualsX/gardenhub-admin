export const buildPaymentMethodWhereClause = ({ searchTerm }) => {
    const conditions = [];

    if (searchTerm) {
        conditions.push({
            or: [{ name: { contains: searchTerm } }, { code: { contains: searchTerm } }],
        });
    }

    if (conditions.length === 0) return null;

    return {
        and: conditions,
    };
};

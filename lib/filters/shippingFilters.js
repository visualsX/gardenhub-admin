export const buildShippingWhereClause = ({ searchTerm, selectedEmirate }) => {
    const conditions = [];

    if (searchTerm) {
        conditions.push({ name: { contains: searchTerm } });
    }

    if (selectedEmirate) {
        conditions.push({ countryCodes: { contains: selectedEmirate } });
    }

    if (conditions.length === 0) return null;

    return {
        and: conditions
    };
};

export const transformVariantData = (variants) => {
  if (!variants || !Array.isArray(variants)) return [];

  return variants.map((variant) => {
    const isColor = variant.type === 'color';
    // 0 for Text, 1 for Color
    const type = isColor ? 1 : 0;
    
    let values = [];

    if (isColor && Array.isArray(variant.colors)) {
      values = variant.colors.map((c) => ({
        value: c.name,
        colorHex: c.hex,
      }));
    } else if (!isColor && variant.values) {
      // Split comma-separated values
      values = variant.values
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => ({
          value: v,
          colorHex: null,
        }));
    }

    return {
      name: variant.name,
      type: type,
      values: values,
    };
  });
};

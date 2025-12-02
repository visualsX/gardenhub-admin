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

export const mapOptionsToForm = (apiOptions) => {
  if (!apiOptions || !Array.isArray(apiOptions)) return [];

  return apiOptions.map((opt) => {
    const isColor = opt.type === 'Color';
    
    if (isColor) {
      return {
        name: opt.name,
        type: 'Color',
        colors: opt.values?.map((v) => ({
          name: v.value,
          hex: v.colorHex,
        })) || [],
      };
    } else {
      return {
        name: opt.name,
        type: 'Text',
        values: opt.values?.map((v) => v.value).join(', ') || '',
      };
    }
  });
};

export const mapVariantsToForm = (apiVariants) => {
  if (!apiVariants || !Array.isArray(apiVariants)) return [];

  return apiVariants.map((variant) => {
    // Construct variant name from option values if not present
    const variantName = variant.optionValues
      ?.map((ov) => ov.value)
      .join(', ');

    return {
      ...variant,
      name: variantName,
      // Ensure optionValues are in the format expected by the form/payload if needed
      // The form generation uses { key, value }, API has { name, value }
      optionValues: variant.optionValues?.map((ov) => ({
        key: ov.name,
        value: ov.value,
      })) || [],
    };
  });
};

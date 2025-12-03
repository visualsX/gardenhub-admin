export const transformVariantData = (variants) => {
  if (!variants || !Array.isArray(variants)) return [];

  return variants.map((variant) => {
    const isColor = variant.type === 'Color';
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

export const transformVariantDataForUpdate = (variants) => {
  if (!variants || !Array.isArray(variants)) return [];

  return variants.map((variant) => {
    const isColor = variant.type === 'Color';
    // 0 for Text, 1 for Color
    const type = isColor ? 1 : 0;

    let values = [];

    if (isColor && Array.isArray(variant.colors)) {
      values = variant.colors.map((c) => ({
        id: c.id || null, // Preserve ID if exists
        value: c.name,
        colorHex: c.hex,
      }));
    } else if (!isColor && variant.values) {
      // For text type, values is a comma-separated string
      if (typeof variant.values === 'string') {
        // Split the current values
        const currentValues = variant.values
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean);
        
        // Check if we have original values with IDs
        const originalValuesWithIds = variant._valuesWithIds || [];
        
        // Create a map of value -> id from original values
        const valueIdMap = new Map();
        originalValuesWithIds.forEach(v => {
          valueIdMap.set(v.value, v.id);
        });
        
        // Map current values, preserving IDs where possible
        values = currentValues.map((val) => ({
          id: valueIdMap.get(val) || null, // Use existing ID if value matches, otherwise null
          value: val,
          colorHex: null,
        }));
      } else if (Array.isArray(variant.values)) {
        // Array of value objects (fallback, shouldn't normally happen)
        values = variant.values.map((v) => ({
          id: v.id || null,
          value: v.value,
          colorHex: null,
        }));
      }
    }

    return {
      id: variant.id || null, // Preserve option ID if exists
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
        id: opt.id, // Preserve option ID
        name: opt.name,
        type: 'Color',
        colors:
          opt.values?.map((v) => ({
            id: v.id, // Preserve value ID
            name: v.value,
            hex: v.colorHex,
          })) || [],
      };
    } else {
      return {
        id: opt.id, // Preserve option ID
        name: opt.name,
        type: 'Text',
        // Convert array to comma-separated string for form display
        values: opt.values?.map((v) => v.value).join(', ') || '',
        // Keep original values array with IDs for reference
        _valuesWithIds: opt.values || [],
      };
    }
  });
};

export const mapVariantsToForm = (apiVariants) => {
  if (!apiVariants || !Array.isArray(apiVariants)) return [];

  return apiVariants.map((variant) => {
    // Construct variant name from option values if not present
    const variantName = variant.optionValues?.map((ov) => ov.value).join(', ');

    return {
      ...variant,
      id: variant.id, // Explicitly preserve variant ID
      name: variantName,
      // Preserve optionValue IDs
      optionValues:
        variant.optionValues?.map((ov) => ({
          id: ov.id, // Preserve optionValue ID
          name: ov.name,
          value: ov.value,
        })) || [],
    };
  });
};

/**
 * Generate all possible combinations from options
 * @param {Array} options - Array of option objects with name and either colors or values
 * @returns {Array} Array of variant combinations
 */
export const generateCombinations = (options) => {
  if (!options || !Array.isArray(options) || options.length === 0) {
    return [];
  }

  // Parse options to get all values
  const parsedOptions = options
    .map((opt) => {
      let values = [];

      if (opt.type === 'Color' && Array.isArray(opt.colors)) {
        values = opt.colors.map((c) => c.name);
      } else if (opt.type === 'Text' && opt.values) {
        // Split comma-separated values
        values = opt.values
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean);
      }

      return {
        name: opt.name,
        values: values,
      };
    })
    .filter((opt) => opt.values.length > 0);

  if (parsedOptions.length === 0) {
    return [];
  }

  // Generate combinations recursively
  const combine = (arrays) => {
    if (arrays.length === 0) return [[]];
    const [first, ...rest] = arrays;
    const restCombinations = combine(rest);

    return first.flatMap((value) => restCombinations.map((combination) => [value, ...combination]));
  };

  const valueArrays = parsedOptions.map((opt) => opt.values);
  const combinations = combine(valueArrays);

  // Map combinations to variant objects
  return combinations.map((combo) => {
    const optionValues = combo.map((value, idx) => ({
      name: parsedOptions[idx].name,
      value: value,
    }));

    return {
      name: combo.join(', '),
      sku: '',
      price: 0,
      salePrice: 0,
      stockQuantity: 0,
      trackInventory: false,
      optionValues: optionValues,
    };
  });
};

/**
 * Merge existing variants with new combinations
 * @param {Array} existingVariants - Current variants
 * @param {Array} newCombinations - New combinations to add
 * @param {string} mainSku - Main product SKU for generating variant SKUs
 * @returns {Array} Merged variants
 */
export const mergeVariants = (existingVariants, newCombinations, mainSku = '') => {
  if (!Array.isArray(newCombinations)) return existingVariants || [];

  const existing = Array.isArray(existingVariants) ? existingVariants : [];

  // Create a map of existing variants by their name
  const existingMap = new Map();
  existing.forEach((variant) => {
    if (variant.name) {
      existingMap.set(variant.name, variant);
    }
  });

  // Create a set of new combination names for tracking
  const newCombinationNames = new Set(newCombinations.map(v => v.name));

  // Merge: keep existing data if variant already exists, otherwise add new
  const merged = newCombinations.map((newVariant) => {
    const existingVariant = existingMap.get(newVariant.name);

    if (existingVariant) {
      // Keep existing variant data but update optionValues
      return {
        ...existingVariant,
        optionValues: newVariant.optionValues,
      };
    } else {
      // Generate SKU for new variant
      const skuSuffix = newVariant.optionValues
        .map((opt) => opt.value.toUpperCase().replace(/\s+/g, '-'))
        .join('-');

      return {
        ...newVariant,
        sku: mainSku ? `${mainSku}-${skuSuffix}` : skuSuffix,
      };
    }
  });

  // Add manually created variants that don't match any generated combination
  const manualVariants = existing.filter(variant => !newCombinationNames.has(variant.name));
  
  // Return manual variants first (at the top), then generated variants
  return [...manualVariants, ...merged];
};

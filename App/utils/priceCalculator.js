
// Purity multipliers based on Karat value
const PURITY_MULTIPLIERS = {
    24: 1.0,
    22: 0.916,
    18: 0.75,
    14: 0.585
};

// Business Logic Constants
const IMPORT_DUTY = 0.10; // 10%
const GST_TAX = 0.03;      // 3%

export const calculateProductPrice = (product, metalRates) => {
    // 1. Safety Check: If no rates or essential product data, fallback to base price
    if (!metalRates || !product?.metal_type || !Array.isArray(metalRates)) {
        return product?.price || 0;
    }

    // 2. Find matching metal rate
    const metalData = metalRates.find(r =>
        r.metal_type?.toLowerCase() === product.metal_type?.toLowerCase()
    );

    const activeRate = metalData?.rate_per_gm_24k || 0;

    // 3. Extract attributes safely (Handling array or direct value)
    const purity = Array.isArray(product.purity) ? product.purity[0] : (product.purity || 22);
    const weight = Array.isArray(product.weight) ? product.weight[0] : (product.weight || 0);

    // 4. Determine Purity Multiplier
    const multiplier = PURITY_MULTIPLIERS[purity] || (purity / 24);

    // 5. Short-circuit if calculation is impossible
    if (weight === 0 || activeRate === 0) {
        return product.price || 0;
    }

    // 6. Calculation logic with business tax rules
    const metalValue = activeRate * multiplier * weight;
    const priceWithDuty = metalValue * (1 + IMPORT_DUTY);
    const finalTotal = priceWithDuty * (1 + GST_TAX);

    // Return rounded integer for clean UI
    return Math.round(finalTotal);
};
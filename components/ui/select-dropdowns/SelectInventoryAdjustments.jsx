import { FormSelect } from '../inputs';

const inventoryAdjustmentOptions = [
  // { label: 'Sale', value: 'Sale' },
  { label: 'CustomerReturn', value: 'CustomerReturn' },
  { label: 'StockReplenishment', value: 'StockReplenishment' },
  { label: 'DamageOrLoss', value: 'DamageOrLoss' },
  { label: 'ManualCorrection', value: 'ManualCorrection' },
];

export default function SelectInventoryAdjustments({
  name = 'adjustmentType',
  label = 'Inventory Adjustment Type',
}) {
  return (
    <FormSelect
      label={label}
      name={name}
      placeholder="Select type"
      options={inventoryAdjustmentOptions}
    />
  );
}

import { CURRENCY } from '@/lib/const/variable.global';
import Tx from '../shared/tx';

export default function LabelAndValue({
  label = 'label',
  value = 'value for label',
  currency = false,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold">
        <Tx>{label}</Tx>
      </label>
      <div className="text-[#2D3748]/50">{currency ? value + CURRENCY : value}</div>
    </div>
  );
}

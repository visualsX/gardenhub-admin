import Tx from '../shared/tx';

export default function LabelAndValue({ label = 'label', value = 'value for label' }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold">
        <Tx>{label}</Tx>
      </label>
      <p className="text-[#2D3748]/50">{value}</p>
    </div>
  );
}

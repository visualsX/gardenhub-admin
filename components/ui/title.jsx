import Tx from '../shared/tx';

export default function Title({ title = 'title', description = '' }) {
  return (
    <div className="space-y-1 pb-5">
      <h3 className="text-lg font-semibold">
        <Tx>{title}</Tx>
      </h3>
      {description && (
        <p className="text-sm text-[#6B7280]">
          <Tx>{description}</Tx>
        </p>
      )}
    </div>
  );
}

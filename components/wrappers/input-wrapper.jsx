export default function InputWrapper({ title, desc, children }) {
  return (
    <div className="mb-8 flex items-center justify-between rounded-lg border border-gray-200 p-4">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      {children}
    </div>
  );
}

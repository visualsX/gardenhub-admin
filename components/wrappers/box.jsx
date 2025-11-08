import Title from '../ui/title';

export function Box({ children, header = false, extra, title, description }) {
  return (
    <div className="border-smoke-light rounded-2xl border bg-white p-6">
      {header && (
        <div className="flex items-center justify-between">
          <Title title={title} description={description} />
          {extra}
        </div>
      )}
      {children}
    </div>
  );
}

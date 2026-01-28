import InputSearch from '@/components/ui/input-search';

export default function PaymentMethodFilters({ searchTerm, onSearchChange }) {
  return (
    <div className="border-with-radius flex flex-col items-center gap-4 p-6 md:flex-row">
      <div className="w-full flex-1 md:w-auto">
        <InputSearch
          placeholder="Search by Payment Method Name or Code"
          defaultValue={searchTerm}
          onSearchChange={onSearchChange}
        />
      </div>
    </div>
  );
}

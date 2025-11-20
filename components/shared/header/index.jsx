import Image from 'next/image';

const Header = () => {
  return (
    <header className="border-smoke-light fixed top-0 right-0 left-[263px] z-40 flex h-16 items-center justify-end border-b bg-transparent px-6 backdrop-blur-[3px]">
      <section className="flex items-center gap-x-10">
        <Image src={'/shared/bell.svg'} width={20} height={20} alt="bell-icon" />
        <main className="flex items-center gap-x-2">
          <div className="bg-primary grid h-9 w-9 place-items-center rounded-full">
            <Image src={'/shared/user-white.svg'} width={20} height={20} alt="bell-icon" />
          </div>
          <div className="grid">
            <span className="text-sm">Admin User</span>
            <span className="text-xs text-gray-500">admin@gardenhub.com</span>
          </div>
        </main>
      </section>
    </header>
  );
};

export default Header;

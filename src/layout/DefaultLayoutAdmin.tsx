interface LayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayoutAdmin({ children }: LayoutProps) {
  return (
    <div>
      <nav className="fixed top-0 z-10 flex justify-center w-full h-16 p-1 bg-primary">
        <img
          src="../assets/logo.svg"
          alt="Logo"
          draggable={false}
          className="h-full"
        />
      </nav>

      <main className="pt-20">
        <div>{children}</div>
      </main>
    </div>
  );
}

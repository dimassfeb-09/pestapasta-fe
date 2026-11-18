import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 z-50 flex items-center justify-center w-full h-14 bg-white/95 backdrop-blur border-b border-gray-100">
        <img
          src="/assets/logo.svg"
          alt="PestaPasta"
          draggable={false}
          className="h-9"
        />
      </nav>

      {/* Main Content */}
      <main className="pt-14">
        {/* Content for Mobile Devices */}
        <div className="block sm:hidden">{children}</div>

        {/* Content for Non-Mobile Screens */}
        <div className="hidden w-full min-h-screen bg-canvas sm:flex sm:flex-col sm:items-center sm:justify-center px-6">
          <div className="max-w-sm text-center">
            <div className="text-lg font-semibold text-ink">
              Hanya tersedia di perangkat mobile.
            </div>
            <p className="mt-2 text-sm text-muted">
              Buka halaman ini dari ponsel Anda untuk memesan.
            </p>
          </div>
        </div>
      </main>

      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        style={{ top: "3.5rem", padding: "0 8px" }}
      />
    </div>
  );
}

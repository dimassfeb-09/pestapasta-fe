import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: LayoutProps) {
  return (
    <div>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 z-50 flex justify-center w-full h-16 p-1 bg-primary">
        <img
          src="assets/logo.svg"
          alt="Logo"
          draggable={false}
          className="h-full"
        />
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {/* Content for Mobile Devices */}
        <div className="block sm:hidden">{children}</div>

        {/* Content for Non-Mobile Screens */}
        <div className="hidden w-full h-screen bg-gray-100 sm:flex sm:flex-col sm:items-center sm:justify-center">
          <div className="mt-4 text-lg font-semibold text-gray-600">
            Only mobile devices.
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
        className="translate-y-10" // This moves the toast container down
        style={{
          top: "1em", // Adjust top position as needed
          padding: "0px 5px",
        }}
      />
    </div>
  );
}

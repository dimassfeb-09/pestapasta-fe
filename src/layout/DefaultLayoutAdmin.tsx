import { Logout, Menu, Close } from "@mui/icons-material";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayoutAdmin({ children }: LayoutProps) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const access_token = Cookies.get("access_token");
  const [isNavBarActive, setIsNavBarActive] = useState<boolean>(false);

  useEffect(() => {
    if (access_token) {
      const decoded = jwtDecode(access_token);
      const expiryDate = new Date(decoded.exp! * 1000);
      const date = new Date();
      if (date.getTime() > expiryDate.getTime()) {
        setIsLoggedIn(false);
        Cookies.remove("access_token");
        toast.warning("Silahkan login kembali.");
        return;
      }
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    if (!isLoggedIn && !access_token) {
      navigate("/admin/login");
    }
  }, [access_token]);

  const handleLogout = () => {
    Cookies.remove("access_token");
    setIsLoggedIn(false);
    navigate("/admin/login");
  };

  const navLinks = [
    { to: "/admin/transaction", label: "Transaksi" },
    { to: "/admin/product", label: "Menu" },
    { to: "/admin/categories", label: "Kategori" },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <nav className="fixed top-0 z-50 w-full h-14 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between h-full px-4 mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="sm:hidden text-ink"
              onClick={() => setIsNavBarActive(!isNavBarActive)}
              aria-label="Menu"
            >
              {isNavBarActive ? <Close /> : <Menu />}
            </button>
            <img
              src="/assets/logo.svg"
              alt="PestaPasta Admin"
              draggable={false}
              className="h-8"
            />
          </div>

          {isLoggedIn && (
            <div className="hidden sm:flex items-center gap-6">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm font-medium text-ink hover:text-primary transition"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primaryDark transition"
            >
              <Logout fontSize="small" />
              Keluar
            </button>
          )}
        </div>

        {isNavBarActive && isLoggedIn && (
          <div className="sm:hidden absolute left-0 top-14 w-full bg-white border-b border-gray-100 shadow-soft">
            <div className="flex flex-col p-4 gap-3">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setIsNavBarActive(false)}
                  className="text-sm font-medium text-ink hover:text-primary transition"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-14">
        <div className="px-4 py-6 mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

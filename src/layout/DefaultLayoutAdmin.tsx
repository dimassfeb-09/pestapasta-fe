import { Logout, Menu } from "@mui/icons-material";
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

    if (!isLoggedIn) {
      navigate("/admin/login");
    }
  }, [access_token]);

  const handleLogout = () => {
    Cookies.remove("access_token");
    setIsLoggedIn(false);
    navigate("/admin/login");
  };

  return (
    <div>
      <nav className="fixed top-0 z-50 flex justify-center w-full h-16 p-1 bg-primary">
        <div className="flex items-center justify-between w-full mx-3 lg:mx-20">
          <div
            className="sm:hidden text-white"
            onClick={() => setIsNavBarActive(!isNavBarActive)}
          >
            <Menu />
          </div>

          <img
            src="/assets/logo.svg"
            alt="Logo"
            draggable={false}
            className="h-full"
          />

          {isLoggedIn && (
            <div>
              <div className="hidden sm:block">
                <div className="flex font-bold text-white gap-14">
                  <Link to="/admin/transaction">Transaksi</Link>
                  <Link to="/admin/product">Menu</Link>
                  <Link to="/admin/categories">Category</Link>
                </div>
              </div>

              {isNavBarActive && (
                <div className="absolute left-0 top-16 bg-primary w-full block sm:hidden">
                  <div className="flex flex-col font-bold text-white gap-10 p-5">
                    <Link
                      to="/admin/transaction"
                      onClick={() => setIsNavBarActive(false)}
                    >
                      Transaksi
                    </Link>
                    <Link
                      to="/admin/product"
                      onClick={() => setIsNavBarActive(false)}
                    >
                      Menu
                    </Link>
                    <Link
                      to="/admin/categories"
                      onClick={() => setIsNavBarActive(false)}
                    >
                      Category
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {isLoggedIn && (
            <div>
              <div
                onClick={handleLogout}
                className="flex items-center gap-3 px-2 py-1 text-white bg-red-400 border rounded cursor-pointer"
              >
                <div className="text-sm">Keluar</div>
                <Logout />
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-20">
        <div>{children}</div>
      </main>
    </div>
  );
}

import { Logout } from "@mui/icons-material";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayoutAdmin({ children }: LayoutProps) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const access_token = Cookies.get("access_token");

  useEffect(() => {
    if (access_token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [access_token]);

  const handleLogout = () => {
    Cookies.remove("access_token");
    setIsLoggedIn(false);
    navigate("/admin/login");
  };

  return (
    <div>
      <nav className="fixed top-0 z-10 flex justify-center w-full h-16 p-1 bg-primary">
        <div className="flex items-center justify-between w-full mx-20">
          <img
            src="../assets/logo.svg"
            alt="Logo"
            draggable={false}
            className="h-full"
          />

          {isLoggedIn && (
            <div
              onClick={handleLogout}
              className="flex items-center gap-3 px-2 py-1 text-white bg-red-400 border rounded cursor-pointer"
            >
              <div className="text-sm">Keluar</div>
              <Logout />
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

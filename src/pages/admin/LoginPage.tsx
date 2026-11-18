import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../utills/mode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  message: string;
  token: string;
}

export const LoginAdminPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (access_token) {
      navigate("/admin/transaction");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const url = api();
      const response = await axios.post<LoginResponse>(`${url.baseURL}/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        Cookies.set("access_token", response.data.token, {
          expires: 7,
          secure: true,
        });
        navigate("/admin/transaction");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login gagal. Periksa username dan password Anda.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-100 shadow-card rounded-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-ink">Login Admin</h1>
          <p className="text-sm text-muted mt-1">Masuk untuk mengelola pesanan.</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              className="h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              className="h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-primary rounded-xl hover:bg-primaryDark transition active:scale-[0.99]"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

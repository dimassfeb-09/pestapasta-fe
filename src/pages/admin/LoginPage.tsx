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
    const access_token = Cookies.get("access_token"); // Get token from cookies
    if (access_token) {
      navigate("/admin/transaction");
    }
  }, []);

  const handleSubmit = async (e: any) => {
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
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md p-6 mx-auto mt-8">
        <div className="p-4 rounded-t-lg bg-primary">
          <h1 className="text-2xl font-semibold text-center text-white">
            Login
          </h1>
        </div>

        <div className="p-6 rounded-b-lg bg-yellow-50">
          {error && (
            <div className="p-4 mb-4 text-red-600 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-gray-800">Username</label>
              <input
                type="text"
                placeholder="Masukkan Username..."
                className="w-full p-3 border rounded-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-800">Password</label>
              <input
                type="password"
                placeholder="Masukkan Password..."
                className="w-full p-3 border rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-medium text-white rounded-lg bg-primary hover:bg-primary-dark"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

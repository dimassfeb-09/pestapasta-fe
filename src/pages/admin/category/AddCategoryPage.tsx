import { useState } from "react";
import { Category } from "../../../models/Category";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utills/mode";
import axios from "axios";

export default function AddCategoryPage() {
  const [category, setCategory] = useState<Category>({
    id: 0,
    category_name: "",
    description: "",
  });
  const navigate = useNavigate();

  const access_token = Cookies.get("access_token");
  if (!access_token) {
    navigate("/admin/login");
    return "";
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const apiUrl = api().baseURL;
      await axios.post(`${apiUrl}/categories`, category, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      navigate("/admin/categories");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md p-6 mx-auto mt-8">
        <div className="p-4 rounded-t-lg bg-primary">
          <h1 className="text-2xl font-semibold text-center text-white">
            Tambah Kategori
          </h1>
        </div>

        <div className="p-6 rounded-b-lg bg-yellow-50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-gray-800">Nama</label>
              <input
                type="text"
                placeholder="Masukkan Nama..."
                className="w-full p-3 border rounded-lg"
                value={category?.category_name}
                onChange={(e) =>
                  setCategory({ ...category, category_name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-800">Deskripsi</label>
              <input
                type="text"
                placeholder="Masukkan Deskripsi..."
                className="w-full p-3 border rounded-lg"
                value={category?.description}
                onChange={(e) =>
                  setCategory({ ...category, description: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-medium text-white rounded-lg bg-primary hover:bg-primary-dark"
            >
              Tambah
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

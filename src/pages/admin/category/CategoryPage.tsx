import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../../utills/mode";
import { Link, useNavigate } from "react-router-dom";
import { Category } from "../../../models/Category";
import { Edit } from "@mui/icons-material";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const access_token = Cookies.get("access_token");
  if (!access_token) {
    navigate("/admin/login");
  }

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const apiUrl = api().baseURL;
      const data = await axios.get<Category[]>(`${apiUrl}/categories`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setCategories(data.data);
    } catch (e) {
      console.log("Failed to fetch data Categories");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <Link
          className="px-3 py-2 text-lg font-bold text-white border-2 border-white rounded-md shadow-xl bg-primary"
          to="/admin/categories/add"
        >
          Tambah Kategori
        </Link>

        <div className="mt-3 overflow-x-auto rounded-lg bg-emerald-400">
          <table className="w-full">
            <thead>
              <tr className="text-white">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Nama Kategori</th>
                <th className="p-4 text-left">Deskripsi</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {categories.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="p-4">{category.id}</td>
                  <td className="p-4">{category.category_name}</td>
                  <td className="p-4">{category.description}</td>
                  <td className="p-4">
                    <Link to={`/admin/categories/${category.id}/edit`}>
                      <Edit />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

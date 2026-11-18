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
    } catch (e: unknown) {
      console.log("Failed to fetch data Categories", e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Kategori</h1>
          <p className="text-sm text-muted mt-1">Kelola kategori menu.</p>
        </div>
        <Link
          className="px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primaryDark transition"
          to="/admin/categories/add"
        >
          + Tambah Kategori
        </Link>
      </div>

      <div className="overflow-hidden bg-white border border-gray-100 shadow-card rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-ink">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Nama</th>
                <th className="px-4 py-3 text-left font-semibold">Deskripsi</th>
                <th className="px-4 py-3 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-muted">{category.id}</td>
                  <td className="px-4 py-3 font-medium text-ink">
                    {category.category_name}
                  </td>
                  <td className="px-4 py-3 text-muted">{category.description}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/categories/${category.id}/edit`}
                      className="text-muted hover:text-primary transition"
                      aria-label="Edit"
                    >
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

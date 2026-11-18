import { useEffect, useState } from "react";
import { Category } from "../../../models/Category";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../utills/mode";
import axios from "axios";

export default function UpdateCategoryPage() {
  const [category, setCategory] = useState<Category>({
    id: 0,
    category_name: "",
    description: "",
  });
  const navigate = useNavigate();

  const { id } = useParams();

  const access_token = Cookies.get("access_token");
  if (!access_token) {
    navigate("/admin/login");
  }

  useEffect(() => {
    fetchDetailCategory();
  }, [access_token]);

  const fetchDetailCategory = async () => {
    try {
      const apiUrl = api().baseURL;
      const data = await axios.get<Category>(`${apiUrl}/categories/${id}`);
      setCategory(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const apiUrl = api().baseURL;
      await axios.put(`${apiUrl}/categories/${id}`, category, {
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
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Edit Kategori</h1>
        <p className="text-sm text-muted mt-1">Perbarui kategori.</p>
      </div>

      <div className="p-6 bg-white border border-gray-100 shadow-card rounded-2xl">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Nama</label>
            <input
              type="text"
              placeholder="Nama kategori"
              className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              value={category?.category_name}
              onChange={(e) =>
                setCategory({ ...category, category_name: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Deskripsi</label>
            <textarea
              placeholder="Deskripsi kategori"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
              value={category?.description}
              onChange={(e) =>
                setCategory({ ...category, description: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="flex-1 py-3 font-medium text-ink bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 font-semibold text-white bg-primary rounded-xl hover:bg-primaryDark transition active:scale-[0.99]"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

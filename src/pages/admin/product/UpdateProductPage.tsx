import { useEffect, useState } from "react";
import { Product } from "../../../models/Product";
import { Category } from "../../../models/Category";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../utills/mode";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdateProductPage() {
  const [product, setProduct] = useState<Product>({
    id: 0,
    name: "",
    price: 0,
    description: "",
    category_id: 0,
    image_url: "",
    rating: 0,
    is_available: true,
  });
  const [categories, setCategories] = useState<Category[]>();
  const navigate = useNavigate();

  const { id } = useParams();

  const access_token = Cookies.get("access_token");
  if (!access_token) {
    navigate("/admin/login");
  }

  useEffect(() => {
    fetchAllCategories();
    fetchDetailProduct();
  }, [access_token]);

  const fetchDetailProduct = async () => {
    try {
      const apiUrl = api().baseURL;
      const data = await axios.get<Product>(`${apiUrl}/menus/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setProduct(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const apiUrl = api().baseURL;
      const data = await axios.get<Category[]>(`${apiUrl}/categories`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setCategories(data.data);
    } catch {
      toast.error("Gagal mendapatkan kategori");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const apiUrl = api().baseURL;
      await axios.put(`${apiUrl}/menus/${product.id}`, product, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      navigate("/admin/product");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Edit Menu</h1>
        <p className="text-sm text-muted mt-1">Perbarui detail menu.</p>
      </div>

      <div className="p-6 bg-white border border-gray-100 shadow-card rounded-2xl">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Gambar (URL)">
            <input
              type="text"
              placeholder="https://..."
              className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              value={product?.image_url}
              onChange={(e) =>
                setProduct({ ...product, image_url: e.target.value })
              }
            />
          </Field>

          <Field label="Nama">
            <input
              type="text"
              placeholder="Nama menu"
              className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              value={product?.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Harga">
              <input
                type="number"
                placeholder="0"
                className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                value={product?.price}
                onChange={(e) =>
                  setProduct({ ...product, price: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Rating">
              <input
                type="number"
                step="0.1"
                placeholder="0"
                className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                value={product?.rating}
                onChange={(e) =>
                  setProduct({ ...product, rating: Number(e.target.value) })
                }
              />
            </Field>
          </div>

          <Field label="Deskripsi">
            <textarea
              placeholder="Deskripsi menu"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
              value={product?.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </Field>

          <Field label="Kategori">
            <select
              className="w-full h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white"
              value={product?.category_id}
              onChange={(e) =>
                setProduct({ ...product, category_id: Number(e.target.value) })
              }
            >
              <option value={0}>Pilih kategori</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </Field>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={product?.is_available}
              onChange={(e) =>
                setProduct({ ...product, is_available: e.target.checked })
              }
              className="w-4 h-4 accent-primary"
            />
            Tersedia
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/product")}
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

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-ink">{label}</label>
    {children}
  </div>
);

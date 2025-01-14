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
    } catch (e: any) {
      toast.error("Gagal mendapatkan kategori");
    }
  };

  const handleSubmit = async (e: any) => {
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
    <div className="min-h-screen bg-white">
      <div className="max-w-md p-6 mx-auto mt-8">
        <div className="p-4 rounded-t-lg bg-primary">
          <h1 className="text-2xl font-semibold text-center text-white">
            Update Produk
          </h1>
        </div>

        <div className="p-6 rounded-b-lg bg-yellow-50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-gray-800">Gambar</label>
              <input
                type="text"
                placeholder="Masukkan Link Gambar..."
                className="w-full p-3 border rounded-lg"
                value={product?.image_url}
                onChange={(e) =>
                  setProduct({ ...product, image_url: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-800">Nama</label>
              <input
                type="text"
                placeholder="Masukkan Nama..."
                className="w-full p-3 border rounded-lg"
                value={product?.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-800">Harga</label>
              <input
                type="number"
                placeholder="Masukkan Harga..."
                className="w-full p-3 border rounded-lg"
                value={product?.price || ""}
                onChange={(e) =>
                  setProduct({ ...product, price: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-800">Deskripsi</label>
              <input
                type="text"
                placeholder="Masukkan Deskripsi..."
                className="w-full p-3 border rounded-lg"
                value={product?.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </div>

            <select
              id="countries"
              value={product.category_id || ""}
              onChange={(e) =>
                setProduct({ ...product, category_id: Number(e.target.value) })
              }
              className=" bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="" disabled>
                Pilih Kategori
              </option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full py-3 font-medium text-white rounded-lg bg-primary hover:bg-primary-dark"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

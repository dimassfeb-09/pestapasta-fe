import { Edit, ToggleOff, ToggleOn } from "@mui/icons-material";
import Cookies from "js-cookie";

import { formatToRupiah } from "../../../utills/toRupiah";
import { useEffect, useState } from "react";
import { Product } from "../../../models/Product";
import axios from "axios";
import { api } from "../../../utills/mode";
import { Link, useNavigate } from "react-router-dom";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const access_token = Cookies.get("access_token");
  if (!access_token) {
    navigate("/admin/login");
  }

  useEffect(() => {
    fetchAllProducts();
  }, []);
  const fetchAllProducts = async () => {
    try {
      const apiUrl = api().baseURL;
      const response = await axios.get<Product[]>(`${apiUrl}/menus`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      response.data.sort((a, b) => a.id - b.id);
      setProducts(response.data);
    } catch (e) {
      console.log("Failed to fetch data products", e);
    }
  };

  const handleUpdateAvailableProduct = async (product: Product) => {
    try {
      const apiUrl = api().baseURL;

      await axios.put(
        `${apiUrl}/menus/${product.id}`,
        {
          ...product,
          is_available: !product.is_available,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, is_available: !p.is_available } : p
        )
      );
    } catch (error) {
      console.error("Failed to update product availability:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Menu</h1>
          <p className="text-sm text-muted mt-1">Kelola daftar menu restoran.</p>
        </div>
        <Link
          className="px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primaryDark transition"
          to="/admin/product/add"
        >
          + Tambah Menu
        </Link>
      </div>

      <div className="overflow-hidden bg-white border border-gray-100 shadow-card rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-ink">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Gambar</th>
                <th className="px-4 py-3 text-left font-semibold">Nama</th>
                <th className="px-4 py-3 text-left font-semibold">Harga</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-muted">{product.id}</td>
                  <td className="px-4 py-3">
                    <img
                      className="w-12 h-12 object-cover rounded-lg"
                      src={product.image_url}
                      alt={product.name}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{product.name}</td>
                  <td className="px-4 py-3 text-ink">
                    {formatToRupiah(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full text-white ${
                        product.is_available ? "bg-greenTeal" : "bg-primary"
                      }`}
                    >
                      {product.is_available ? "TERSEDIA" : "KOSONG"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateAvailableProduct(product)}
                        className="text-muted hover:text-ink transition"
                        aria-label="Toggle availability"
                      >
                        {product.is_available ? (
                          <ToggleOn className="w-6 h-6 text-greenTeal" />
                        ) : (
                          <ToggleOff className="w-6 h-6 text-primary" />
                        )}
                      </button>
                      <Link
                        to={`/admin/product/${product.id}/edit`}
                        className="text-muted hover:text-primary transition"
                        aria-label="Edit"
                      >
                        <Edit />
                      </Link>
                    </div>
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

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
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <Link
          className="px-3 py-2 text-lg font-bold text-white border-2 border-white rounded-md shadow-xl bg-primary"
          to="/admin/product/add"
        >
          Tambah Menu
        </Link>

        <div className="mt-3 overflow-hidden rounded-lg bg-emerald-400">
          <table className="w-full">
            <thead>
              <tr className="text-white">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Gambar</th>
                <th className="p-4 text-left">Nama</th>
                <th className="p-4 text-left">Harga</th>
                <th className="p-4 text-left">Status Tersedia</th>
                <th className="p-4 text-left">Aksi </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-4">{product.id}</td>
                  <td className="p-4">
                    <img
                      className="w-20 h-20"
                      src={product.image_url}
                      alt={product.name}
                    />
                  </td>
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{formatToRupiah(product.price)}</td>
                  <td className="p-4 ">
                    <p
                      className={` w-min text-sm font-bold rounded-md text-white px-2 py-1 ${
                        product.is_available ? "bg-teal-500" : "bg-primary"
                      }`}
                    >
                      {product.is_available ? "TERSEDIA" : "KOSONG"}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateAvailableProduct(product)}
                      >
                        {product.is_available ? (
                          <ToggleOn className="w-6 h-6 text-greenTeal" />
                        ) : (
                          <ToggleOff className="w-6 h-6 text-primary" />
                        )}
                      </button>
                      <Link to={`/admin/product/${product.id}/edit`}>
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

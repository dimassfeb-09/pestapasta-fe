import { ChevronLeft } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PaymentMethod } from "../../models/PaymentMethod";
import { CheckoutItem } from "../../models/CheckoutItem";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckoutResponse } from "../../models/CheckoutResponse";
import { api } from "../../utills/mode";

export default function ConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const payment: PaymentMethod = location.state?.payment;
  const checkoutItems: CheckoutItem[] = location.state?.checkoutItems;

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!payment) {
      navigate("/checkout");
    }
  }, [payment, navigate]);

  // Validate email format
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (!name || !email) {
      toast.error("Nama dan Email harus diisi.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Format email tidak valid.");
      return;
    }

    const requestData = {
      name,
      email,
      products: checkoutItems.map((p) => ({
        id: p.product.id,
        quantity: p.total_item,
        notes: p.note,
      })),
      payment_method_id: payment.id,
    };

    try {
      const apiConfig = api();
      const { data } = await axios.post<CheckoutResponse>(
        `${apiConfig.baseURL}/checkout`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const orderId = data.data.order_id;

      localStorage.clear();

      if (data.code == 200) {
        navigate(`/order_detail/${orderId}`);
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5">
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center">
          <ChevronLeft
            onClick={() => navigate("/checkout")}
            className="w-6 h-6"
          />
          <h1 className="ml-2 text-lg font-medium">Konfirmasi Pemesanan</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col w-full gap-5 p-5 rounded-md bg-secondaryLight">
        {/* Name Input */}
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 text-sm font-semibold">
            Nama
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Masukkan nama Anda"
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 text-sm font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Masukkan email Anda"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`flex items-center justify-center w-full p-3 text-white rounded-b-md bg-greenTeal  ${
          isLoading ? "bg-gray-400" : "hover:bg-green-700"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Kirim Invoice"}
      </button>
    </div>
  );
}

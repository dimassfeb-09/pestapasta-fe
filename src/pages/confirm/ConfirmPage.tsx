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

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (!name || !email) {
      toast.error("Nama dan Email harus diisi.");
      setIsLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Format email tidak valid.");
      setIsLoading(false);
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
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string };
      if (err.response) {
        toast.error(err.response.data?.error ?? "Terjadi kesalahan");
      } else {
        toast.error(err.message ?? "Terjadi kesalahan");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-14 z-40 flex items-center gap-2 px-5 py-3 bg-canvas">
        <button
          type="button"
          onClick={() => navigate("/checkout")}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-card text-ink hover:bg-gray-50 transition"
          aria-label="Kembali"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-lg font-bold text-ink">Konfirmasi Pemesanan</h1>
      </div>

      <div className="px-5 pb-6 space-y-4">
        <div className="p-5 bg-white border border-gray-100 shadow-card rounded-2xl">
          <div className="mb-4 text-base font-bold text-ink">Data Pemesan</div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-ink">
                Nama
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Masukkan nama Anda"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Masukkan email Anda"
              />
            </div>
          </div>
        </div>

        {payment && (
          <div className="p-5 bg-white border border-gray-100 shadow-card rounded-2xl">
            <div className="mb-2 text-base font-bold text-ink">
              Metode Pembayaran
            </div>
            <div className="text-sm text-muted">{payment.name}</div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={`flex items-center justify-center w-full py-3.5 text-white font-bold rounded-2xl transition active:scale-[0.99] ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-greenTeal hover:bg-greenTealDark"
          }`}
        >
          {isLoading ? "Memproses..." : "Kirim Invoice"}
        </button>
      </div>
    </div>
  );
}

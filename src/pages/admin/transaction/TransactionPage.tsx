import { RemoveRedEye, Close } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatToRupiah } from "../../../utills/toRupiah";
import { api } from "../../../utills/mode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { OrderDetail, OrderResponse } from "../../../models/OrderDetail";

export const TransactionPage = () => {
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] =
    useState<OrderResponse>();
  const [transactions, setTransactions] = useState<OrderResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (!access_token) {
      navigate("/admin/login");
    }

    const fetchAllTransactions = async () => {
      try {
        if (!access_token) {
          console.error("No access token found.");
          return;
        }

        const apiConfig = api();
        const response = await axios.get(`${apiConfig.baseURL}/orders`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        setTransactions(response.data);
      } catch (e) {
        console.error("Error fetching transactions:", e);
      }
    };

    fetchAllTransactions();
  }, []);

  const handleOrderDetailsToggle = (transaction: OrderResponse) => {
    setOrderDetailOpen(!orderDetailOpen);
    setSelectedOrderDetail(transaction);
  };

  const statusClass = (status: string) => {
    const s = (status ?? "").toLowerCase();
    if (s === "pending") return "bg-yellow-100 text-yellow-700";
    if (s === "success") return "bg-greenTeal/20 text-greenTealDark";
    if (["error", "expired"].includes(s)) return "bg-red-100 text-red-700";
    if (s === "canceled") return "bg-gray-100 text-gray-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Transaksi</h1>
        <p className="text-sm text-muted mt-1">Daftar transaksi pelanggan.</p>
      </div>

      <div className="overflow-hidden bg-white border border-gray-100 shadow-card rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-ink">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Nama</th>
                <th className="px-4 py-3 text-left font-semibold">Metode</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Total</th>
                <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                <th className="px-4 py-3 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-muted">{transaction.id}</td>
                  <td className="px-4 py-3 font-medium text-ink">
                    {transaction.name}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {transaction.payments.payment_method}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusClass(
                        transaction.order_status
                      )}`}
                    >
                      {transaction.order_status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {formatToRupiah(transaction.total_price)}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {transaction.order_date}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleOrderDetailsToggle(transaction)}
                      className="p-2 text-muted hover:text-primary rounded-lg hover:bg-gray-100 transition"
                      aria-label="Lihat detail"
                    >
                      <RemoveRedEye fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orderDetailOpen && selectedOrderDetail && (
        <OrderDetails
          onClose={() => setOrderDetailOpen(false)}
          orderDetail={selectedOrderDetail}
        />
      )}
    </div>
  );
};

const OrderDetails = ({
  onClose,
  orderDetail,
}: {
  onClose: () => void;
  orderDetail: OrderResponse;
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-soft overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-ink">Detail Transaksi</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-ink transition"
            aria-label="Tutup"
          >
            <Close />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50 text-ink">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">No</th>
                <th className="px-4 py-3 text-left font-semibold">Pesanan</th>
                <th className="px-4 py-3 text-left font-semibold">Catatan</th>
                <th className="px-4 py-3 text-left font-semibold">Harga/Item</th>
                <th className="px-4 py-3 text-left font-semibold">Qty</th>
                <th className="px-4 py-3 text-left font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orderDetail.order_details.map(
                (item: OrderDetail, index: number) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-muted">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {item.menu_detail.name}
                    </td>
                    <td className="px-4 py-3 text-muted">{item.notes}</td>
                    <td className="px-4 py-3 text-ink">
                      {formatToRupiah(item.subtotal_price)}
                    </td>
                    <td className="px-4 py-3 text-ink">{item.quantity}</td>
                    <td className="px-4 py-3 text-ink">
                      {formatToRupiah(item.subtotal_price)}
                    </td>
                  </tr>
                )
              )}
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={5} className="px-4 py-3 text-right text-ink">
                  Total
                </td>
                <td className="px-4 py-3 text-ink">
                  {formatToRupiah(
                    orderDetail.order_details.reduce(
                      (sum: number, item: OrderDetail) =>
                        sum + item.subtotal_price,
                      0
                    )
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

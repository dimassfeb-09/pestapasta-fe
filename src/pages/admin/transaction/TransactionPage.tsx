import { RemoveRedEye, Close } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatToRupiah } from "../../../utills/toRupiah";
import { api } from "../../../utills/mode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const TransactionPage = () => {
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any | null>(
    null
  );
  const [transactions, setTransactions] = useState<any[]>([]);
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

        const apiConfig = api(); // Assuming this is defined elsewhere
        const response = await axios.get(`${apiConfig.baseURL}/orders`, {
          headers: {
            Authorization: `Bearer ${access_token}`, // Add token to headers
          },
        });

        setTransactions(response.data); // Update transactions state with fetched data
      } catch (e) {
        console.error("Error fetching transactions:", e);
      }
    };

    fetchAllTransactions();
  }, []);

  const handleOrderDetailsToggle = (transaction: any) => {
    setOrderDetailOpen(!orderDetailOpen);
    setSelectedOrderDetail(transaction);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="overflow-x-auto rounded-lg bg-emerald-400">
          <table className="w-full">
            <thead>
              <tr className="text-white">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Nama</th>
                <th className="p-4 text-left">Metode Pembayaran</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Tanggal Transaksi</th>
                <th className="p-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white overflow-auto">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="p-4">{transaction.id}</td>
                  <td className="p-4">{transaction.name}</td>
                  <td className="p-4">{transaction.payments.payment_method}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-sm font-bold rounded 
                        ${
                          (
                            transaction.order_status ?? "unknown"
                          ).toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : transaction.order_status === "success"
                            ? "bg-green-100 text-green-700"
                            : ["error", "expired"].includes(
                                transaction.order_status
                              )
                            ? "bg-red-100 text-red-700"
                            : transaction.order_status === "canceled"
                            ? "bg-gray-100 text-gray-700"
                            : ""
                        }`}
                    >
                      {transaction.order_status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    {formatToRupiah(transaction.total_price)}
                  </td>
                  <td className="p-4">{transaction.order_date}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOrderDetailsToggle(transaction)}
                        className="p-2 bg-yellow-400 rounded"
                      >
                        <RemoveRedEye className="w-4 h-4" />
                      </button>
                    </div>
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
  orderDetail: any;
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-gray-600 bg-opacity-50"
      onClick={onClose}
    >
      <div className="w-full max-w-4xl translate-y-8 bg-white rounded-lg">
        <div className="flex items-center justify-between p-4 rounded-t-lg bg-emerald-400">
          <h2 className="text-lg font-medium text-white">
            Detail Transaksi Pembeli
          </h2>
          <button onClick={onClose} className="text-white">
            <Close className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto  max-h-[80vh]">
          {/* Added max-h to limit the height */}
          <table className="w-full">
            <thead className="sticky top-0 z-10 text-white bg-emerald-400">
              <tr>
                <th className="p-4 text-left">No</th>
                <th className="p-4 text-left">Pesanan</th>
                <th className="p-4 text-left">Notes</th>
                <th className="p-4 text-left">Harga/Item</th>
                <th className="p-4 text-left">Kuantitas</th>
                <th className="p-4 text-left">Total</th>
              </tr>
            </thead>

            <tbody className="bg-yellow-50">
              {orderDetail.order_details.map((item: any, index: number) => (
                <tr key={item.id} className="border-b border-emerald-200">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{item.menu_detail.name}</td>
                  <td className="p-4">{item.notes}</td>
                  <td className="p-4">
                    Rp. {item.subtotal_price.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">
                    Rp. {item.subtotal_price.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}

              {/* Total row fixed at the bottom */}
              <tr className="sticky bottom-0 z-10 bg-emerald-400">
                <td colSpan={5} className="p-4 font-medium text-right">
                  Total
                </td>
                <td className="p-4 font-medium">
                  Rp.{" "}
                  {orderDetail.order_details
                    .reduce(
                      (sum: any, item: any) => sum + item.subtotal_price,
                      0
                    )
                    .toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

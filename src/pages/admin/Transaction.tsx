import { RemoveRedEye, Close } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatToRupiah } from "../../utills/toRupiah";

export const TransactionTable = () => {
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any | null>(
    null
  );

  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const data = await axios.get("http://localhost:8081/orders");
        setTransactions(data.data);
      } catch (e) {
        console.log(e);
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
        <div className="overflow-hidden rounded-lg bg-emerald-400">
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
            <tbody className="bg-white">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="p-4">{transaction.id}</td>
                  <td className="p-4">{transaction.name}</td>
                  <td className="p-4">{transaction.payments.payment_method}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 text-yellow-800 bg-yellow-100 rounded">
                      {transaction.order_status}
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
                      <button className="px-3 py-1 text-white bg-red-500 rounded">
                        Ubah Status
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

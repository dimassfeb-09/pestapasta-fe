import { useEffect, useState } from "react";
import { formatToRupiah } from "../../utills/toRupiah";
import { Close, QuestionMarkRounded } from "@mui/icons-material";
import { OrderResponse } from "../../models/OrderDetail";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../utills/mode";

export default function PaymentPage() {
  const { orderId } = useParams();

  const [showDialog, setShowDialog] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderResponse | null>(null);

  const handleConfirmPayment = () => {
    setIsPolling(true);
  };

  useEffect(() => {
    let intervalId: any;
    let count = 0; // Menyimpan jumlah polling
    let startTime = Date.now(); // Menyimpan waktu mulai polling

    const fetchOrderStatus = async () => {
      try {
        const apiConfig = api();

        const response = await axios.get(
          `${apiConfig.baseURL}/orders/${orderId}/status`
        );
        const data = response.data;

        if (data.order_status !== "pending") {
          setIsPolling(false);
        }

        if (data.order_status == "success") {
          toast.success("Pembayaran berhasil dilakukan, maaci!!");
        }

        setOrderDetail((prev) => ({
          ...prev,
          id: prev!.id,
          order_date: prev!.order_date,
          email: prev!.email,
          name: prev!.name,
          total_price: prev!.total_price,
          order_status: data.order_status,
          payments: {
            ...prev!.payments,
            payment_status: data.order_status,
          },
          order_details: prev!.order_details,
        }));

        count++;
        if (count >= 6 || Date.now() - startTime >= 100000) {
          toast.warning(
            "Mohon maaf pembayaran belum kami terima, apabila sudah melakukan pembayaran harap hubungi customer service kami melalui email support@pestapasta.com."
          );
          setIsPolling(false);
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    if (isPolling) {
      fetchOrderStatus(); // Panggil pertama kali tanpa menunggu interval

      // Mulai interval untuk polling setiap 10 detik
      intervalId = setInterval(fetchOrderStatus, 10000);
    }

    return () => {
      clearInterval(intervalId); // Bersihkan interval saat komponen dibersihkan
    };
  }, [isPolling]); // Dependency untuk memulai ulang useEffect saat isPolling berubah

  const fetchOrderDetail = async () => {
    try {
      const apiConfig = api();

      const response = await axios.get(
        `${apiConfig.baseURL}/orders/${orderId}`
      );
      setOrderDetail(response.data);
    } catch (e) {
      console.log("FAIL TO FETCH DATA " + e);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const total = (orderDetail?.order_details || []).reduce(
    (sum, item) => sum + item.subtotal_price * item.quantity,
    0
  );

  const handleDialogToggle = () => setShowDialog((prev) => !prev);

  return (
    <div className="flex flex-col p-6 bg-gray-100 min-h-screen">
      <div className="space-y-6">
        {/* Payment Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Detail Pembayaran
          </h2>

          {orderDetail?.payments.payment_method === "QRIS" &&
          orderDetail?.payments.payment_status !== "success" ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Pastikan jumlah yang dibayarkan sesuai dengan total yang tertera
                di bawah ini.
              </p>
              <div className="flex flex-col justify-center items-center h-full">
                <img
                  src={orderDetail?.payments.payment_qrcode_url}
                  alt="QRIS"
                  className="max-w-36 max-h-36"
                  draggable={false}
                />
              </div>
            </div>
          ) : null}

          <table className="w-full text-sm text-gray-600">
            <tbody>
              {orderDetail?.payments.payment_method !== "QRIS" && (
                <>
                  <tr>
                    <td className="font-medium text-gray-600 px-4 py-2">
                      Nomor Rekening
                    </td>
                    <td className="font-bold px-4 py-2">
                      {orderDetail?.payments.payment_account_number}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-600 px-4 py-2">
                      Atas Nama
                    </td>
                    <td className="font-bold px-4 py-2">
                      {orderDetail?.payments.payment_account_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="flex items-center gap-2 font-medium text-gray-600 px-4 py-2">
                      <p>Keterangan Berita</p>
                      <p
                        className="text-sm cursor-pointer"
                        onClick={handleDialogToggle}
                      >
                        <QuestionMarkRounded
                          fontSize="small"
                          className="p-1 text-white rounded-full bg-primary"
                        />
                      </p>
                    </td>
                    <td className="font-bold px-4 py-2">
                      {orderDetail?.payments.transaction_code}
                    </td>
                  </tr>
                </>
              )}

              <tr>
                <td className="font-medium text-gray-600 px-4 py-2">
                  Metode Pembayaran
                </td>
                <td className="font-bold px-4 py-2">
                  {orderDetail?.payments.payment_method}
                </td>
              </tr>

              {/* Countdown Timer */}
              <tr>
                <td className="font-medium text-gray-600 px-4 py-2">
                  Batas Waktu Pembayaran
                </td>
                <td className="font-bold px-4 py-2">
                  {orderDetail?.payments.payment_expired_date}
                </td>
              </tr>

              <tr>
                <td className="font-medium text-gray-600 px-4 py-2">Status</td>
                <td className="font-bold px-4 py-2">
                  <div
                    className={`px-2 py-1 w-max font-bold text-white rounded-md ${
                      orderDetail?.payments?.payment_status === "success"
                        ? "bg-greenTeal"
                        : orderDetail?.payments?.payment_status === "canceled"
                        ? "bg-red-500"
                        : orderDetail?.payments?.payment_status === "pending"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {orderDetail?.payments?.payment_status || "N/A"}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {orderDetail?.payments.payment_status == "pending" && (
            <div className="mt-6">
              <button
                onClick={handleConfirmPayment}
                className={`w-full py-3 text-white font-semibold rounded-lg ${
                  isPolling ? "bg-gray-200" : "bg-teal-600 hover:bg-teal-700"
                } transition`}
              >
                {isPolling
                  ? "Tunggu yaa, lagi ngecek pembayaran kamu..."
                  : "Konfirmasi Pembayaran"}
              </button>
            </div>
          )}
        </div>

        {/* Customer Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Detail Pemesan
          </h2>
          <div className="flex justify-between mb-3">
            <span className="text-gray-600">{orderDetail?.name}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-gray-600">{orderDetail?.email}</span>
          </div>
        </div>

        {/* Product Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Ringkasan Produk
          </h2>
          {orderDetail?.order_details.map((product) => (
            <div key={product.id} className="flex items-start mb-4 space-x-4">
              <img
                src={product.menu_detail.image_url}
                alt={product.menu_detail.name}
                className="object-cover w-20 h-20 rounded-lg shadow-md"
              />
              <div>
                <h3 className="font-medium text-gray-700">
                  {product.menu_detail.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {product.menu_detail.description}
                </p>
                <div className="flex gap-2">
                  <p className="text-sm text-gray-500">{product.quantity} x</p>
                  <p className="text-sm text-gray-500">
                    {formatToRupiah(product.subtotal_price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Detail Harga
          </h2>
          {orderDetail?.order_details.map((item, index) => (
            <div key={index} className="flex justify-between mb-3">
              <span className="text-gray-600">{item.menu_detail.name}</span>
              <span className="font-medium">
                {formatToRupiah(item.menu_detail.price)}
              </span>
            </div>
          ))}
          <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
            <span className="font-medium">Subtotal</span>
            <span className="font-semibold">{formatToRupiah(total)}</span>
          </div>
          <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
            <span className="font-medium">Pajak (10%)</span>
            <span className="font-semibold">{formatToRupiah(total * 0.1)}</span>
          </div>
          <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
            <span className="font-medium">Total Pembayaran</span>
            <span className="font-semibold">{formatToRupiah(total * 1.1)}</span>
          </div>
        </div>
      </div>

      {showDialog && <DialogTransactionCode onClose={handleDialogToggle} />}
    </div>
  );
}

const DialogTransactionCode = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative p-6 m-4 bg-white rounded-lg max-w-sm w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <Close />
        </button>

        {/* Content */}
        <h3 className="text-lg font-semibold mb-4">
          Apa itu keterangan berita?
        </h3>
        <img
          src="assets/apa_itu_kode_transaksijpg.jpg"
          alt="Apa itu keterangan berita"
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
};

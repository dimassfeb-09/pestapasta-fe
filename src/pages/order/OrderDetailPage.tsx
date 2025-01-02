import { useEffect, useState } from "react";
import { formatToRupiah } from "../../utills/toRupiah";
import { Close, FileCopy, QuestionMarkRounded } from "@mui/icons-material";
import { OrderResponse } from "../../models/OrderDetail";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../utills/mode";
import LoadingSpinner from "../../components/LoadingSpinnerv";
import OrderNotFoundCard from "./components/OrderNotFoundCard";
import CountdownTimer from "./components/CountDownTimer";

export default function PaymentPage() {
  const { orderId } = useParams();
  const [showDialog, setShowDialog] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [pollingCount, setPollingCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [isPaymentExpired, setIsPaymentExpired] = useState(false);

  const handleConfirmPayment = () => {
    setPollingCount(0); // Reset polling count
    setIsPolling(true);
  };

  useEffect(() => {
    let intervalId: any;

    const fetchOrderStatus = async () => {
      try {
        const apiConfig = api();
        const response = await axios.get(
          `${apiConfig.baseURL}/orders/${orderId}/status`
        );
        const data = response.data;

        setOrderDetail((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            order_status: data.order_status,
            payments: {
              ...prev.payments,
              payment_status: data.order_status,
            },
          };
        });

        if (data.order_status === "pending") {
          return; // Continue polling
        }

        // Stop polling if status is not "pending"
        setIsPolling(false);
        if (intervalId) clearInterval(intervalId);

        if (data.order_status === "success") {
          toast.success("Pembayaran berhasil dilakukan, maaci!!");
        } else {
          toast.info(`Status pembayaran: ${data.order_status}`);
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
        setIsPolling(false);
        if (intervalId) clearInterval(intervalId);
      }
    };

    if (isPolling) {
      fetchOrderStatus();

      intervalId = setInterval(() => {
        fetchOrderStatus();
        setPollingCount((prevCount) => {
          const newCount = prevCount + 1;

          if (newCount >= 3) {
            toast.warning(
              "Mohon maaf pembayaran belum kami terima, apabila sudah melakukan pembayaran harap hubungi customer service kami melalui whatsapp +621234512312"
            );
            setIsPolling(false);
            clearInterval(intervalId);
          }

          return newCount;
        });
      }, 10000); // Polling every 10 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPolling, pollingCount, orderId]);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    try {
      const apiConfig = api();
      const response = await axios.get(
        `${apiConfig.baseURL}/orders/${orderId}`
      );
      setOrderDetail(response.data);
      handleIsPaymentExpired(response.data.payments?.payment_expired_date);
    } catch (e: any) {
      if (e.status === 404) {
        setOrderDetail(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleIsPaymentExpired = (payment_expired_date: string) => {
    if (payment_expired_date) {
      const paymentExpiredDate = new Date(payment_expired_date);
      const now = new Date();
      setIsPaymentExpired(now > paymentExpiredDate);
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

  const savePaymentLink = () => {
    if (orderDetail) {
      const paymentLink = `${window.location.origin}/order_detail/${orderId}`;
      navigator.clipboard
        .writeText(paymentLink)
        .then(() => {
          toast.success("Link pembayaran berhasil disalin!");
        })
        .catch(() => {
          toast.error("Gagal menyalin link pembayaran.");
        });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (orderDetail == null && !isLoading) {
    return <OrderNotFoundCard orderId={orderId ?? "0"} />;
  }

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-100">
      <div className="space-y-6">
        {/* Payment Details */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Detail Pembayaran
          </h2>

          {orderDetail?.payments.payment_method === "QRIS" &&
          orderDetail?.payments.payment_status !== "success" ? (
            <div>
              <p className="mb-4 text-sm text-gray-600">
                Pastikan jumlah yang dibayarkan sesuai dengan total yang tertera
                di bawah ini.
              </p>
              <div className="flex flex-col items-center justify-center h-full">
                <img
                  src={orderDetail?.payments.payment_qr_code_url}
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
                    <td className="px-4 py-2 font-medium text-gray-600">
                      Nomor Rekening
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {orderDetail?.payments.payment_account_number}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-gray-600">
                      Atas Nama
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {orderDetail?.payments.payment_account_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="flex items-center gap-2 px-4 py-2 font-medium text-gray-600">
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
                    <td className="px-4 py-2 font-bold">
                      {orderDetail?.payments.transaction_code}
                    </td>
                  </tr>
                </>
              )}

              <tr>
                <td className="px-4 py-2 font-medium text-gray-600">
                  Order ID
                </td>
                <td className="px-4 py-2 font-bold">
                  <div className="px-2 py-1 text-white bg-red-500 rounded-md h-max w-max">
                    {orderDetail?.id}
                  </div>
                </td>
              </tr>

              <tr>
                <td className="px-4 py-2 font-medium text-gray-600">Status</td>
                <td className="px-4 py-2 font-bold">
                  <div
                    className={`px-2 py-1 w-max font-bold text-white rounded-md ${
                      orderDetail?.payments?.payment_status
                        ? {
                            success: "bg-greenTeal",
                            canceled: "bg-red-500",
                            pending: "bg-yellow-500",
                            authorize: "bg-blue-500",
                            expired: "bg-orange-500",
                            failure: "bg-black",
                            unknown: "bg-gray-400",
                          }[orderDetail.payments.payment_status]
                        : "bg-gray-400"
                    }`}
                  >
                    {orderDetail?.payments?.payment_status || "N/A"}
                  </div>
                </td>
              </tr>

              <tr>
                <td className="px-4 py-2 font-medium text-gray-600">
                  Metode Pembayaran
                </td>
                <td className="px-4 py-2 font-bold">
                  {orderDetail?.payments.payment_method}
                </td>
              </tr>

              <tr>
                <td className="px-4 py-2 font-medium text-gray-600">
                  Transaksi Dibuat
                </td>
                <td className="px-4 py-2 font-bold">
                  {orderDetail?.payments.payment_create_date}
                </td>
              </tr>

              {/* Countdown Timer */}
              <tr>
                <td className="px-4 py-2 font-medium text-gray-600">
                  Batas Waktu Pembayaran
                </td>
                <td className="px-4 py-2 font-bold">
                  {orderDetail?.payments.payment_expired_date}
                </td>
              </tr>

              <tr>
                <td className="px-4 py-2 font-medium text-gray-600">
                  Sisa Waktu Pembayaran
                </td>
                <td className="px-4 py-2 font-bold">
                  <CountdownTimer
                    paymentExpiredDate={
                      orderDetail?.payments.payment_expired_date || ""
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {orderDetail?.payments.payment_status === "pending" && (
            <div className="mt-6">
              <button
                onClick={handleConfirmPayment}
                className={`w-full py-3 text-white font-semibold rounded-lg ${
                  isPaymentExpired
                    ? "bg-gray-400 cursor-not-allowed"
                    : isPolling
                    ? "bg-gray-400"
                    : "bg-teal-500 hover:bg-teal-500/80"
                } transition`}
                disabled={isPaymentExpired || isPolling}
              >
                {isPolling
                  ? `Tunggu yaa, lagi ngecek pembayaran kamu...`
                  : "Konfirmasi Pembayaran"}
              </button>
              {isPaymentExpired && (
                <p className="mt-2 text-sm text-red-600">
                  Maaf, pembayaran sudah kedaluwarsa. Silakan membuat transaksi
                  baru.
                </p>
              )}

              <button
                onClick={savePaymentLink}
                className={`w-full py-3 text-white font-semibold rounded-lg mt-3 bg-primary hover:bg-primary/70`}
              >
                <FileCopy className="text-white" />
                Salin Link Pembayaran
              </button>
            </div>
          )}
        </div>

        {/* Customer Details */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
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
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
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
                <p className="text-sm text-gray-500 truncate">
                  Catatan: {product.notes}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Price Details */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Kode Transaksi</h3>
          <Close onClick={onClose} className="cursor-pointer" />
        </div>
        <p className="mt-4 text-gray-600">
          Pastikan Anda menyertakan kode transaksi saat melakukan pembayaran.
        </p>
        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 text-white rounded-lg bg-primary"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

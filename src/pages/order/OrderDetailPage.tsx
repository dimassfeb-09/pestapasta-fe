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
    setPollingCount(0);
    setIsPolling(true);
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

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
          return;
        }

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
      }, 10000);
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
    } catch (e: unknown) {
      const err = e as { status?: number };
      if (err.status === 404) {
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

  const statusColor: Record<string, string> = {
    success: "bg-greenTeal text-white",
    canceled: "bg-red-500 text-white",
    pending: "bg-yellow-500 text-white",
    authorize: "bg-blue-500 text-white",
    expired: "bg-orange-500 text-white",
    failure: "bg-gray-900 text-white",
    unknown: "bg-gray-400 text-white",
  };
  const statusClass =
    statusColor[orderDetail?.payments?.payment_status ?? "unknown"] ??
    "bg-gray-400 text-white";

  return (
    <div className="flex flex-col min-h-screen px-5 py-4 space-y-4">
      <div className="p-5 bg-white border border-gray-100 shadow-card rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink">Detail Pembayaran</h2>
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusClass}`}>
            {orderDetail?.payments?.payment_status?.toUpperCase() || "N/A"}
          </span>
        </div>

        {orderDetail?.payments.payment_method === "QRIS" &&
        orderDetail?.payments.payment_status !== "success" ? (
          <div className="mb-4">
            <p className="mb-3 text-sm text-muted">
              Pastikan jumlah yang dibayarkan sesuai dengan total yang tertera.
            </p>
            <div className="flex justify-center">
              <img
                src={orderDetail?.payments.payment_qr_code_url}
                alt="QRIS"
                className="w-40 h-40 rounded-xl"
                draggable={false}
              />
            </div>
          </div>
        ) : null}

        <dl className="divide-y divide-gray-100">
          {orderDetail?.payments.payment_method !== "QRIS" && (
            <>
              <Row label="Nomor Rekening" value={orderDetail?.payments.payment_account_number} />
              <Row label="Atas Nama" value={orderDetail?.payments.payment_account_name} />
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-sm text-muted flex items-center gap-1.5">
                  Keterangan Berita
                  <button
                    type="button"
                    onClick={handleDialogToggle}
                    className="flex items-center justify-center w-5 h-5 text-white rounded-full bg-primary"
                    aria-label="Info kode transaksi"
                  >
                    <QuestionMarkRounded style={{ fontSize: 12 }} />
                  </button>
                </dt>
                <dd className="text-sm font-bold text-ink">
                  {orderDetail?.payments.transaction_code}
                </dd>
              </div>
            </>
          )}
          <Row
            label="Order ID"
            value={
              <span className="px-2 py-0.5 text-xs font-bold text-white bg-primary rounded-md">
                {orderDetail?.id}
              </span>
            }
          />
          <Row label="Metode Pembayaran" value={orderDetail?.payments.payment_method} />
          <Row label="Transaksi Dibuat" value={orderDetail?.payments.payment_create_date} />
          <Row label="Batas Waktu" value={orderDetail?.payments.payment_expired_date} />
          {orderDetail?.payments.payment_status == "pending" && (
            <Row
              label="Sisa Waktu"
              value={
                <CountdownTimer
                  paymentExpiredDate={
                    orderDetail?.payments.payment_expired_date || ""
                  }
                />
              }
            />
          )}
        </dl>

        {orderDetail?.payments.payment_status === "pending" && (
          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={isPaymentExpired || isPolling}
              className={`w-full py-3 text-white font-semibold rounded-xl transition ${
                isPaymentExpired || isPolling
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-greenTeal hover:bg-greenTealDark"
              }`}
            >
              {isPolling
                ? "Tunggu yaa, lagi ngecek pembayaran kamu..."
                : "Konfirmasi Pembayaran"}
            </button>
            {isPaymentExpired && (
              <p className="text-sm text-red-600">
                Maaf, pembayaran sudah kedaluwarsa. Silakan membuat transaksi baru.
              </p>
            )}
            <button
              type="button"
              onClick={savePaymentLink}
              className="flex items-center justify-center gap-2 w-full py-3 text-white font-semibold bg-primary rounded-xl hover:bg-primaryDark transition"
            >
              <FileCopy fontSize="small" />
              Salin Link Pembayaran
            </button>
          </div>
        )}
      </div>

      <div className="p-5 bg-white border border-gray-100 shadow-card rounded-2xl">
        <h2 className="mb-3 text-lg font-bold text-ink">Detail Pemesan</h2>
        <div className="space-y-1.5 text-sm">
          <div className="text-ink font-medium">{orderDetail?.name}</div>
          <div className="text-muted">{orderDetail?.email}</div>
        </div>
      </div>

      <div className="p-5 bg-white border border-gray-100 shadow-card rounded-2xl">
        <h2 className="mb-3 text-lg font-bold text-ink">Ringkasan Produk</h2>
        <div className="space-y-3">
          {orderDetail?.order_details.map((product) => (
            <div key={product.id} className="flex gap-3">
              <img
                src={product.menu_detail.image_url}
                alt={product.menu_detail.name}
                className="object-cover w-16 h-16 rounded-xl shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-ink">{product.menu_detail.name}</div>
                <p className="text-xs text-muted line-clamp-1">
                  {product.menu_detail.description}
                </p>
                <div className="flex gap-2 mt-1 text-xs text-muted">
                  <span>{product.quantity} x</span>
                  <span>{formatToRupiah(product.subtotal_price)}</span>
                </div>
                {product.notes && (
                  <p className="text-xs text-muted mt-0.5">
                    Catatan: {product.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 bg-white border border-gray-100 shadow-card rounded-2xl">
        <h2 className="mb-3 text-lg font-bold text-ink">Detail Harga</h2>
        <div className="space-y-2 text-sm">
          {orderDetail?.order_details.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-muted">{item.menu_detail.name}</span>
              <span className="font-medium text-ink">
                {formatToRupiah(item.menu_detail.price)}
              </span>
            </div>
          ))}
          <div className="h-px bg-gray-100 my-2" />
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span className="font-semibold text-ink">{formatToRupiah(total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Pajak (10%)</span>
            <span className="font-semibold text-ink">{formatToRupiah(total * 0.1)}</span>
          </div>
          <div className="flex justify-between pt-2 mt-2 border-t border-gray-100 font-bold text-ink">
            <span>Total Pembayaran</span>
            <span>{formatToRupiah(total * 1.1)}</span>
          </div>
        </div>
      </div>

      {showDialog && <DialogTransactionCode onClose={handleDialogToggle} />}
    </div>
  );
}

const Row = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center justify-between py-2.5">
    <dt className="text-sm text-muted">{label}</dt>
    <dd className="text-sm font-bold text-ink text-right">{value}</dd>
  </div>
);

const DialogTransactionCode = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm z-50 p-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Kode Transaksi</h3>
          <Close onClick={onClose} className="cursor-pointer text-muted" />
        </div>
        <p className="mt-3 text-sm text-muted">
          Pastikan Anda menyertakan kode transaksi saat melakukan pembayaran.
        </p>
        <div className="flex justify-center mt-5">
          <button
            type="button"
            className="px-5 py-2.5 text-white rounded-xl bg-primary hover:bg-primaryDark transition"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

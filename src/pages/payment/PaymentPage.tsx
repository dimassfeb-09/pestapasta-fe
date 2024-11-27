import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckoutItem } from "../../models/CheckoutItem";
import { formatToRupiah } from "../../utills/toRupiah";
import { PaymentMethod } from "../../models/PaymentMethod";
import { Close, QuestionMarkRounded } from "@mui/icons-material";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const payment: PaymentMethod = location.state?.payment;
  const name = location.state?.name;
  const email = location.state?.email;
  const products: CheckoutItem[] = location.state?.products;
  const transaction = location.state?.transaction;

  useEffect(() => {
    if (!payment) {
      navigate("/checkout");
    }
  }, [payment, navigate]);

  const total = (products || []).reduce(
    (sum, item) => sum + item.price * item.total_item,
    0
  );

  const handleDialogToggle = () => setShowDialog((prev) => !prev);

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-4">
        <div className="p-4 mb-4 bg-white border rounded-lg">
          <h2 className="mb-4 text-lg font-semibold">Detail Pembayaran</h2>

          <p className="text-sm text-gray-600">
            Pastikan jumlah yang dibayarkan sesuai dengan total yang tertera di
            bawah ini.
          </p>

          {/* Table Layout */}
          <table className="w-full mt-3 text-sm text-left text-gray-600">
            <tbody>
              <tr>
                <td className="py-2 font-medium">Metode Pembayaran</td>
                <td className="py-2 font-bold">{payment.name}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Nomor Rekening</td>
                <td className="py-2 font-bold">{payment.account_number}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Atas Nama</td>
                <td className="py-2 font-bold">PT Seblak Shabrina Jaya</td>
              </tr>
              <tr>
                <td className="flex items-center gap-2 py-2 font-medium ">
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
                <td className="py-2 font-bold">
                  {transaction.transaction_code}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Help Section */}
        </div>

        <div className="p-4 mb-4 bg-white border rounded-lg">
          <h2 className="mb-4 text-lg font-semibold">Detail Pemesan</h2>
          <div className="flex justify-between mb-3">
            <span className="text-gray-600">{name}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-gray-600">{email}</span>
          </div>
        </div>

        <div className="p-4 mb-4 bg-white border rounded-lg">
          <h2 className="mb-4 text-lg font-semibold">Ringkasan Produk</h2>
          {products.map((product) => (
            <div key={product.id} className="flex items-start mb-3 space-x-4">
              <img
                src={product.image_url}
                alt={product.name}
                className="object-cover w-20 h-20 rounded-lg"
              />
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500 truncate-line">
                  {product.description}
                </p>

                <div className="flex gap-1">
                  <p className="text-sm text-gray-500">
                    {product.total_item} x
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatToRupiah(product.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border rounded-lg">
          <h2 className="mb-4 text-lg font-semibold">Detail Harga</h2>
          {products.map((item, index) => (
            <div key={index} className="flex justify-between mb-3">
              <span className="text-gray-600">{item.name}</span>
              <span className="font-medium">{formatToRupiah(item.price)}</span>
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

        <div className="mt-5 bg-white">
          <button className="w-full py-3 font-medium text-white rounded-lg bg-greenTeal">
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>

      {showDialog && <DialogTransactionCode onClose={handleDialogToggle} />}
    </div>
  );
}

const DialogTransactionCode = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative p-3 m-5 bg-white rounded-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-800"
        >
          <Close />
        </button>

        {/* Content */}
        <h3 className="mb-4 text-lg font-semibold">
          Apa itu keterangan berita?
        </h3>
        <img
          src="assets/apa_itu_kode_transaksijpg.jpg"
          alt="Apa itu keterangan berita"
          className="w-full"
        />
      </div>
    </div>
  );
};

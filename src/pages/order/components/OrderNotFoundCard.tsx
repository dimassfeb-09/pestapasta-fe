import React from "react";
import { Link } from "react-router-dom";

interface OrderNotFoundCardProps {
  orderId: string;
}

const OrderNotFoundCard: React.FC<OrderNotFoundCardProps> = ({ orderId }) => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-100 shadow-card rounded-2xl text-center">
      <h2 className="text-xl font-bold text-ink mb-2">Pesanan tidak ditemukan</h2>
      <p className="text-sm text-muted mb-1">
        Pesanan dengan ID <strong className="text-ink">{orderId}</strong> tidak
        dapat ditemukan.
      </p>
      <p className="text-sm text-muted mb-6">
        Periksa kembali ID pesanan atau hubungi customer service.
      </p>
      <Link
        className="inline-flex px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primaryDark transition"
        to="/"
      >
        Kembali ke Menu
      </Link>
    </div>
  );
};

export default OrderNotFoundCard;

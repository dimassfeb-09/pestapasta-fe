import React from "react";
import { Link } from "react-router-dom";

interface OrderNotFoundCardProps {
  orderId: string;
}

const OrderNotFoundCard: React.FC<OrderNotFoundCardProps> = ({ orderId }) => {
  return (
    <div className="max-w-md mx-auto bg-red-100 border border-red-400 rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-semibold text-red-700 mb-4">
        Order Not Found
      </h2>
      <p className="text-lg text-red-700 mb-2">
        We're sorry, but the order with ID <strong>{orderId}</strong> could not
        be found.
      </p>
      <p className="text-sm text-yellow-800 mb-6">
        Please check the order ID and try again. If you continue to experience
        issues, please contact support.
      </p>
      <Link
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        to="/"
      >
        Go Back
      </Link>
    </div>
  );
};

export default OrderNotFoundCard;

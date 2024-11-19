import { useState } from "react";
import { formatToRupiah } from "../../utills/toRupiah";
import CardMenuCheckout from "./components/CardMenuCheckout";

export default function CheckoutPage() {
  const [isPaymentMethodActive, setIsPaymentMethodActive] =
    useState<boolean>(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  const handleToggle = () => {
    setIsPaymentMethodActive(!isPaymentMethodActive);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="flex items-center justify-center py-4 text-xl font-bold text-primary">
        Checkout
      </h2>

      <div className="flex flex-col gap-5 px-5 py-3 ">
        <CardMenuCheckout
          id={1}
          title={"Nama Makanan"}
          rating={5.0}
          price={10000}
          total_item={5}
          image_url={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs2paowiODEqEOJ082fLEWgrlBjvBlGd2GrQ&s"
          }
          onNoteChange={(note) => {
            console.log(note);
          }}
        />
      </div>

      <div className="px-5 py-3">
        {/* Payment Summary Section */}
        <div className="z-10 p-4 border shadow-lg rounded-t-xl">
          <div className="mb-3 text-lg font-bold">Ringkasan Pembayaran</div>

          <div className="flex justify-between w-full mb-2">
            <div>Harga</div>
            <div>{formatToRupiah(10000)}</div>
          </div>

          <div className="flex justify-between w-full mb-2">
            <div>Pajak</div>
            <div>10%</div>
          </div>

          <div className="flex justify-between w-full mb-2">
            <div>Diskon</div>
            <div>0</div>
          </div>

          <div className="w-full h-0.5 my-3 bg-gray-300"></div>

          <div className="flex justify-between w-full font-bold">
            <div>Total</div>
            <div>{formatToRupiah(10000)}</div>
          </div>
        </div>

        {/* Payment Method Toggle Section (Below the Summary) */}
        <div
          className={`bg-teal-500 text-white font-semibold p-3 ${
            isPaymentMethodActive ? "rounded-b-none" : "rounded-b-lg"
          } transition-all duration-300 ease-in-out w-full cursor-pointer`}
          onClick={handleToggle}
        >
          {selectedPaymentMethod || "Pilih Metode Pembayaran"}
        </div>

        <div
          className={`overflow-hidden bg-teal-500 rounded-b-lg text-white transition-all duration-500 ease-in-out transform w-full ${
            isPaymentMethodActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{
            transitionProperty: "max-height, opacity, transform",
          }}
        >
          {/* Konten Metode Pembayaran */}
          <div
            className={`flex flex-col transition-opacity duration-500 ease-in-out ${
              isPaymentMethodActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {["BCA", "QRIS", "SEABANK"].map((method) => (
              <div
                key={method}
                className="p-3 cursor-pointer hover:bg-teal-300"
                onClick={() => {
                  setIsPaymentMethodActive(false);
                  setSelectedPaymentMethod(method);
                }}
              >
                {method}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center p-3 mt-5 text-lg font-bold text-white bg-black rounded-full">
          Pesan Sekarang
        </div>
      </div>
    </div>
  );
}

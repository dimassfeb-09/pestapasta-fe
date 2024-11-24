import { useEffect, useState } from "react";
import { formatToRupiah } from "../../utills/toRupiah";
import CardMenuCheckout from "./components/CardMenuCheckout";
import { Product } from "../../models/Product";
import { CheckoutItem } from "../../models/CheckoutItem";

export default function CheckoutPage() {
  const [isPaymentMethodActive, setIsPaymentMethodActive] =
    useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Dimas Sugar Tea with Caramel Smile",
      description: "Minuman rasa Dimas manis.",
      rating: 5.0,
      category_id: 1,
      price: 10000,
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs2paowiODEqEOJ082fLEWgrlBjvBlGd2GrQ&s",
    },
    {
      id: 2,
      name: "Vanilla Latte Supreme",
      description: "Kopi latte dengan rasa vanilla khas.",
      rating: 4.8,
      category_id: 2,
      price: 20000,
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs2paowiODEqEOJ082fLEWgrlBjvBlGd2GrQ&s",
    },
  ]);

  const handleToggle = () => {
    setIsPaymentMethodActive(!isPaymentMethodActive);
  };

  const handleNoteChange = (id: number, note: string) => {
    const updatedItems = checkoutItems.map((item) =>
      item.id === id ? { ...item, note } : item
    );
    setCheckoutItems(updatedItems);
    localStorage.setItem("checkout_items", JSON.stringify(updatedItems));
  };

  useEffect(() => {
    const storedItems = JSON.parse(
      localStorage.getItem("checkout_items") || "[]"
    );
    if (Array.isArray(storedItems)) {
      setCheckoutItems(storedItems);
    }
  }, []);

  const updateLocalStorage = (items: CheckoutItem[]) => {
    localStorage.setItem("checkout_items", JSON.stringify(items));
    setCheckoutItems([...items]);
  };

  const handleAddToCheckout = (product: Product) => {
    const updatedItems = [...checkoutItems];
    const existingItem = updatedItems.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.total_item += 1;
    } else {
      updatedItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        category_id: product.category_id,
        image_url: product.image_url,
        total_item: 1,
        note: "",
      });
    }

    updateLocalStorage(updatedItems);
  };

  const handleRemoveFromCheckout = (product: Product) => {
    const updatedItems = checkoutItems.reduce((acc, item) => {
      if (item.id === product.id) {
        if (item.total_item > 1) {
          acc.push({ ...item, total_item: item.total_item - 1 });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, [] as CheckoutItem[]);

    updateLocalStorage(updatedItems);
  };

  const totalAmount = checkoutItems.reduce(
    (total, item) => total + item.price * item.total_item,
    0
  );

  const finalPrice = totalAmount * 1.1;

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="flex items-center justify-center py-4 text-xl font-bold text-primary">
        Checkout
      </h2>

      <div className="flex flex-col gap-5 px-5 py-3 ">
        {checkoutItems.map((item) => (
          <CardMenuCheckout
            key={item.id}
            product={{
              ...item,
              price:
                products.find((product) => product.id == item.id)?.price ?? 0,
              rating:
                products.find((product) => product.id == item.id)?.rating ?? 0,
            }}
            total_item={
              checkoutItems.find((checkout) => checkout.id == item.id)
                ?.total_item ?? 0
            }
            note={item.note}
            onNote={(note) => handleNoteChange(item.id, note)}
            onAdd={handleAddToCheckout}
            onRemove={handleRemoveFromCheckout}
          />
        ))}
      </div>

      <div className="px-5 py-3">
        {/* Payment Summary Section */}
        <div className="z-10 p-4 border shadow-lg rounded-t-xl">
          <div className="mb-3 text-lg font-bold">Ringkasan Pembayaran</div>

          <div className="flex justify-between w-full mb-2">
            <div>Harga</div>
            <div>{formatToRupiah(totalAmount)}</div>
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
            <div>{formatToRupiah(finalPrice)}</div> {/* Assuming a 10% tax */}
          </div>
        </div>

        {/* Payment Method Toggle Section */}
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

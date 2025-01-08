import { useEffect, useState } from "react";
import { formatToRupiah } from "../../utills/toRupiah";
import CardMenuCheckout from "./components/CardMenuCheckout";
import { Product } from "../../models/Product";
import { CheckoutItem } from "../../models/CheckoutItem";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "@mui/icons-material";
import axios from "axios";
import { PaymentMethod } from "../../models/PaymentMethod";
import { toast } from "react-toastify";
import { api } from "../../utills/mode";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [isPaymentMethodActive, setIsPaymentMethodActive] =
    useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const fetchCheckoutItems = () => {
    const storedItems = JSON.parse(
      localStorage.getItem("checkout_items") || "[]"
    );
    if (Array.isArray(storedItems) && storedItems.length > 0) {
      setCheckoutItems(storedItems);
    } else {
      navigate("/");
    }
  };

  const fetchAllMenus = async () => {
    try {
      const apiConfig = api();
      const response = await axios.get<Product[]>(`${apiConfig.baseURL}/menus`);
      setProducts(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const updateIsAvailableStock = () => {
    checkoutItems.forEach((checkout) => {
      const product = products.find(
        (product) => checkout.product.id === product.id
      );
      if (product) {
        checkout.product = product;
      }
    });

    updateLocalStorage(checkoutItems);
  };

  const fetchPaymentMethods = async () => {
    try {
      const apiConfig = api();
      const response = await axios.get(`${apiConfig.baseURL}/payment_methods`);
      setPaymentMethods(response.data); // Store payment methods in state
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const updateLocalStorage = (items: CheckoutItem[]) => {
    localStorage.setItem("checkout_items", JSON.stringify(items));
    setCheckoutItems([...items]);
  };

  const handleToggle = () => {
    setIsPaymentMethodActive(!isPaymentMethodActive);
  };

  const handleNoteChange = (id: number, note: string) => {
    const updatedItems = checkoutItems.map((item) =>
      item.product.id === id ? { ...item, note } : item
    );
    setCheckoutItems(updatedItems);
    localStorage.setItem("checkout_items", JSON.stringify(updatedItems));
  };

  const handleIncrementItemFromCheckout = (product: Product) => {
    const updatedItems = [...checkoutItems];
    const existingItem = updatedItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.total_item += 1;
      existingItem.product.price = product.price;
    } else {
      updatedItems.push({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          category_id: product.category_id,
          image_url: product.image_url,
          is_available: product.is_available,
          rating: product.rating,
        },
        total_item: 1,
        note: "",
      });
    }

    localStorage.setItem("checkout_items", JSON.stringify(updatedItems));
    setCheckoutItems(updatedItems);
  };

  const handleDecrementItemFromCheckout = (product: Product) => {
    const updatedItems = checkoutItems.reduce((acc, item) => {
      if (item.product.id === product.id) {
        if (item.total_item > 1) {
          acc.push({ ...item, total_item: item.total_item - 1 });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, [] as CheckoutItem[]);

    updateLocalStorage(updatedItems);

    if (updatedItems.length == 0) {
      navigate("/");
    }
  };

  const handleRemoveProductFromCheckout = (id: number) => {
    const updatedItems = checkoutItems.filter(
      (checkout) => checkout.product.id != id
    );
    updateLocalStorage(updatedItems);
  };

  const handleSubmit = () => {
    updateIsAvailableStock();

    if (checkIsSomeProductIsOutOfStock()) return;
    if (checkoutItems.length === 0) {
      toast.error("Keranjang kamu masih kosong nih...");
    } else if (!selectedPaymentMethod) {
      toast.error("Kamu belum pilih metode pembayaran nih...");
    } else {
      navigate("/confirm_user", {
        state: { payment: selectedPaymentMethod, checkoutItems },
      });
    }
  };

  const checkIsSomeProductIsOutOfStock = () => {
    const unavailableProduct = checkoutItems.find(
      (checkout) => !checkout.product.is_available
    );
    if (unavailableProduct) {
      toast.error(
        `Terdapat produk kosong: ${unavailableProduct.product.name}, harap hapus terlebih dahulu`
      );
      return true;
    }

    return false;
  };

  useEffect(() => {
    fetchAllMenus();
    fetchPaymentMethods();
    fetchCheckoutItems();
  }, []);

  const totalAmount = checkoutItems.reduce(
    (total, item) => total + item.product.price * item.total_item,
    0
  );
  const finalPrice = totalAmount * 1.1;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center">
          <ChevronLeft onClick={() => navigate("/")} className="w-6 h-6" />
          <h1 className="ml-2 text-lg font-medium">Checkout</h1>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5 py-3 ">
        {checkoutItems.map((item) => {
          const product = products.find(
            (product) => product.id === item.product.id
          );
          if (!product) return null;
          return (
            <CardMenuCheckout
              key={item.product.id}
              product={{
                ...item.product,
                price: product.price, // Using the fetched price
                rating: product.rating, // Using the fetched rating
                is_available: product.is_available,
              }}
              total_item={
                checkoutItems.find(
                  (checkout) => checkout.product.id == item.product.id
                )?.total_item ?? 0
              }
              note={item.note}
              onNote={(note) => handleNoteChange(item.product.id, note)}
              onIncrementItem={() => handleIncrementItemFromCheckout(product)}
              onDecrementItem={() => handleDecrementItemFromCheckout(product)}
              onRemoveProduct={() =>
                handleRemoveProductFromCheckout(product.id)
              }
            />
          );
        })}
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
          {selectedPaymentMethod?.name || "Pilih Metode Pembayaran"}
        </div>

        <div
          className={`overflow-hidden bg-teal-500 rounded-b-lg text-white transition-all duration-500 ease-in-out transform w-full ${
            isPaymentMethodActive ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{
            transitionProperty: "max-height, opacity, transform",
          }}
        >
          {/* Payment Methods List */}
          <div
            className={`flex flex-col transition-opacity duration-500 ease-in-out ${
              isPaymentMethodActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Loop through each payment method */}
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="p-3 transition-colors cursor-pointer hover:bg-teal-300"
                onClick={() => {
                  setIsPaymentMethodActive(false); // Close the dropdown
                  setSelectedPaymentMethod(method); // Set the selected payment method
                }}
              >
                {method.name}
              </div>
            ))}
          </div>
        </div>

        <div
          onClick={handleSubmit}
          className="flex items-center justify-center p-3 mt-5 text-lg font-bold text-white bg-black rounded-full cursor-pointer"
        >
          Pesan Sekarang
        </div>
      </div>
    </div>
  );
}

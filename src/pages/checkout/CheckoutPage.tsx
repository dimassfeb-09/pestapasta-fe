import { useEffect, useState } from "react";
import { formatToRupiah } from "../../utills/toRupiah";
import CardMenuCheckout from "./components/CardMenuCheckout";
import { Product } from "../../models/Product";
import { CheckoutItem } from "../../models/CheckoutItem";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ExpandMore } from "@mui/icons-material";
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
      if (Array.isArray(response.data)) setProducts(response.data);
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
      setPaymentMethods(response.data);
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
      <div className="sticky top-14 z-40 flex items-center gap-2 px-5 py-3 bg-canvas">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-card text-ink hover:bg-gray-50 transition"
          aria-label="Kembali"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-lg font-bold text-ink">Checkout</h1>
      </div>

      <div className="flex flex-col gap-3 px-5 pb-6">
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
                price: product.price,
                rating: product.rating,
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

      <div className="px-5 pb-6 space-y-3">
        <div className="p-4 bg-white border border-gray-100 shadow-card rounded-2xl">
          <div className="mb-3 text-base font-bold text-ink">
            Ringkasan Pembayaran
          </div>

          <div className="flex justify-between text-sm text-muted mb-1.5">
            <span>Harga</span>
            <span className="text-ink">{formatToRupiah(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted mb-1.5">
            <span>Pajak</span>
            <span className="text-ink">10%</span>
          </div>
          <div className="flex justify-between text-sm text-muted mb-3">
            <span>Diskon</span>
            <span className="text-ink">0</span>
          </div>

          <div className="h-px bg-gray-100 mb-3" />

          <div className="flex justify-between font-bold text-ink">
            <span>Total</span>
            <span>{formatToRupiah(finalPrice)}</span>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={handleToggle}
            className={`flex items-center justify-between w-full px-4 py-3 font-semibold rounded-2xl transition ${
              isPaymentMethodActive
                ? "bg-greenTeal text-white rounded-b-none"
                : "bg-greenTeal text-white"
            }`}
          >
            <span>
              {selectedPaymentMethod?.name || "Pilih Metode Pembayaran"}
            </span>
            <ExpandMore
              className={`transition-transform ${
                isPaymentMethodActive ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`overflow-hidden bg-greenTeal rounded-b-2xl text-white transition-all duration-300 ${
              isPaymentMethodActive ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => {
                    setIsPaymentMethodActive(false);
                    setSelectedPaymentMethod(method);
                  }}
                  className="px-4 py-3 text-left transition-colors hover:bg-greenTealDark"
                >
                  {method.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center justify-center w-full py-3.5 text-white font-bold bg-ink rounded-2xl hover:bg-black active:scale-[0.99] transition"
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
}

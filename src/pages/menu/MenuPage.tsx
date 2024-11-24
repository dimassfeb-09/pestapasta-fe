import { useState, useEffect } from "react";
import { formatToRupiah } from "../../utills/toRupiah";
import CardMenu from "./components/CardMenu";
import { ShoppingCart } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { CheckoutItem } from "../../models/CheckoutItem";
import { Product } from "../../models/Product";

export default function MenuPage() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [products, _] = useState<Product[]>([
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

  // Derived state for total items and total price
  const totalItems = checkoutItems.reduce(
    (acc, item) => acc + item.total_item,
    0
  );
  const totalPrice = checkoutItems.reduce(
    (acc, item) => acc + item.price * item.total_item,
    0
  );

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      if (window.scrollY !== lastScrollY) {
        setIsScrolling(true);
        lastScrollY = window.scrollY;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
        }, 300);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="flex items-center justify-center py-4 text-xl font-bold text-primary">
        Menu
      </h2>

      <div className="flex flex-col flex-grow gap-5 px-5 py-3 pb-20">
        <div className="font-bold">Kategori</div>
        {products.map((product) => (
          <CardMenu
            total_item={
              checkoutItems.find((v) => v.id == product.id)?.total_item ?? 0
            }
            product={product}
            onAdd={handleAddToCheckout}
            onRemove={handleRemoveFromCheckout}
            color={"red"}
          />
        ))}
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center w-full rounded-full transition-transform duration-300 ${
          isScrolling ? "translate-y-20" : "-translate-y-5"
        }`}
      >
        <Link
          to="/checkout"
          className="flex justify-between w-[90%] px-4 py-3 text-white bg-black rounded-full"
        >
          <div>
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            <div>{formatToRupiah(totalPrice)}</div>
            <ShoppingCart className="text-yellow-500" fontSize="small" />
          </div>
        </Link>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { formatToRupiah } from "../../utills/toRupiah";
import CardMenu from "./components/CardMenu";
import { ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { CheckoutItem } from "../../models/CheckoutItem";
import { Product } from "../../models/Product";
import { Category } from "../../models/Category";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { toast } from "react-toastify";
import { api } from "../../utills/mode";

export default function MenuPage() {
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorizedMenus, setCategorizedMenus] = useState<Record<string, Product[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [shakingButton, setShakingButton] = useState<boolean>(false);
  const navigate = useNavigate();

  const totalItems = checkoutItems.reduce(
    (acc, item) => acc + item.total_item,
    0
  );
  const totalPrice = checkoutItems.reduce(
    (acc, item) => acc + item.product.price * item.total_item,
    0
  );

  useEffect(() => {
    const apiConfig = api();
    axios
      .get<Product[]>(`${apiConfig.baseURL}/menus`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          response.data.sort((a, b) => {
            if (b.is_available === a.is_available) {
              return a.id - b.id;
            }
            return b.is_available === true ? 1 : -1;
          });
          setProducts(response.data);
        }
      })
      .catch((error) => console.error("Error fetching menu items:", error));

    axios
      .get(`${apiConfig.baseURL}/categories`)
      .then((response) => {
        if (Array.isArray(response.data)) setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    if (products.length > 0 && categories.length > 0) {
      const categorized = categories.reduce((acc, category) => {
        const categoryProducts = products.filter(
          (product) => product.category_id === category.id
        );
        acc[category.category_name] = categoryProducts;
        return acc;
      }, {} as Record<string, Product[]>);
      setCategorizedMenus(categorized);

      if (categories.length > 0) {
        const defaultExpandedCategory = categories[0].category_name;
        setExpandedCategories((prev) => ({
          ...prev,
          [defaultExpandedCategory]: true,
        }));
      }
    }
  }, [products, categories]);

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
    const existingItem = updatedItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.total_item += 1;
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

    updateLocalStorage(updatedItems);
  };

  const handleRemoveFromCheckout = (product: Product) => {
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
  };

  const handleCategoryToggle = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleButtonClick = () => {
    if (totalItems === 0) {
      setShakingButton(true);
      toast.error("Keranjang kamu masih kosong nih...");

      setTimeout(() => {
        setShakingButton(false);
      }, 1000);
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-ink">Menu</h1>
        <p className="text-sm text-muted">Pilih menu favoritmu hari ini.</p>
      </div>

      <div className="flex flex-col gap-4 px-5 pb-28">
        {Object.keys(categorizedMenus).map((categoryName) => (
          <section key={categoryName}>
            <button
              type="button"
              onClick={() => handleCategoryToggle(categoryName)}
              className="flex items-center justify-between w-full py-2"
            >
              <span
                className={`font-semibold tracking-wide transition-colors ${
                  expandedCategories[categoryName]
                    ? "text-ink text-base"
                    : "text-muted text-sm"
                }`}
              >
                {categoryName.toUpperCase()}
              </span>
              {expandedCategories[categoryName] ? (
                <ExpandLess className="text-muted" />
              ) : (
                <ExpandMore className="text-primary" />
              )}
            </button>

            {expandedCategories[categoryName] && (
              <div className="flex flex-col gap-3 mt-2">
                {categorizedMenus[categoryName].map((product: Product) => (
                  <CardMenu
                    key={product.id}
                    total_item={
                      checkoutItems.find((v) => v.product.id === product.id)
                        ?.total_item ?? 0
                    }
                    product={product}
                    onAdd={handleAddToCheckout}
                    onRemove={handleRemoveFromCheckout}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <button
          onClick={handleButtonClick}
          className={`flex items-center justify-between w-full px-5 py-3.5 text-white rounded-2xl shadow-soft transition-transform duration-200 ${
            shakingButton ? "shake bg-red-500" : "bg-ink hover:bg-black"
          }`}
        >
          <span className="font-medium">
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-2 font-semibold">
            {formatToRupiah(totalPrice)}
            <ShoppingCart fontSize="small" className="text-secondary" />
          </span>
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { formatToRupiah } from "../../utills/toRupiah";
import CardMenu from "./components/CardMenu";
import { ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { CheckoutItem } from "../../models/CheckoutItem";
import { Product } from "../../models/Product";
import { ExpandMore, ExpandLess } from "@mui/icons-material"; // Import arrow icons
import { toast } from "react-toastify";
import { api } from "../../utills/mode";

export default function MenuPage() {
  const [isScrolling, _] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categorizedMenus, setCategorizedMenus] = useState<any>({});
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
        response.data.sort((a, b) => {
          if (b.is_available === a.is_available) {
            return a.id - b.id;
          }
          return b.is_available === true ? 1 : -1;
        });
        setProducts(response.data);
      })
      .catch((error) => console.error("Error fetching menu items:", error));

    axios
      .get(`${apiConfig.baseURL}/categories`)
      .then((response) => setCategories(response.data))
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
      }, {});
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

  // Toggle category expansion
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
      }, 1000); // 500ms is the duration of the shake animation
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="flex items-center justify-center py-4 text-xl font-bold text-primary">
        Menu
      </h2>

      <div className="flex flex-col flex-grow gap-5 px-5 py-3 pb-20">
        {Object.keys(categorizedMenus).map((categoryName) => (
          <div key={categoryName}>
            <div
              className="flex items-center mb-4 font-bold cursor-pointer"
              onClick={() => handleCategoryToggle(categoryName)}
            >
              <span
                className={`transition-all duration-300 ${
                  expandedCategories[categoryName] ? "text-lg" : "text-sm"
                }`}
              >
                {categoryName.toUpperCase()}
              </span>
              {expandedCategories[categoryName] ? (
                <ExpandLess className="ml-2 text-teal-500" />
              ) : (
                <ExpandMore className="ml-2 text-primary" />
              )}
            </div>

            {expandedCategories[categoryName] && (
              <div className="flex flex-col gap-3">
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
                    color={"red"}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className={`cursor-pointer fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center w-full rounded-full transition-transform duration-300 ${
          isScrolling ? "translate-y-20" : "-translate-y-5"
        }`}
      >
        <div
          onClick={handleButtonClick}
          className={`flex justify-between w-[90%] px-4 py-3 text-white bg-black rounded-full ${
            shakingButton ? "shake bg-red-500" : ""
          }`}
        >
          <div>
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            <div>{formatToRupiah(totalPrice)}</div>
            <ShoppingCart className="text-yellow-500" fontSize="small" />
          </div>
        </div>
      </div>
    </div>
  );
}

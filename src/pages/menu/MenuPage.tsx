import { useState, useEffect } from "react";
import axios from "axios";
import { formatToRupiah } from "../../utills/toRupiah";
import CardMenu from "./components/CardMenu";
import { ShoppingCart } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { CheckoutItem } from "../../models/CheckoutItem";
import { Product } from "../../models/Product";
import { ExpandMore, ExpandLess } from "@mui/icons-material"; // Import arrow icons
import { toast } from "react-toastify";

export default function MenuPage() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]); // Menu items from the backend
  const [categories, setCategories] = useState<any[]>([]); // Categories from the backend
  const [categorizedMenus, setCategorizedMenus] = useState<any>({}); // Categorized menus
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({}); // State for expanded categories
  const navigate = useNavigate();
  const [shakingButton, setShakingButton] = useState<boolean>(false);

  // Derived state for total items and total price
  const totalItems = checkoutItems.reduce(
    (acc, item) => acc + item.total_item,
    0
  );
  const totalPrice = checkoutItems.reduce(
    (acc, item) => acc + item.price * item.total_item,
    0
  );

  // Fetch the menu and categories from the backend API
  useEffect(() => {
    // Fetch menu items
    axios
      .get("http://localhost:8081/menus")
      .then((response) => {
        const fetchedProducts = response.data.map((item: Product) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image_url: item.image_url,
          category_id: item.category_id,
          rating: item.rating,
        }));
        setProducts(fetchedProducts);
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
      });

    axios
      .get("http://localhost:8081/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Classify menus based on category_id
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

      // Set the first category as expanded by default
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

      // Reset the shaking button after the animation (500ms based on the shake animation duration)
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
            {/* Category title that is clickable */}
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

              {/* Arrow icon */}
              {expandedCategories[categoryName] ? (
                <ExpandLess className="ml-2 text-primary" />
              ) : (
                <ExpandMore className="ml-2 text-primary" />
              )}
            </div>

            {/* Show products under the category if expanded */}
            {expandedCategories[categoryName] && (
              <div className="flex flex-col gap-3">
                {categorizedMenus[categoryName].map((product: Product) => (
                  <CardMenu
                    key={product.id}
                    total_item={
                      checkoutItems.find((v) => v.id === product.id)
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

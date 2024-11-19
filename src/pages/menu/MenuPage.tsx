import { useState, useEffect } from "react";
import { formatToRupiah } from "../../utills/toRupiah";
import CardMenu from "./components/CardMenu";
import { ShoppingCart } from "@mui/icons-material";

export default function MenuPage() {
  const [isScrolling, setIsScrolling] = useState(false); // Detect if scrolling is active

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: ReturnType<typeof setTimeout>; // Timeout variable using standard JavaScript setTimeout

    const handleScroll = () => {
      if (window.scrollY !== lastScrollY) {
        setIsScrolling(true); // Set scrolling active
      }

      lastScrollY = window.scrollY;

      // Clear the previous timeout and set a new one to detect inactivity
      clearTimeout(scrollTimeout);

      // After 300ms of no scrolling, hide the element
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false); // Scroll inactivity, hide the checkout
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout); // Cleanup the timeout on unmount
    };
  }, []); // Empty dependency array ensures this effect only runs once

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="flex items-center justify-center py-4 text-xl font-bold text-primary">
        Menu
      </h2>

      {/* Menu Items */}
      <div className="flex flex-col flex-grow gap-5 px-5 py-3 mb-20">
        <div className="font-bold">Kategori</div>

        {/* Menu Card */}
        <CardMenu
          id={1}
          title={"Dimas Sugar Tea with Caramel Smile"}
          description={"Minuman rasa Dimas manis."}
          rating={5.0}
          price={10000}
          image_url={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs2paowiODEqEOJ082fLEWgrlBjvBlGd2GrQ&s"
          }
          category={"pasta"}
          color_menu="#F9C880"
        />

        <CardMenu
          id={2}
          title={"Dimas Sugar Tea with Caramel Smile"}
          description={"Minuman rasa Dimas manis."}
          rating={5.0}
          price={10000}
          image_url={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs2paowiODEqEOJ082fLEWgrlBjvBlGd2GrQ&s"
          }
          category={"pasta"}
          color_menu="#F9F7DC"
        />

        {/* Additional CardMenu Components */}
        {/* Repeat CardMenu components as needed */}
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center w-full rounded-full transition-transform duration-300 ${
          isScrolling ? "translate-y-20" : "-translate-y-5"
        }`}
      >
        <div className="flex justify-between w-[90%] px-4 py-3 text-white bg-black rounded-full">
          <div>1 item</div>
          <div className="flex items-center gap-2">
            <div>{formatToRupiah(10000)}</div>
            <ShoppingCart className="text-yellow-500" fontSize="small" />
          </div>
        </div>
      </div>
    </div>
  );
}

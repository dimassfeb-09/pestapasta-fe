import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";
import MenuPage from "./pages/menu/MenuPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrderDetailPage from "./pages/order/OrderDetailPage";
import ConfirmPage from "./pages/confirm/ConfirmPage";
import { LoginAdminPage } from "./pages/admin/LoginPage";
import DefaultLayoutAdmin from "./layout/DefaultLayoutAdmin";
import { TransactionPage } from "./pages/admin/transaction/TransactionPage";
import ProductPage from "./pages/admin/product/ProductPage";
import AddProductPage from "./pages/admin/product/AddProductPage";
import CategoryPage from "./pages/admin/category/CategoryPage";
import AddCategoryPage from "./pages/admin/category/AddCategoryPage";
import UpdateProductPage from "./pages/admin/product/UpdateProductPage";
import UpdateCategoryPage from "./pages/admin/category/UpdateCategoryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout children={<MenuPage />} />} />

        <Route
          path="/checkout"
          element={<DefaultLayout children={<CheckoutPage />} />}
        />

        <Route
          path="/confirm_user"
          element={<DefaultLayout children={<ConfirmPage />} />}
        />

        <Route
          path="/order_detail/:orderId"
          element={<DefaultLayout children={<OrderDetailPage />} />}
        />

        <Route
          path="/admin/login"
          element={<DefaultLayoutAdmin children={<LoginAdminPage />} />}
        />

        <Route
          path="/admin/transaction"
          element={<DefaultLayoutAdmin children={<TransactionPage />} />}
        />

        <Route
          path="/admin/product"
          element={<DefaultLayoutAdmin children={<ProductPage />} />}
        />

        <Route
          path="/admin/product/add"
          element={<DefaultLayoutAdmin children={<AddProductPage />} />}
        />

        <Route
          path="/admin/product/:id/edit"
          element={<DefaultLayoutAdmin children={<UpdateProductPage />} />}
        />

        <Route
          path="/admin/categories"
          element={<DefaultLayoutAdmin children={<CategoryPage />} />}
        />

        <Route
          path="/admin/categories/add"
          element={<DefaultLayoutAdmin children={<AddCategoryPage />} />}
        />

        <Route
          path="/admin/categories/:id/edit"
          element={<DefaultLayoutAdmin children={<UpdateCategoryPage />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

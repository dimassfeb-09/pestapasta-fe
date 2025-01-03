import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";
import MenuPage from "./pages/menu/MenuPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrderDetailPage from "./pages/order/OrderDetailPage";
import ConfirmPage from "./pages/confirm/ConfirmPage";
import { LoginAdminPage } from "./pages/admin/LoginPage";
import DefaultLayoutAdmin from "./layout/DefaultLayoutAdmin";
import { TransactionTable } from "./pages/admin/Transaction";

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
          element={<DefaultLayoutAdmin children={<TransactionTable />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

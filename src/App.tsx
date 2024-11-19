import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";
import MenuPage from "./pages/menu/MenuPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout children={<MenuPage />} />} />

        <Route
          path="/checkout"
          element={<DefaultLayout children={<CheckoutPage />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

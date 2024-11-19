import DefaultLayout from "./layout/DefaultLayout";
import MenuPage from "./pages/menu/MenuPage";

function App() {
  return (
    <>
      <DefaultLayout>
        <MenuPage />
      </DefaultLayout>
    </>
  );
}

export default App;

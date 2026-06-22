import HomePage from "./pages/HomePage.jsx"
import MainLayout from "./layouts/MainLayout.jsx"
import CustomersPage from "./pages/CustomersPage.jsx"
import './App.css'

function App() {

  return (
    <div>
      <MainLayout>

        <CustomersPage />
      </MainLayout>
    </div>
  )
}

export default App

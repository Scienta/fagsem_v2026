import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import HomePage from './pages/HomePage.jsx'
import RecipeListPage from './pages/RecipeListPage.jsx'
import RecipeDetailPage from './pages/RecipeDetailPage.jsx'
import RecipeCreatePage from './pages/RecipeCreatePage.jsx'
import RecipeEditPage from './pages/RecipeEditPage.jsx'
import MenuListPage from './pages/MenuListPage.jsx'
import MenuDetailPage from './pages/MenuDetailPage.jsx'
import MenuCreatePage from './pages/MenuCreatePage.jsx'
import MenuEditPage from './pages/MenuEditPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipeListPage />} />
          <Route path="/recipes/new" element={<RecipeCreatePage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/recipes/:id/edit" element={<RecipeEditPage />} />
          <Route path="/menus" element={<MenuListPage />} />
          <Route path="/menus/new" element={<MenuCreatePage />} />
          <Route path="/menus/:id" element={<MenuDetailPage />} />
          <Route path="/menus/:id/edit" element={<MenuEditPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

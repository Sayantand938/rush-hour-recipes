import { Routes, Route } from 'react-router-dom';
import { RecipeList } from '@/components/RecipeList';
import { RecipeDetail } from '@/components/RecipeDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RecipeList />} />
      <Route path="/recipe/:slug" element={<RecipeDetail />} />
    </Routes>
  );
}
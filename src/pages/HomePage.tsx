import { useOutletContext } from 'react-router-dom';
import { Categories } from '../components/Categories';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { Hero } from '../components/Hero';
import type { Product } from '../types';

type HomeOutletContext = {
  addToCart: (p: Product) => void;
};

export default function HomePage() {
  const { addToCart } = useOutletContext<HomeOutletContext>();

  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts onAdd={addToCart} />
    </>
  );
}

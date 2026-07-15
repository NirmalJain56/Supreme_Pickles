import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTruck, FiAward, FiShield, FiRefreshCw } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { formatPrice } from '../utils/helpers';
import sliderImg1 from '../assets/slider1.jpg';

const categories = [
  {
    name: 'Pickles (Achar)',
    emoji: '🥒',
    description: 'Traditional recipes, pure ingredients',
    color: 'from-green-50 to-olive-100',
    accent: 'text-olive-400',
    link: '/products?category=Pickles',
  },
  {
    name: 'Spices (Masale)',
    emoji: '🌶️',
    description: 'Freshly ground, aromatic & pure',
    color: 'from-orange-50 to-mustard-100',
    accent: 'text-mustard-500',
    link: '/products?category=Spices',
  },
  {
    name: 'Combo Packs',
    emoji: '📦',
    description: 'Value bundles for every kitchen',
    color: 'from-cream-100 to-amber-100',
    accent: 'text-amber-600',
    link: '/products?category=Combos',
  },
  {
    name: 'Gift Hampers',
    emoji: '🎁',
    description: 'Premium gifting for special occasions',
    color: 'from-maroon-50 to-red-100',
    accent: 'text-maroon-500',
    link: '/products?category=Gift+Hampers',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Jaipur, Rajasthan',
    rating: 5,
    text: 'Exactly like my grandmother\'s recipe! The mango pickle is absolutely divine — tangy, spicy, and that authentic mustard oil flavour. My entire family is hooked. Highly recommend!',
    product: 'Aam Ka Achaar',
    avatar: 'PS',
  },
  {
    name: 'Rohit Mehta',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    text: 'The Garam Masala changed my cooking completely. You can actually smell the difference the moment you open the jar. My wife thinks I\'ve become a better cook — I\'ll credit Perk Foodz!',
    product: 'Supreme Garam Masala',
    avatar: 'RM',
  },
  {
    name: 'Ananya Nair',
    location: 'Bangalore, Karnataka',
    rating: 5,
    text: 'Ordered the Gift Hamper for my parents\' anniversary. The packaging was gorgeous and the quality was exceptional. My parents loved it and have been calling me every day to ask for more!',
    product: 'Supreme Gift Hamper',
    avatar: 'AN',
  },
  {
    name: 'Vikram Singh',
    location: 'Delhi, NCR',
    rating: 4,
    text: 'The Garlic Pickle is unlike anything I\'ve tasted before. Rich, deeply marinated, and perfect with every meal. Fast delivery and well-packaged. Already on my third order!',
    product: 'Lehsun Ka Achaar',
    avatar: 'VS',
  },
];

const trustFeatures = [
  { icon: <FiTruck size={24} />, title: 'Free Delivery', desc: 'On orders above ₹499 across India' },
  { icon: <FiAward size={24} />, title: '100% Natural', desc: 'No preservatives, artificial colours or additives' },
  { icon: <FiShield size={24} />, title: 'Quality Guarantee', desc: 'FSSAI certified, made in hygienic conditions' },
  { icon: <FiRefreshCw size={24} />, title: 'Easy Returns', desc: '7-day hassle-free return policy' },
];

const heroSlides = [
  {
    id: 1,
    img: sliderImg1,
    alt: 'Perk Foodz — Authentic Mango Pickle',
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await productAPI.getFeatured();
        setFeatured(data.products || []);
      } catch {
        // Use empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-warm-gradient relative overflow-hidden" style={{ minHeight: '520px' }}>
        {/* Hero Slider Image — right side, faded */}
        <div
          className="absolute top-0 right-0 h-full pointer-events-none"
          style={{ width: '62%' }}
        >
          {heroSlides.map((slide, idx) => (
            <img
              key={slide.id}
              src={slide.img}
              alt={slide.alt}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '68% center',
                opacity: idx === currentSlide ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 10%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 10%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 100%)',
              }}
            />
          ))}
          {/* Slider Dots — only show if more than 1 slide */}
          {heroSlides.length > 1 && (
            <div className="absolute bottom-6 right-6 flex gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: idx === currentSlide ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: idx === currentSlide ? '#c8922a' : 'rgba(255,255,255,0.6)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Text Content — left side */}
        <div className="container-main py-16 md:py-24 relative">
          <div className="max-w-xl">
            <div className="badge badge-mustard mb-4 text-sm px-3 py-1">
              🏆 India's Most Loved Pickle Brand
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Taste the{' '}
              <span className="text-gradient-mustard">Authentic</span>{' '}
              Flavours of India
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Handcrafted pickles and freshly ground spices made from generations-old recipes.
              Pure ingredients, traditional methods, and the love that only a home kitchen can bring.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base">
                Shop Now <FiArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-secondary text-base">
                Our Story
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10">
              {[
                { value: '50,000+', label: 'Happy Customers' },
                { value: '15+', label: 'Products' },
                { value: '4.8★', label: 'Average Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif font-bold text-2xl text-mustard-500">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="bg-white py-10 border-y border-cream-200">
        <div className="container-main">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((f) => (
              <div key={f.title} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-mustard-50 text-mustard-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-mustard-100 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{f.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">From tangy pickles to aromatic spices — find your flavour</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} to={cat.link} className="group">
                <div className={`card bg-gradient-to-br ${cat.color} p-6 text-center hover:shadow-warm transition-all duration-300 group-hover:-translate-y-1`}>
                  <div className="text-5xl mb-4 group-hover:animate-bounce-gentle inline-block">{cat.emoji}</div>
                  <h3 className={`font-serif font-bold text-base ${cat.accent} mb-1`}>{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.description}</p>
                  <div className={`mt-3 text-sm font-semibold ${cat.accent} flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Explore <FiArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-cream-100">
        <div className="container-main">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Our Bestsellers</h2>
              <p className="section-subtitle">Loved by 50,000+ families across India</p>
            </div>
            <Link to="/products" className="btn-secondary hidden md:flex">
              View All <FiArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="skeleton aspect-square" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 rounded w-3/4" />
                    <div className="skeleton h-3 rounded w-full" />
                    <div className="skeleton h-3 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Products are loading — please ensure the server is running.</p>
              <Link to="/products" className="btn-primary mt-4">Browse All Products</Link>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/products" className="btn-secondary">
              View All Products <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="badge badge-mustard mb-4">Our Story</div>
              <h2 className="section-title mb-6">
                Three Generations of{' '}
                <span className="text-gradient-mustard">Authentic</span>{' '}
                Flavour
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Perk Foodz was born in the kitchen of our grandmother, Dadi Savitri, in the heart of Rajasthan. Using recipes passed down through three generations, she created pickles that were more than food — they were memories, love, and tradition in a jar.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Today, we honour her legacy by using the same traditional methods: sun-drying, stone grinding, and slow-marination in pure mustard oil — never compromising on quality or authenticity. Every jar that leaves our kitchen is crafted with the same care as it was decades ago.
              </p>
              <Link to="/about" className="btn-primary">
                Read Our Full Story <FiArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '1962', label: 'Founded', emoji: '🏠' },
                { value: '100%', label: 'Natural', emoji: '🌿' },
                { value: '50K+', label: 'Happy Families', emoji: '❤️' },
                { value: '0', label: 'Preservatives', emoji: '✨' },
              ].map((stat) => (
                <div key={stat.label} className="card p-6 text-center hover:shadow-warm transition-all">
                  <div className="text-3xl mb-2">{stat.emoji}</div>
                  <div className="font-serif font-bold text-2xl text-mustard-500">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-cream-100">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real reviews from real pickle lovers</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6 flex flex-col hover:shadow-warm transition-all">
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={14}
                      className={i < t.rating ? 'text-mustard-400 fill-mustard-400' : 'text-gray-300'}
                      fill={i < t.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">"{t.text}"</p>
                <div className="mt-4 pt-4 border-t border-cream-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-mustard-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-mustard-600 text-sm">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="badge badge-mustard text-xs">Bought: {t.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16">
        <div className="container-main">
          <div className="bg-gradient-to-r from-maroon-500 to-maroon-700 rounded-3xl overflow-hidden">
            <div className="p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="badge bg-white/20 text-white mb-4 px-3 py-1">🎉 Limited Time Offer</div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
                  Get 10% Off Your First Order!
                </h2>
                <p className="text-maroon-100 text-lg mb-2">
                  Use code <span className="bg-white/20 text-white font-bold px-3 py-1 rounded-lg">WELCOME10</span> at checkout
                </p>
                <p className="text-maroon-200 text-sm">Valid on all orders above ₹200. One-time use only.</p>
              </div>
              <div className="flex-shrink-0">
                <Link to="/products" className="bg-mustard-400 hover:bg-mustard-300 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-200 inline-flex items-center gap-2 hover:shadow-warm">
                  Shop & Save <FiArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      <div className="bg-warm-gradient py-16">
        <div className="container-main text-center">
          <h1 className="section-title text-4xl md:text-5xl mb-4">Our Story</h1>
          <p className="section-subtitle text-xl">Three generations. One passion. Infinite flavour.</p>
        </div>
      </div>

      <div className="container-main py-16">
        <div className="max-w-3xl mx-auto space-y-8 text-gray-600 leading-relaxed text-lg">
          <p>
            Perk Foodz began not in a factory, but in the fragrant, sunlit kitchen of <strong className="text-gray-800">Dadi Savitri Devi</strong> in the heart of Rajasthan, circa 1962. Armed with clay pots, pure mustard oil, hand-ground spices, and the wisdom of generations before her, she crafted pickles that became the heart of every family meal.
          </p>
          <p>
            Her secret was never just the ingredients — it was the <em>intention</em>. Every batch was made with patience, prayer, and the deep understanding that food is love made tangible. The mangoes were hand-picked at their peak. The spices were stone-ground fresh. The oil was cold-pressed from mustard seeds grown in the fields of Bharatpur.
          </p>
          <div className="bg-mustard-50 border-l-4 border-mustard-400 p-6 rounded-r-2xl">
            <p className="italic text-mustard-700 font-medium">
              "A good pickle is not made in a day. It takes sun, patience, and the right spices. But most of all, it takes love." — Dadi Savitri
            </p>
          </div>
          <p>
            Today, her granddaughter <strong className="text-gray-800">Meera Sharma</strong> carries that legacy forward with Perk Foodz. We still use the same earthen pot methods where possible, the same hand-ground spice blends, and we still refuse to add any artificial preservatives, colours, or flavour enhancers to our products.
          </p>
          <p>
            What has changed is scale — we now serve over <strong className="text-gray-800">50,000 families</strong> across India — but our commitment to authenticity remains unshaken. Every jar that leaves our facility in Jaipur is inspected, tasted, and approved the old-fashioned way: by a human palate that knows what authentic should taste like.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            { title: 'FSSAI Certified', desc: 'All products meet the highest food safety standards set by the Food Safety and Standards Authority of India.', emoji: '🏆' },
            { title: 'Zero Preservatives', desc: 'We never add chemical preservatives. The natural acidity of our pickles and the quality of our oil are preservation enough.', emoji: '🌿' },
            { title: 'Stone-Ground Spices', desc: 'All spice blends are freshly stone-ground in small batches for maximum flavour and aroma.', emoji: '🪨' },
          ].map((item) => (
            <div key={item.title} className="card p-6 text-center hover:shadow-warm transition-all">
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="font-serif font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/products" className="btn-primary text-base">
            Shop Our Products <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

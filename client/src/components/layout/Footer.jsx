import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';
import brandLogo from '../../assets/logo.png';

const footerLinks = {
  'Shop': [
    { label: 'All Products', to: '/products' },
    { label: 'Pickles (Achar)', to: '/products?category=Pickles' },
    { label: 'Spices (Masale)', to: '/products?category=Spices' },
    { label: 'Combo Packs', to: '/products?category=Combos' },
    { label: 'Gift Hampers', to: '/products?category=Gift+Hampers' },
  ],
  'Company': [
    { label: 'About Us', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'FAQs', to: '/faq' },
    { label: 'Blog', to: '/blog' },
  ],
  'Support': [
    { label: 'Shipping & Returns', to: '/shipping-policy' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms & Conditions', to: '/terms' },
    { label: 'Track Order', to: '/dashboard/orders' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-olive-500 text-cream-50 mt-16">
      {/* Newsletter */}
      <div className="bg-mustard-400 py-10">
        <div className="container-main">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Get exclusive deals & recipes!</h3>
              <p className="text-mustard-100 mt-1">Join 10,000+ pickle lovers. No spam, only flavour.</p>
            </div>
            <form className="flex gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 md:w-72 px-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                id="newsletter-email"
              />
              <button type="submit" className="btn-maroon whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-12">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <img
                  src={brandLogo}
                  alt="Supreme Pickles Logo"
                  style={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                    borderRadius: '10px',
                    filter: 'brightness(1.05)',
                  }}
                />
                <div>
                  <div className="font-serif font-bold text-xl text-white">Supreme Pickles</div>
                  <div className="text-mustard-200 text-xs tracking-widest uppercase">Authentic Indian Flavours</div>
                </div>
              </Link>
              <p className="text-cream-200 text-sm leading-relaxed mb-4">
                Three generations of traditional recipes. Every jar is made with love, pure ingredients, and the wisdom of time-honoured methods that can never be factory-replicated.
              </p>
              <div className="space-y-2 text-sm text-cream-200">
                <div className="flex items-center gap-2">
                  <FiPhone size={14} className="text-mustard-300 flex-shrink-0" />
                  <span>+91 97838 15582</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail size={14} className="text-mustard-300 flex-shrink-0" />
                  <span>nbaid56@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin size={14} className="text-mustard-300 flex-shrink-0" />
                  <span>Sikar Road, Jaipur, Rajasthan — 302013</span>
                </div>
              </div>
              {/* Social */}
              <div className="flex gap-3 mt-5">
                {[
                  { Icon: FiInstagram, label: 'Instagram' },
                  { Icon: FiFacebook, label: 'Facebook' },
                  { Icon: FiTwitter, label: 'Twitter' },
                  { Icon: FiYoutube, label: 'YouTube' },
                ].map(({ Icon, label }) => (
                  <button key={label} aria-label={label} className="w-9 h-9 bg-olive-400 hover:bg-mustard-400 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="font-serif font-semibold text-white text-base mb-4">{section}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-cream-200 hover:text-mustard-300 text-sm transition-colors duration-200">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-olive-400 py-4">
        <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-2 text-cream-200 text-xs">
          <p>© 2024 Supreme Pickles. All rights reserved. Made with ❤️ in India.</p>
          <div className="flex items-center gap-4">
            <span>🔒 Secure Payments</span>
            <span>📦 Trusted Packaging</span>
            <span>🌿 No Preservatives</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

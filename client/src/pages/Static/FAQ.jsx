import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqs = [
  { q: 'Are your pickles made with natural ingredients?', a: 'Absolutely! All our pickles are made with 100% natural ingredients — fresh vegetables and fruits, pure mustard oil, and hand-ground spices. We never add artificial preservatives, synthetic colours, or flavour enhancers. The natural acidity of our pickling process and the quality of pure mustard oil act as natural preservatives.' },
  { q: 'How long do your pickles last after opening?', a: 'Unopened, our pickles last up to 12 months when stored in a cool, dry place. Once opened, they should be stored in the refrigerator and consumed within 2–3 months. Always use a clean, dry spoon to prevent contamination.' },
  { q: 'Do you ship pan-India?', a: 'Yes! We ship to all 28 states and 8 union territories across India. Standard delivery takes 3–7 business days depending on your location.' },
  { q: 'Can I return or exchange a product?', a: 'Due to the perishable nature of our products, we accept returns or exchanges only in cases where the product is damaged, expired, or incorrect. Please contact us within 48 hours of receiving your order with photos, and we\'ll resolve it immediately.' },
  { q: 'Are your products safe for people with specific allergies?', a: 'Our products contain mustard oil, sesame, and various spices that may trigger allergies in sensitive individuals. Please check the ingredient list on each product page carefully. We do not manufacture in a nut-free or allergen-free facility.' },
  { q: 'How do I apply a coupon code?', a: 'On the Cart page, you\'ll find a "Apply Coupon" section. Enter your code and click Apply. Valid codes include WELCOME10 (10% off for first-timers), PICKLE50 (₹50 flat off on orders above ₹499), and SPICE20 (20% off on spices).' },
  { q: 'Can I track my order?', a: 'Yes! Once your order is shipped, you\'ll receive a tracking number via email. You can also track your orders in the "My Orders" section of your account dashboard.' },
  { q: 'Do you offer bulk or wholesale pricing?', a: 'Yes, we offer special pricing for bulk orders (above ₹5,000) and wholesale inquiries. Please write to us at nbaid56@gmail.com or call +91 97838 15582 to discuss pricing and logistics.' },
  { q: 'Can I customize a gift hamper?', a: 'Absolutely! We love creating custom gift hampers for corporate gifting, weddings, and festivals. Contact us at nbaid56@gmail.com with your requirements and budget, and we\'ll create the perfect hamper for you.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major payment methods through Razorpay — UPI (PhonePe, Google Pay, Paytm), Credit/Debit Cards, Net Banking, and Wallets. We also offer Cash on Delivery (COD) for orders up to ₹2,000.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-start justify-between p-5 text-left gap-4">
        <span className="font-semibold text-gray-800">{q}</span>
        {open ? <FiChevronUp size={20} className="text-mustard-400 flex-shrink-0 mt-0.5" /> : <FiChevronDown size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-cream-100">
          <p className="pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="animate-fade-in">
      <div className="bg-warm-gradient py-16">
        <div className="container-main text-center">
          <h1 className="section-title text-4xl mb-4">Frequently Asked Questions</h1>
          <p className="section-subtitle">Everything you need to know about Perk Foodz</p>
        </div>
      </div>
      <div className="container-main py-16">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => <FAQItem key={faq.q} {...faq} />)}
        </div>
      </div>
    </div>
  );
}

export default function ShippingPolicy() {
  return (
    <div className="animate-fade-in">
      <div className="bg-warm-gradient py-16">
        <div className="container-main text-center">
          <h1 className="section-title text-4xl mb-4">Shipping & Returns Policy</h1>
          <p className="section-subtitle">Clear, fair, and hassle-free</p>
        </div>
      </div>
      <div className="container-main py-16">
        <div className="max-w-3xl mx-auto space-y-8 text-gray-600 leading-relaxed">
          <Section title="Shipping">
            <ul className="space-y-2 list-disc list-inside">
              <li>We ship pan-India to all 28 states and 8 union territories.</li>
              <li>Orders below ₹499 attract a flat shipping charge of ₹49.</li>
              <li>Standard delivery: <strong className="text-gray-800">3–7 business days</strong> from the date of order confirmation.</li>
              <li>Express delivery (1–2 days) available in select cities — additional charges apply.</li>
              <li>All orders are dispatched within 1–2 business days of confirmation.</li>
            </ul>
          </Section>
          <Section title="Order Tracking">
            <p>Once your order is shipped, you'll receive an email with a tracking number. You can also track your order in the "My Orders" section of your account dashboard.</p>
          </Section>
          <Section title="Returns & Refunds">
            <p>Due to the perishable nature of our food products, we have a specific returns policy:</p>
            <ul className="space-y-2 list-disc list-inside mt-3">
              <li><strong className="text-gray-800">Eligible for return:</strong> Damaged products, incorrect items, expired products on delivery.</li>
              <li><strong className="text-gray-800">Not eligible:</strong> Change of mind, taste preference differences, partially consumed products.</li>
              <li>Report issues within <strong className="text-gray-800">48 hours</strong> of delivery with photos.</li>
              <li>Approved refunds are processed within <strong className="text-gray-800">5–7 business days</strong>.</li>
            </ul>
          </Section>
          <Section title="Contact for Shipping Queries">
            <p>Email: <a href="mailto:nbaid56@gmail.com" className="text-mustard-500 hover:underline">nbaid56@gmail.com</a></p>
            <p>Phone: +91 97838 15582 (Mon–Sat, 9 AM – 6 PM)</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-serif text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-cream-200">{title}</h2>
      {children}
    </div>
  );
}

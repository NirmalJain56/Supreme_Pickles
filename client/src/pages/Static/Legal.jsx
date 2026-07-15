function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-serif text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-cream-200">{title}</h2>
      {children}
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="animate-fade-in">
      <div className="bg-warm-gradient py-16">
        <div className="container-main text-center">
          <h1 className="section-title text-4xl mb-4">Privacy Policy</h1>
          <p className="section-subtitle">Last updated: January 2024</p>
        </div>
      </div>
      <div className="container-main py-16">
        <div className="max-w-3xl mx-auto space-y-8 text-gray-600 leading-relaxed">
          <Section title="Information We Collect">
            <p>When you create an account or place an order, we collect: your name, email address, phone number, delivery address, and payment information (processed securely via Razorpay — we do not store card details).</p>
          </Section>
          <Section title="How We Use Your Information">
            <ul className="space-y-2 list-disc list-inside">
              <li>To process and fulfil your orders</li>
              <li>To send order confirmations and shipping updates</li>
              <li>To respond to your customer service inquiries</li>
              <li>To send promotional emails (you can unsubscribe anytime)</li>
              <li>To improve our website and product offerings</li>
            </ul>
          </Section>
          <Section title="Data Security">
            <p>We use industry-standard SSL encryption to protect your data. Payment information is processed through Razorpay's PCI-DSS compliant gateway. We never share your personal information with third parties for marketing purposes.</p>
          </Section>
          <Section title="Cookies">
            <p>We use essential cookies to maintain your session and cart. Analytics cookies help us understand how you use our site. You can disable non-essential cookies through your browser settings.</p>
          </Section>
          <Section title="Contact">
            <p>For privacy concerns, email: <a href="mailto:nbaid56@gmail.com" className="text-mustard-500 hover:underline">nbaid56@gmail.com</a></p>
          </Section>
        </div>
      </div>
    </div>
  );
}

export function TermsAndConditions() {
  return (
    <div className="animate-fade-in">
      <div className="bg-warm-gradient py-16">
        <div className="container-main text-center">
          <h1 className="section-title text-4xl mb-4">Terms & Conditions</h1>
          <p className="section-subtitle">Last updated: January 2024</p>
        </div>
      </div>
      <div className="container-main py-16">
        <div className="max-w-3xl mx-auto space-y-8 text-gray-600 leading-relaxed">
          <Section title="Acceptance of Terms">
            <p>By accessing and using the Perk Foodz website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website or services.</p>
          </Section>
          <Section title="Products & Pricing">
            <p>All prices on our website are in Indian Rupees (₹) and inclusive of applicable taxes. We reserve the right to change prices without notice. Product availability is subject to stock.</p>
          </Section>
          <Section title="Orders & Payments">
            <p>An order placed on our website constitutes an offer to buy. We reserve the right to accept or decline any order. Payment must be completed before order processing begins. All transactions are processed through secure payment gateways.</p>
          </Section>
          <Section title="Limitation of Liability">
            <p>Perk Foodz shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our liability is limited to the value of the specific order in dispute.</p>
          </Section>
          <Section title="Governing Law">
            <p>These terms are governed by the laws of India, with jurisdiction in Rajasthan courts.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

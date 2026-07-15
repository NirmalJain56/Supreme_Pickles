import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Message sent! We\'ll get back to you within 24 hours.');
        setSubmitted(true);
        reset();
      } else {
        toast.error(result.message || 'Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Could not send message. Please check your connection.');
    } finally {
      setSending(false);
    }
  };


  return (
    <div className="animate-fade-in">
      <div className="bg-warm-gradient py-16">
        <div className="container-main text-center">
          <h1 className="section-title text-4xl mb-4">Contact Us</h1>
          <p className="section-subtitle">We love hearing from our customers. Reach out anytime!</p>
        </div>
      </div>

      <div className="container-main py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
            <div className="space-y-5">
              {[
                { icon: <FiPhone size={20} />, label: 'Call Us', value: '+91 97838 15582', sub: 'Mon–Sat, 9 AM – 6 PM IST' },
                { icon: <FiMail size={20} />, label: 'Email Us', value: 'nbaid56@gmail.com', sub: 'We reply within 24 hours' },
                { icon: <FiMapPin size={20} />, label: 'Our Location', value: 'Sikar Road, Jaipur, Rajasthan — 302013', sub: 'Retail store by appointment only' },
              ].map((item) => (
                <div key={item.label} className="card p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-mustard-50 text-mustard-500 rounded-xl flex items-center justify-center flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.label}</p>
                    <p className="text-gray-700 font-medium">{item.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Contact Form */}
          <div className="card p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary mt-4">Send Another</button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-xl font-bold text-gray-800 mb-5">Send us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                      <input {...register('name', { required: 'Name is required' })} className="input-field" placeholder="Your full name" id="contact-name" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Valid email required' } })} type="email" className="input-field" placeholder="you@example.com" id="contact-email" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input {...register('subject', { required: 'Subject is required' })} className="input-field" placeholder="How can we help?" id="contact-subject" />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Please write at least 20 characters' } })} className="input-field h-36 resize-none" placeholder="Tell us more..." id="contact-message" />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <FiLoader size={16} className="animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <FiSend size={16} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

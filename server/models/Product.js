const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true }, // e.g. "250g", "500g", "1kg"
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  stock: { type: Number, required: true, default: 50 },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    ingredients: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: ['Pickles', 'Spices', 'Combos', 'Gift Hampers'],
    },
    images: [{ type: String }], // image paths
    variants: [variantSchema],
    // For single-price products (combos/hampers)
    price: { type: Number },
    discountPrice: { type: Number },
    stock: { type: Number },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Virtual for effective price (lowest variant or fixed)
productSchema.virtual('effectivePrice').get(function () {
  if (this.variants && this.variants.length > 0) {
    const prices = this.variants.map((v) => v.discountPrice || v.price);
    return Math.min(...prices);
  }
  return this.discountPrice || this.price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);

const Product = require('../models/Product');

// @desc  Get all products with filters, sort, pagination
// @route GET /api/products
exports.getProducts = async (req, res) => {
  const { category, search, sort, minPrice, maxPrice, page = 1, limit = 12, featured } = req.query;

  const query = { isActive: true };

  if (category) query.category = category;
  if (featured === 'true') query.isFeatured = true;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  // Price filter — check both flat price and variant prices
  if (minPrice || maxPrice) {
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || 999999;
    query.$or = [
      { price: { $gte: min, $lte: max } },
      { 'variants.price': { $gte: min, $lte: max } },
    ];
  }

  let sortObj = { createdAt: -1 };
  if (sort === 'price-asc') sortObj = { price: 1 };
  if (sort === 'price-desc') sortObj = { price: -1 };
  if (sort === 'popular') sortObj = { totalSold: -1 };
  if (sort === 'rating') sortObj = { averageRating: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit));

  res.json({
    success: true,
    count: products.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    products,
  });
};

// @desc  Get single product by slug
// @route GET /api/products/:slug
exports.getProduct = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
};

// @desc  Create product (admin)
// @route POST /api/products
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
};

// @desc  Update product (admin)
// @route PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
};

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, message: 'Product deactivated' });
};

// @desc  Get featured products
// @route GET /api/products/featured
exports.getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(8);
  res.json({ success: true, products });
};

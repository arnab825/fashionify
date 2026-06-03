
export const sizeOptionsByCategory = {
  men: ["XS", "S", "M", "L", "XL", "XXL"],
  women: ["XS", "S", "M", "L", "XL", "XXL"],
  kids: ["2Y (86cm)", "4Y (98cm)", "6Y (110cm)", "8Y (122cm)", "10Y (134cm)", "12Y (146cm)"],
  footwear: ["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
  accessories: ["One Size", "S/M", "M/L"],
};

/** Predefined tags per product category. Max 5 per product. */
export const tagsByCategory = {
  men: [
    "trendy", "oversized", "streetwear", "genz", "pure cotton",
    "premium cotton", "graphic print", "minimalist", "casual", "summer wear",
    "formal", "office wear", "slim fit", "business casual", "linen", "luxury",
    "relaxed fit", "vintage wash", "stretch denim", "urban", "baggy",
    "heavy weight", "fleece", "cozy", "winter essential",
  ],
  women: [
    "trendy", "floral", "minimalist", "casual", "summer wear", "festive",
    "ethnic", "boho", "western", "elegant", "premium", "party wear",
    "oversized", "slim fit", "comfort fit", "linen", "pastel",
    "graphic print", "streetwear", "pure cotton",
  ],
  kids: [
    "playful", "comfortable", "soft cotton", "summer wear", "school",
    "casual", "unisex", "trendy", "pastel", "vibrant colors",
  ],
  accessories: [
    "trending", "everyday carry", "minimalist", "premium", "fashion essential",
    "gifting", "luxury", "unisex", "statement piece", "classic",
  ],
  footwear: [
    "casual", "formal", "sports", "lightweight", "premium",
    "everyday", "slip-on", "lace-up", "comfort", "trending",
  ],
};

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
];


export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "about",
    label: "About Us",
    path: "/shop/about",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/shop/contact",
  },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
};

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];

/* ============================================================================
   PIZZA PINO — menu-data.js
   ----------------------------------------------------------------------------
   البيانات الأصلية للمنيو (Original Menu Data).
   المصدر: الصور المرفقة (صفحتا المنيو) عبر OCR + مراجعة يدوية للقراءة.
   ⚠️ لا تُترجم هذه القيم عند تغيير اللغة (الأسماء الأصلية/الأسعار/المقاسات ثابتة).
   ⚠️ الحقل needsReview:true يعني أن القراءة من الصورة غير مؤكدة وتحتاج مراجعة المطعم.
   ⚠️ لم يتم اختراع أي صنف أو سعر أو مكوّن.
   ============================================================================ */

const CURRENCY = {
  code: "EGP",
  symbol: "LE",
  symbolAr: "ج.م"
};

/* ملاحظة الأسعار المستخرجة من المنيو العربي:
   «السعر شامل ضريبة الخدمة والقيمة المضافة» */
const PRICE_NOTE = {
  en: "All prices are in Egyptian Pounds (LE) and include service charge & VAT.",
  ar: "جميع الأسعار بالجنيه المصري (ج.م) وشاملة ضريبة الخدمة والقيمة المضافة."
};

const CATEGORIES = [
  { id: "pizza",     en: "Pizza",                    ar: "بيتزا",                 icon: "pizza",     note: { en: "All pizzas are made with mozzarella cheese. Sizes: S / M / L", ar: "جميع البيتزا بالجبنة الموتزاريلا. المقاسات: ص / و / ك" } },
  { id: "soup",      en: "Soup",                     ar: "شوربة",                 icon: "soup" },
  { id: "salads",    en: "Salads",                   ar: "سلطات",                 icon: "salad" },
  { id: "pastas",    en: "Pastas",                   ar: "عجائن",                 icon: "pasta",     note: { en: "Rigatoni / Spaghetti", ar: "ريجاتوني / سباجيتي" } },
  { id: "main",      en: "Main Courses",             ar: "الأطباق الرئيسية",      icon: "main" },
  { id: "fish",      en: "Fish",                     ar: "أسماك",                 icon: "fish" },
  { id: "rice",      en: "With / Rice & Side Dishes",ar: "مع الأرز والأطباق الجانبية", icon: "rice" },
  { id: "breakfast", en: "Breakfast",                ar: "فطور",                  icon: "breakfast" },
  { id: "desserts",  en: "Desserts",                 ar: "حلويات",                icon: "dessert" },
  { id: "drinks",    en: "Drinks",                   ar: "مشروبات",               icon: "drink" },
  { id: "icecream",  en: "Ice Cream",                ar: "آيس كريم",              icon: "icecream" }
];

/* ---------------------------------------------------------------------------
   PRODUCTS
   fields:
     id, cat, en, ar, desc{en,ar}, sizes:[{label,price}], price, img,
     needsReview, tags
   --------------------------------------------------------------------------- */
const PRODUCTS = [
  /* ----------------------------- PIZZA ----------------------------- */
  { id: "pz-margherita", cat: "pizza", en: "Margherita", ar: "مارجريتا",
    desc: { en: "Tomato sauce & mozzarella cheese.", ar: "صلصة طماطم وجبنة موتزاريلا." },
    sizes: [{ label: "S", price: 210 }, { label: "M", price: 300 }, { label: "L", price: 390 }], img: "product-1.jpg" },
  { id: "pz-napolitan", cat: "pizza", en: "Napolitan", ar: "نابوليتان",
    desc: { en: "Tomato sauce, mozzarella, olives.", ar: "صلصة طماطم، موتزاريلا، زيتون." },
    sizes: [{ label: "S", price: 180 }, { label: "M", price: 260 }, { label: "L", price: 350 }], img: "product-2.jpg", needsReview: true },
  { id: "pz-capri", cat: "pizza", en: "Capri", ar: "كابري",
    desc: { en: "Tomato sauce, mozzarella, mushrooms.", ar: "صلصة طماطم، موتزاريلا، مشروم." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], img: "product-3.jpg", needsReview: true },
  { id: "pz-frankfort", cat: "pizza", en: "Frankfort", ar: "فرانكفورت",
    desc: { en: "Tomato sauce, mozzarella, frankfurter.", ar: "صلصة طماطم، موتزاريلا، فرانكفورت." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-nepton", cat: "pizza", en: "Nepton", ar: "نبتون",
    desc: { en: "Seafood pizza with mozzarella.", ar: "بيتزا مأكولات بحرية بالموتزاريلا." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-four-seasons", cat: "pizza", en: "Four Seasons", ar: "الفصول الأربعة",
    desc: { en: "Four seasons toppings with mozzarella.", ar: "إضافات الفصول الأربعة مع الموتزاريلا." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-oriental", cat: "pizza", en: "Oriental", ar: "شرقية",
    desc: { en: "Oriental-style toppings with mozzarella.", ar: "إضافات شرقية مع الموتزاريلا." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-four-cheese", cat: "pizza", en: "Four Cheese", ar: "الأجبان الأربعة",
    desc: { en: "A selection of four cheeses.", ar: "تشكيلة من أربعة أجبان." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-romano", cat: "pizza", en: "Romano", ar: "رومانو",
    desc: { en: "Tomato, mozzarella, green pepper, olives, onion.", ar: "طماطم، موتزاريلا، فلفل أخضر، زيتون، بصل." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-fisherman", cat: "pizza", en: "Fisherman", ar: "الصياد",
    desc: { en: "Seafood selection with mozzarella.", ar: "تشكيلة مأكولات بحرية مع الموتزاريلا." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-queen-pepper", cat: "pizza", en: "Queen Pepper", ar: "ملكة الفلفل",
    desc: { en: "Green pepper & olives.", ar: "فلفل أخضر وزيتون." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-pino-special", cat: "pizza", en: "Pino Special", ar: "بيتزا بينو الخاصة",
    desc: { en: "Chef's special pizza with sauce & mushroom.", ar: "بيتزا الشيف الخاصة بالصلصة والمشروم." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-mushroom", cat: "pizza", en: "Mushroom", ar: "مشروم",
    desc: { en: "Tomato sauce, mozzarella, mushrooms.", ar: "صلصة طماطم، موتزاريلا، مشروم." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-combination", cat: "pizza", en: "Combination", ar: "كومبينيشن",
    desc: { en: "Mixed toppings with mozzarella.", ar: "إضافات مشكّلة مع الموتزاريلا." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-shrimp", cat: "pizza", en: "Shrimp", ar: "جمبري",
    desc: { en: "Shrimp, onion & green pepper.", ar: "جمبري، بصل وفلفل أخضر." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-smoked-salmon", cat: "pizza", en: "Smoked Salmon", ar: "سلمون مدخن",
    desc: { en: "Smoked salmon with mozzarella.", ar: "سلمون مدخن مع الموتزاريلا." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "pz-five-stars", cat: "pizza", en: "Five Stars", ar: "الخمس نجوم",
    desc: { en: "Salmon, shrimp & smoked salmon.", ar: "سلمون، جمبري وسلمون مدخن." },
    sizes: [{ label: "S", price: null }, { label: "M", price: null }, { label: "L", price: null }], needsReview: true },

  /* ----------------------------- SOUP ----------------------------- */
  { id: "sp-lentil", cat: "soup", en: "Lentil Soup", ar: "شوربة عدس", price: 100 },
  { id: "sp-tomato", cat: "soup", en: "Tomato Soup", ar: "شوربة طماطم", price: 100 },
  { id: "sp-vegetable", cat: "soup", en: "Vegetable Soup with Meat", ar: "شوربة خضار باللحمة", price: 150 },
  { id: "sp-chicken", cat: "soup", en: "Chicken Soup", ar: "شوربة فراخ بالكريمة", price: 140 },
  { id: "sp-mushroom", cat: "soup", en: "Mushroom with Cream Soup", ar: "شوربة مشروم بالكريمة", price: 140 },
  { id: "sp-orzo", cat: "soup", en: "Orzo Soup with Meat", ar: "شوربة لسان عصفور باللحمة", price: 150 },
  { id: "sp-seafood", cat: "soup", en: "Special Seafood Soup", ar: "شوربة سيفود خاصة", price: 220 },

  /* ----------------------------- SALADS ----------------------------- */
  { id: "sl-oriental", cat: "salads", en: "Oriental Salad", ar: "سلطة شرقية", desc: { en: "Mixed oriental salad.", ar: "سلطة شرقية مشكّلة." }, price: null, needsReview: true },
  { id: "sl-greek", cat: "salads", en: "Greek Salad", ar: "سلطة يوناني", price: 130 },
  { id: "sl-italian", cat: "salads", en: "Italian Salad", ar: "سلطة إيطالي", price: 160 },
  { id: "sl-chef", cat: "salads", en: "Chef Salad", ar: "سلطة الشيف", price: 160 },
  { id: "sl-seasonal", cat: "salads", en: "Seasonal Salad", ar: "سلطة الموسم", price: null, needsReview: true },
  { id: "sl-seafood", cat: "salads", en: "Sea Fruit Salad", ar: "سلطة فواكه البحر", price: 110 },
  { id: "sl-shrimp-cocktail", cat: "salads", en: "Shrimp Cocktail", ar: "كوكتيل جمبري", price: null, needsReview: true },
  { id: "sl-tuna", cat: "salads", en: "Tuna Salad", ar: "سلطة تونة", price: null, needsReview: true },
  { id: "sl-tahina", cat: "salads", en: "Tahina / Babaghanoush / Pickles", ar: "طحينة / بابا غنوج / مخللات", price: null, needsReview: true },

  /* ----------------------------- PASTAS ----------------------------- */
  { id: "pa-napolitan", cat: "pastas", en: "Napolitan", ar: "نابوليتان", price: 180, img: "product-2.jpg" },
  { id: "pa-bolognaise", cat: "pastas", en: "Bolognaise", ar: "بولونيز", price: 180 },
  { id: "pa-carbonara", cat: "pastas", en: "Carbonara", ar: "كاربونارا", price: 140 },
  { id: "pa-mushroom", cat: "pastas", en: "Mushroom", ar: "مشروم", price: null, needsReview: true },
  { id: "pa-seafood", cat: "pastas", en: "Sea Fruit", ar: "فواكه البحر", price: 200 },
  { id: "pa-shrimp", cat: "pastas", en: "Shrimp", ar: "جمبري", price: 200 },
  { id: "pa-negresco", cat: "pastas", en: "Negresco", ar: "نجرسكو", price: 200 },
  { id: "pa-pino-lasagne", cat: "pastas", en: "Pino Lasagne", ar: "بينو لازانيا", price: 175, img: "product-3.jpg" },

  /* ----------------------------- MAIN COURSES ----------------------------- */
  { id: "mn-scallope", cat: "main", en: "Scallope", ar: "اسكالوب", sizes: [{ label: "S", price: null }, { label: "L", price: null }], needsReview: true },
  { id: "mn-scallope-normandy", cat: "main", en: "Scallope Normandy", ar: "اسكالوب نورماندي", price: 550, needsReview: true },
  { id: "mn-veal", cat: "main", en: "Veal", ar: "بتلو", price: 550, needsReview: true },
  { id: "mn-filet-pino", cat: "main", en: "Filet Pino", ar: "فيليه بينو", price: 590, needsReview: true },
  { id: "mn-chicken-pane", cat: "main", en: "Chicken Pane", ar: "بانيه فراخ", price: null, needsReview: true },
  { id: "mn-chicken-cheese", cat: "main", en: "Chicken Pane with Cheese", ar: "بانيه فراخ بالجبنة", price: null, needsReview: true },
  { id: "mn-mixed-grill", cat: "main", en: "Mixed Grilled", ar: "مشويات مشكّلة", price: 370, needsReview: true },
  { id: "mn-meat-mixed", cat: "main", en: "Meat Mixed Grilled", ar: "لحوم مشوية مشكّلة", price: 380, needsReview: true },

  /* ----------------------------- FISH ----------------------------- */
  { id: "fh-grilled", cat: "fish", en: "Grilled Fish", ar: "سمك مشوي", price: null, needsReview: true },
  { id: "fh-fillet", cat: "fish", en: "Fish Fillet", ar: "فيليه سمك", price: null, needsReview: true },
  { id: "fh-salmon", cat: "fish", en: "Salmon", ar: "سلمون", price: null, needsReview: true },
  { id: "fh-frito-misto", cat: "fish", en: "Frito Misto (Calamari / Rissole)", ar: "فريتو ميستو (كاليماري / ريسول)", price: 520 },
  { id: "fh-calamari", cat: "fish", en: "Calamari (Squid)", ar: "كاليماري (سيبيا)", price: null, needsReview: true },
  { id: "fh-seafood-grilled", cat: "fish", en: "Seafood Grilled", ar: "سيفود مشوي", price: 450 },
  { id: "fh-mexican-shrimp", cat: "fish", en: "Alla Mexican Shrimp", ar: "جمبري ألا مكسيكان", price: 450 },
  { id: "fh-breaded-shrimp", cat: "fish", en: "Breaded Shrimp", ar: "جمبري بانيه", price: 520 },
  { id: "fh-smoked-salmon", cat: "fish", en: "Smoked Salmon", ar: "سلمون مدخن", price: 300, needsReview: true },
  { id: "fh-five-stars", cat: "fish", en: "Five Stars", ar: "فايف ستارز", price: 350, needsReview: true },

  /* ----------------------------- RICE & SIDES ----------------------------- */
  { id: "rc-white", cat: "rice", en: "White Rice", ar: "أرز أبيض", price: 60 },
  { id: "rc-curry", cat: "rice", en: "Curry Rice", ar: "أرز كاري", price: 100 },
  { id: "rc-curry-shrimp", cat: "rice", en: "Curry Shrimp Rice", ar: "أرز كاري بالجمبري", price: 250 },
  { id: "rc-seafood-curry", cat: "rice", en: "Seafood Curry Shrimp", ar: "سيفود كاري شريمب", price: 250, needsReview: true },
  { id: "rc-sauteed-veg", cat: "rice", en: "Sautéed Vegetables", ar: "خضار سوتيه", price: null, needsReview: true },
  { id: "rc-fries", cat: "rice", en: "French Fries", ar: "بطاطس محمّرة", price: null, needsReview: true },

  /* ----------------------------- BREAKFAST ----------------------------- */
  { id: "bf-beans", cat: "breakfast", en: "Beans", ar: "فول", price: 35 },
  { id: "bf-white-cheese", cat: "breakfast", en: "Small White Cheese Dish", ar: "طبق جبنة بيضاء صغير", price: 90 },
  { id: "bf-cheese", cat: "breakfast", en: "Small Cheese Dish", ar: "طبق جبنة صغير", price: 65 },
  { id: "bf-omelet-plain", cat: "breakfast", en: "Omelet Plain", ar: "أومليت سادة", price: 75 },
  { id: "bf-omelet-pino", cat: "breakfast", en: "Omelet Pino", ar: "أومليت بينو", price: 100 },
  { id: "bf-croissant", cat: "breakfast", en: "Croissant Plain", ar: "كرواسون سادة", price: 75 },
  { id: "bf-bread-cheese", cat: "breakfast", en: "Bread with Cheese", ar: "خبز بالجبنة", price: 85, needsReview: true },
  { id: "bf-buttered-bread", cat: "breakfast", en: "Buttered Bread (4 pieces)", ar: "خبز بالزبدة (4 قطع)", price: 70 },
  { id: "bf-betty-pan", cat: "breakfast", en: "Betty Pan Bread (5 pieces)", ar: "خبز بيتي بان (5 قطع)", price: 70 },
  { id: "bf-cover", cat: "breakfast", en: "Cover (Service per person)", ar: "كوفر (خدمة للفرد)", price: null, needsReview: true },

  /* ----------------------------- DESSERTS ----------------------------- */
  { id: "ds-cream-caramel", cat: "desserts", en: "Cream Caramel", ar: "كريم كراميل", price: 50 },
  { id: "ds-chocolate-cake", cat: "desserts", en: "Chocolate Cake", ar: "كيكة شوكولاتة", price: 60, needsReview: true },
  { id: "ds-fresh-fruit", cat: "desserts", en: "Fresh Fruit", ar: "فواكه طازجة", price: 100, needsReview: true },
  { id: "ds-rice-pudding", cat: "desserts", en: "Rice Pudding", ar: "أرز بلبن", price: 25, needsReview: true },

  /* ----------------------------- DRINKS (بيانات غير مؤكدة) ----------------------------- */
  { id: "dr-soft", cat: "drinks", en: "Soft Drinks", ar: "مشروبات غازية", price: null, needsReview: true },
  { id: "dr-juice", cat: "drinks", en: "Fresh Juice", ar: "عصير طازج", price: null, needsReview: true },
  { id: "dr-water", cat: "drinks", en: "Water", ar: "مياه", price: null, needsReview: true },
  { id: "dr-hot", cat: "drinks", en: "Hot Drinks", ar: "مشروبات ساخنة", price: null, needsReview: true },

  /* ----------------------------- ICE CREAM (بيانات غير مؤكدة) ----------------------------- */
  { id: "ic-cream", cat: "icecream", en: "Ice Cream", ar: "آيس كريم", price: null, needsReview: true },
  { id: "ic-sundae", cat: "icecream", en: "Ice Cream Sundae", ar: "آيس كريم صنداي", price: null, needsReview: true }
];

/* ترتيب العرض الافتراضي */
const MENU_ORDER = CATEGORIES.map(c => c.id);

/* تصدير للاستخدام العام (بدون modules ليعمل على GitHub Pages مباشرة) */
window.PINO = window.PINO || {};
window.PINO.currency = CURRENCY;
window.PINO.priceNote = PRICE_NOTE;
window.PINO.categories = CATEGORIES;
window.PINO.products = PRODUCTS;

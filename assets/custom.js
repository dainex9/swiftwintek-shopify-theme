document.addEventListener("DOMContentLoaded", function () {
  loadProductSection(
    "featured",
    "featured-prod-container",
    "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/winteks-choice-straight-tp-optimized.png?v=1732574461",
    "Winteks choice",
    "150px",
    "90px"
  );
  loadProductSection(
    "bestsellers",
    "bestseller-prod-container",
    "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/winteks-bestsellers-tp-optimized.png?v=1732575054",
    "Bestsellers",
    "300px",
    "65px",
    "bestseller-card__img"
  );
  loadProductSection(
    "bargains",
    "bargain-prod-container",
    "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Huge-Sale-tp-optimized.png?v=1732575698",
    "Huge Sale",
    "150px",
    "48px"
  );
  loadProductSection(
    "arrivals",
    "new-arrival-prod-container",
    "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/new-arrival-tp-optimized.png?v=1732576179",
    "New Arrivals",
    "150px",
    "50px",
    "new-arrival__image"
  );
  loadProductSection(
    "arrivals-landing",
    "new-arrival-prod-container-landing-pg",
    "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/new-arrival-tp-optimized.png?v=1732576179",
    "New Arrivals",
    "150px",
    "50px",
    "new-arrival__image"
  );
  // slideLetter();
  getAllLinks();
});

// Modify the loadProductSection function to handle lazy loading of images
const loadProductSection = async (
  type,
  containerId,
  imgUrl,
  title,
  imgWidth,
  specialImgSize,
  additionalClass = ""
) => {
  let takenIndexes = new Set(); // Use Set for faster lookup
  let products;
  // Show spinner before loading
  document.getElementById("loading-spinner").style.display = "block";

  // Fetch products based on type
  switch (type) {
    case "featured":
      products = await fetchFeaturedProducts();
      break;
    case "bestsellers":
      products = await fetchBestsellers();
      break;
    case "bargains":
      products = await fetchAllBargains();
      break;
    case "arrivals":
      products = await fetchNewArrivals();
      break;
    case "arrivals-landing":
      products = await fetchNewArrivals();
      break;
    default:
      throw new Error("Invalid product type");
  }

  const newCards = [];
  const duplicatedProducts = [...products, ...products]; // Duplicate products for looping

  for (let index = 0; index < duplicatedProducts.length; index++) {
    let randomIndex = generateRandomIndex(duplicatedProducts, takenIndexes);
    takenIndexes.add(randomIndex); // Add to Set to ensure uniqueness
    let newCard = createCard(
      duplicatedProducts,
      randomIndex,
      imgWidth,
      imgUrl,
      title,
      specialImgSize,
      additionalClass
    );
    newCards.push(newCard);
  }

  document.getElementById(containerId).append(...newCards);
  document.getElementById("loading-spinner").style.display = "none"; // Hide spinner

  // Lazy load images in the newly added product cards
  lazyLoadImages(containerId);
};
// Function to lazy load images inside the container
const lazyLoadImages = (containerId) => {
  const container = document.getElementById(containerId);
  const images = container.querySelectorAll("img[data-src]"); // Select images that have a "data-src" attribute

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // When the image is in the viewport, load it
          const img = entry.target;
          img.src = img.dataset.src; // Set the src from the data-src attribute
          img.removeAttribute("data-src"); // Remove the data-src attribute
          observer.unobserve(img); // Stop observing this image
        }
      });
    },
    {
      rootMargin: "200px", // Load images 200px before they enter the viewport
    }
  );

  // Observe all images with the "data-src" attribute
  images.forEach((img) => {
    observer.observe(img);
  });
};
// Helper to generate a random index that hasn't been used yet
const generateRandomIndex = (products, takenIndexes) => {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * products.length);
  } while (takenIndexes.has(randomIndex)); // Ensure the index hasn't been taken
  return randomIndex;
};

const cardSlide = (container, direction) => {
  let wrapper = document.getElementById(container);
  let currentLeft = parseFloat(wrapper.style.left || 0); // Get the current left position, default to 0 if undefined

  const step = 34; // The step in pixels for each slide
  const maxSteps = 5; // Total number of steps in either direction before wrapping back to the start

  // If sliding left (negative direction)
  if (direction === "left") {
    // If the current position is the far left (0), loop back to the far right
    if (currentLeft === 0) {
      wrapper.style.left = `${-step * maxSteps}rem`; // Jump to far right
    } else {
      wrapper.style.left = `${currentLeft + step}rem`; // Slide to the left
    }
  }
  // If sliding right (positive direction)
  else if (direction === "right") {
    // If we're at the far right (currentLeft is -step * maxSteps), loop back to the far left
    if (currentLeft === -step * maxSteps) {
      wrapper.style.left = "0rem"; // Jump to the far left
    } else {
      wrapper.style.left = `${currentLeft - step}rem`; // Slide to the right
    }
  }
};

const checkIndexes = (productContainer, indexContainer) => {
  if (indexContainer.length == productContainer.length) {
    indexContainer.length = 0;
  }
};
let seasonToggle = true;
const createCard = (
  productList,
  randomIndex,
  imgWidth,
  specialImgUrl,
  specialImgAlt,
  specialImgWidth,
  specialImgId
) => {
  const product = productList[randomIndex];
  const {
    id,
    url,
    title,
    product_desc,
    overview_desc,
    list_price,
    current_price,
    img_url,
    brand_name,
    rating,
    num_reviews,
    is_express,
    is_super_express,
    is_season_sale,
    bundle_amt,
    bundle_discount,
    is_hot
  } = product;
  const discount_amt = calculateDiscount(list_price, current_price);
  let listItem = document.createElement("li");
  let newCard = document.createElement("article"); // Use <article> to define a product
  newCard.className = "product-all";
  newCard.id = `${id}`;
  newCard.innerHTML = `
        <a href="${url}#shopify-section-sections--24148577222994__announcement_bar_HgHnem" title="${title}" aria-label="Show product: ${title}">
            <figure class="wrapper-base__template-column-all-center mg__none">
             <!-- Corrected Product Image with Discount Badge -->
                <div style="position: relative; display: inline-block;">
                  <!-- Use data-src for lazy loading -->
                  <img id="car-product-card__img" data-src="${img_url}" alt="${title}" width="${imgWidth}" loading="lazy" />
                  ${discount_amt > 0 
                          ? `<p class="font-mplus sale-product__badge" 
                               >
                               Sale
                             </p>` 
                          : ''}    
                </div>
                ${is_hot ? `
                <div class="wrapper-base__template-just-end abs-pos__default" style="z-index: 100; justify-content: end;">
                  <i class="fa-solid fa-lg fa-fire text-shadow__pop"></i>
                  <h4 class="font-wght__boldest h3-normal font-mserrat color__border mg-left__micro-xs text-shadow__pop margin-top__narrow margin-bottom__narrow"><em>HOT!</em></h4>
                </div>
                ` : ''}
                ${bundle_amt > 0 
                          ? `
                          <div class="tooltip-container car-card__bundle-wrapper wrapper-base__template-center">
                          <span class="material-symbols-outlined notranslate color__dark-blue-txt margin-right__micro-plus">
                              box_add
                            </span>
                            <p class="font-contrail font-size_medium-plus color__dark-blue-txt tooltip-trigger mg__none" 
                             style="margin: 0; font-weight: 900;">Buy ${bundle_amt} (Save ${bundle_discount}%)</p>
                            </div>`
                          : ''}    
                </div>
                ${is_season_sale && seasonToggle ? `
                  <div class="ambient-special__bg-season-card">
                    <p class="black-friday-text font-mserrat"><strong>Spring</strong> Sale</p>
                    <div class="chat-arrow-up"></div>
                  </div>` 
                : ""}

                ${checkExpressType(is_express, is_super_express)} <!-- Now renders express details here -->
                <img data-src="${specialImgUrl}" 
                         alt="${specialImgAlt}" 
                         width="${specialImgWidth}" 
                         class="carousel-card__special-image" 
                         id="${specialImgId}" 
                         loading="lazy"/>            
            </figure>
            ${calculateReviews(rating, num_reviews)}
            <p class="product-desc__brand-name">${brand_name}</p>
            <div class="carousel-card__desc-wrapper">
                <p class="product-desc"><strong>${product_desc}</strong></p>
                <p class="product-overview line-height__std-extra">${overview_desc}</p>
            </div>
            <span class="material-symbols-outlined wrapper-base__template-center color__dark-grey-txt margin-top__thick notranslate">expand_more</span>
            <div class="price-wrapper">
                <span class="list-price">
                    ${calcListPrice(list_price, current_price)}
                </span>
                <span class="cur-price">
                    From <span class="transcy-money">$${current_price} USD</span>
                </span>
            </div>
            <div class="discount-container" id=${discount_amt > 0 ? "is-discount" : ""}>
                ${displayCouponIcon(discount_amt)}
                <p class="discount-amount font-contrail">
                    <span class="now">
                        ${showDiscountText(discount_amt)}
                    </span>
                </p>
            </div>        
        </a>
    `;

  listItem.appendChild(newCard);
  return listItem;
};
const checkExpressType = (is_express, is_super_express) => {
  if (is_express) {
    return displayExpressDetails("US Express");
  }
  if (is_super_express) {
    return displayExpressDetails("US Super Express");
  }
  return ""; // Return empty string if neither condition is met
}

const displayExpressDetails = (serviceType) => {
  let icon = "";
  if (serviceType === "US Express") icon = "delivery_truck_speed";
  else if (serviceType === "US Super Express") icon = "electric_bolt";
  return `
          <div class="tooltip-container font-contrail wrapper-base__template-center color__dark-blue-txt font-size_x-small margin-top__micro" 
               style="position: absolute; top: 16rem; background: rgba(252, 252, 252, .5); border-radius: 50px; padding: .15rem .75rem; border-left: 1px solid #0073ff; margin-right: 12.5rem;">
              <p class="font-contrail font-size_medium color__dark-blue-txt tooltip-trigger mg__none" 
                 style="margin: 0; font-weight: 900;">${serviceType}</p>
              <div class="tooltip-box font-mserrat">
                  ${displayPolicyTerms(serviceType)}
                  For more information, visit our 
                  <button type="button" aria-label="Go to Express Shipping Policy for U.S. Customers" 
                          title="Click to read the express shipping policy for U.S. customers" 
                          onclick="redirectToPolicy(event)" 
                          id="express-delvr__policy-btn" 
                          class="shipping-link link-uline__focus express-delvr__policy-btn" 
                          tabindex="0">
                      Express Delivery Policy
                  </button> page.
              </div>
              <span class="material-symbols-outlined notranslate color__dark-blue-txt margin-left__micro" 
                    style="font-size: 20px; rotate: 4deg;">
                    ${icon}
              </span>
          </div>`
}
const displayPolicyTerms = (serviceType) => {
  if (serviceType === "US Express") {
  return `<strong>Fast & Reliable Express Delivery</strong><br>
Get your order quickly with our Express Delivery service, <strong>exclusively for U.S. customers.</strong> Enjoy expedited shipping and receive your products within <strong>5–7 days</strong>.`
  }
  else {
    return `<strong>U.S. Super Express!</strong><br>
Receive your products in just <strong>2–5 days</strong>, <strong>exclusively for U.S. customers</strong>. Enjoy <strong>fast</strong>, reliable shipping at no extra cost.`
  }
}
function calculateDiscount(listPriceStr, salePriceStr) {
    // Convert string prices to numbers (supporting both comma and dot as decimal separators)
    let listPrice = parseFloat(listPriceStr.replace(',', '.'));
    let salePrice = parseFloat(salePriceStr.replace(',', '.'));
    
    if (isNaN(listPrice) || isNaN(salePrice) || listPrice <= 0 || salePrice < 0 || salePrice > listPrice) {
        throw new Error("Invalid price values");
    }
    
    let discount = ((listPrice - salePrice) / listPrice) * 100;
    
    // Format discount: If it's a whole number, remove decimal. Otherwise, show 1 decimal place.
    return discount % 1 === 0 ? discount.toFixed(0) : discount.toFixed(1);
}

const renderStars = (rating) => {
  const stars = Math.floor(rating);
  let starHTML = "";

  for (let i = 0; i < 5; i++) {
    const noMarginClass = i === 4 ? "mg__none" : "";
    starHTML +=
      i < stars
        ? `<i class="fa-solid fa-star ${noMarginClass}"></i>`
        : `<i class="fa-regular fa-star ${noMarginClass}"></i>`;
  }

  return starHTML;
};


function redirectToPolicy(event) {
  // Prevent the <a> tag from navigating
  event.preventDefault();

  // Now redirect to the policy page
  window.location.href =
    "/pages/express-delivery-terms-conditions-for-u-s-customers";
}

const calculateReviews = (rating, numReviews) => {
  if (rating < 1.0) return "";
  return `
    <div class="card-review__wrapper">
        ${renderStars(rating)}
        <p class="card-review__details">${rating.toFixed(1)} (${numReviews} reviews)</p>
    </div>`;
};

function showDiscountText(discAmount) {
  if (discAmount > 0) {
    return `Now ${discAmount}% Off`;
  } else {
    return "Standard";
  }
}

function displayCouponIcon(discAmount) {
  if (discAmount > 0) {
    return `<i class="fa-sharp fa-solid fa-tags"></i>`;
  } else {
    return "";
  }
}

const parsePrice = (price) => {
  return parseFloat(price.replace(/[^\d.-]/g, "").replace(",", ".")); // Remove non-numeric characters and convert to float
};

const calcListPrice = (lstPrice, curPrice) => {
  const list = parsePrice(lstPrice);
  const current = parsePrice(curPrice);
  return list > current ? `<s class="transcy-money">$${lstPrice} USD</s>` : "";
};
// Carousel Product Card Data
function fetchFeaturedProducts() {
  return [
    {
      id: 1,
      url: "/products/kharadron-overlords-endrinmaster-figure-aos",
      title:
        "Kharadron Overlords Endrinmaster Figure AOS",
      product_desc:
        "Kharadron Overlords Endrinmaster Figure AOS",
      overview_desc:
        "Dive into the exciting world of Warhammer Age of Sigmar with the premium Kharadron Overlords Endrinmaster figure, a must-have for every passionate gamer and collector.",
      list_price: "44.22",
      current_price: "35.43",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_671e6b38-c940-4791-b671-da21dd609ca4.jpg?v=1743554647",
      brand_name: "Games Workshop",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: true,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 2,
      url: "/products/kree-supreme-intelligence-heroclix-figure",
      title:
        "Kree Supreme Intelligence HeroClix Figure",
      product_desc:
        "Kree Supreme Intelligence HeroClix Figure",
      overview_desc:
        "**<em>Unlock the Power of Kree Supreme Intelligence: Limited Edition HeroClix!</em>** Experience the thrill of commanding the esteemed Kree Supreme Intelligence with this exclusive HeroClix figure, originally available only during the 2015 HeroClix Convention Season.",
      list_price: "52.50",
      current_price: "47.55",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_53bf6b2c-6881-4cbc-8360-2820f3a2ab48.jpg?v=1744804240",
      brand_name: "WizKids",
      rating: 0.0,
      num_reviews: 0,
      is_express: true,
      is_super_express: false,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0,
      is_hot: true
    },
    {
      id: 3,
      url: "/products/xiaomi-redmi-buds-5-noise-cancelling-earbuds?variant=50376303214930",
      title:
        "Xiaomi Redmi Buds 5: Noise-Cancelling Earbuds",
      product_desc:
        "Redmi Buds 5 | Noise-Cancelling ANC | Earbuds",
      overview_desc:
        "Featuring advanced 46dB Active Noise Cancellation, these Bluetooth 5.3 true wireless earbuds effectively block out unwanted distractions, allowing you to enjoy your favorite music or podcasts with incredible clarity.",
      list_price: "60.08",
      current_price: "52.08",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/S36837db1332a4cbc926ec2e3eff30a99G.webp?v=1741017172",
      brand_name: "Xiaomi",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: false,
    },
    {
      id: 4,
      url: "/products/xiaomi-micro-sd-memory-card-2tb-1tb-512gb-256gb-up-to-90mb-s-class10-u3-128gb-tf-card-4k-hd-for-usb-card-reader-adapter-microsd",
      title:
        "Xiaomi 2TB Micro SD Card - High-Speed 128GB to 1TB Storage, 90MB/s Class 10 U3, Ideal for 4K HD Videos and USB Card Reader Compatibility",
      overview_desc:
        "With a Class 10 U3 rating, enjoy seamless video capture and playback, ideal for recording 4K HD videos. Easily use the card with no software installation required — just insert and go, Plug and Play!",
      product_desc:
        "Flash Memory Cards | High-Speed 2TB 90MB/s, Class 10 U3 | Micro SD Card",
      list_price: "9.85",
      current_price: "9.85",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Xiaomi-Micro-SD-Memory-Card-2TB-1TB-512GB-256GB-UP-TO-90MB-s-Class10-U3-128GB_92b08692-45e8-4b7a-879f-6e5a8eda4969.webp?v=1731158219",
      brand_name: "Xiaomi",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: false,
      bundle_amt: 3,
      bundle_discount: 15.0,
      is_hot: true,
    },
    {
      id: 5,
      url: "/products/12-shrek-gold-label-collectible-figure",
      title:
        "12\" Shrek Gold Label Collectible Figure",
      overview_desc:
        "**<em>Unleash the Magic of Shrek with this Exclusive Figure!</em>** Dive into the enchanting world of Shrek with the Limited Edition 12\"",
      product_desc:
        "12\" Shrek Gold Label Collectible Figure",
      list_price: "49.99",
      current_price: "49.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_f5c37806-ac21-4f7a-aaad-2078ad835d2a.jpg?v=1744309876",
      brand_name: "McFarlane Toys",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: false
    },
    {
      id: 6,
      url: "/products/ugreen-hitune-max5-hybrid-active-noise-cancelling-headphones?variant=49438007296338",
      title: "UGREEN HiTune Max5 Hybrid Active Noise Cancelling Headphones",
      product_desc: "HiTune Max5 | Hybrid ANC Universal | Headphones",
      overview_desc:
        "The Dual Mic DNN Call Noise Reduction feature filters out environmental noise during calls, ensuring crystal-clear communication. Experience an ultra-low latency of 120ms that enhances your gaming experience to a whole new level.",
      list_price: "101.91",
      current_price: "46.37",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/172640887766e6e8ad0c4e724245_b34139cd-6ffb-4f7d-890a-c589a6d8cf7f.webp?v=1726409365",
      brand_name: "UGREEN",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: false,
    },
    {
      id: 7,
      url: "/products/lenovo-s02-wireless-bluetooth-rgb-controller-multi-function-gamepad-for-nintendo-switch-oled-switch-lite-pc-mobile?variant=50101382676818",
      title:
        "Lenovo S02 Wireless Bluetooth RGB Controller – Multi-Function Gamepad for Nintendo Switch OLED, Switch Lite, PC & Mobile",
      product_desc:
        "S02 | Wireless Bluetooth RGB Controller Multi-Functional for Nintendo Switch OLED, Switch Lite, PC & Mobile | Universal Gamepad",
      overview_desc:
        "Featuring customizable RGB lighting, it adds a stylish and personalized touch to your gaming setup. The ergonomic design ensures comfort during extended play sessions, while responsive buttons and analog sticks deliver precise control.",
      list_price: "16.08",
      current_price: "16.08",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Sa04b3210b94842799c5943328c025f63W_36f5c063-5554-4d3b-8f2e-c7d1437a875a.webp?v=1737035164",
      brand_name: "Lenovo",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: false,
    },
    {
      id: 8,
      url: "/products/razer-sanrio-cinnamoroll-kuromi-my-melody-usb-bluetooth-dual-mode-wireless-office-game-mouse-limited-edition?variant=49815794057554",
      title:
        "Razer Sanrio Limited Edition Dual-mode Wireless Office and Gaming Mouse featuring Cinnamoroll, Kuromi, and My Melody",
      product_desc:
        "Sanrio | <em>Limited-Edition</em> Dual-mode Cinnamoroll, Kuromi, & My Melody | Wireless Gaming Mouse",
      overview_desc:
        "The Razer Sanrio Cinnamoroll Kuromi My Melody Mouse not only serves as a high-performance tool for gaming and productivity but also allows you to express your personality. Its unique design makes it an eye-catching accessory for your workspace while ensuring you have everything you need to excel.",
      list_price: "127.00",
      current_price: "127.00",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Razer-Sanrio-Cinnamoroll-Kuromi-My-Melody-USB-Bluetooth-Dual-mode-Wireless-Office-Game-Mouse-Limited-Edition_fcece83e-d648-47a4-895d-25c68c9f986a.webp?v=1731865178",
      brand_name: "Razer",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: false,
    },
    {
      id: 9,
      url: "/products/skaven-arch-warlock-age-of-sigmar",
      title:
        "Skaven Arch-Warlock - Age of Sigmar",
      overview_desc:
        "⚔️ Unleash Chaos with Skaven Arch-Warlock! - Dive into the fierce battles of Warhammer Age of Sigmar with this intricately designed miniature. Perfect for players and collectors, this figure showcases the cunning and explosive ingenuity of the Skaven race, sure to enhance your tabletop experience.",
      product_desc:
        "Skaven Arch-Warlock | Age of Sigmar",
      list_price: "34.37",
      current_price: "34.37",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l1600_d2180602-9c15-483a-916f-130bfde792b8.jpg?v=1743568871",
      brand_name: "Games Workshop",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: false,
    },
    {
      id: 10,
      url: "/products/vault-boy-fallout-glow-in-dark-5-figure",
      title:
        "Vault Boy Fallout Glow in Dark 5\" Figure",
      overview_desc:
        "**<em>Shine Bright: Exclusive Vault Boy Glow in the Dark Figure</em>** Bring your Fallout collection to life with the Vault Boy Fallout Glow in the Dark Edition 5",
      product_desc:
        "Vault Boy Fallout Glow in Dark 5\" Figure",
      list_price: "45.99",
      current_price: "39.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_26188daf-a56e-4e21-a938-ee766096ea0b.jpg?v=1744727887",
      brand_name: "McFarlane Toys",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: true
    },
    {
      id: 11,
      url: "/products/crucial-x8-1tb-2tb-portable-ssd-usb-3-2-type-c-external-drive",
      title: "Crucial X8 1TB 2TB Portable SSD USB 3.2 Type-C External Drive",
      overview_desc:
        "**Ultimate Storage Powerhouse:** Get Up to 4TB Capacity, Lightning-Fast Read Speeds, & Portable Design with Crucial X6 PSSD. Store up to 20000 photos, 100 hours of video, 6000 songs, or 400GB of documents.",
      product_desc: "X8 | 1TB/2TB USB 3.2 Type-C SSD | External Drive",
      list_price: "140.36",
      current_price: "60.82",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Crucial_X8_Portable_SSD.webp?v=1734359025",
      brand_name: "Crucial",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: false,
    },
    {
      id: 12,
      url: "/products/kombat-kitty-gaming-headset-for-kids",
      title: "Kombat Kitty Gaming Headset for Kids",
      product_desc: "Kombat Kitty | Gaming Headset for Kids",
      overview_desc:
        "Compatible with all devices featuring a 3.5mm connector, such as PC, Mac, PlayStation, Xbox, Switch, and smartphones. Level up Your Game Today!",
      list_price: "26.17",
      current_price: "23.19",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/e339d8f90e60abf520782ea2c0aaccc3.jpg?v=1743186850",
      brand_name: "HyperGear",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_super_express: false,
      is_season_sale: false,
    },
    {
      id: 13,
      url: "/products/ultra-thin-m-2-ssd-heatsink-for-pcie-2280-solid-state-hard-drive-aluminum-alloy-cooling-thermal-pad-supports-single-double-sided-particles?_pos=7&_psq=m2&_ss=e&_v=1.0",
      title:
        "Ultra-Thin M.2 SSD Heatsink for PCIE 2280 Solid State Hard Drive - Aluminum Alloy Cooling Thermal Pad - Supports Single/Double-Sided Particles",
      product_desc:
        "M.2 Heatsink | PCIe 2280 Aluminum Cooling Thermal Pad Single/Double-Sided Particles | SSD Heatsink",
      overview_desc:
        "With its angular diversion type upper heat sink and all-aluminum construction, our heatsink not only looks sleek, but also efficiently dissipates heat to prevent overheating and slowdowns.",
      list_price: "6.84",
      current_price: "6.84",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Ultra-Thin_M.2_SSD_Heatsink_for_PCIE_2280_Solid_State_Hard_Drive.webp?v=1741334562",
      brand_name: "Swiftwintek",
      rating: 5.0,
      num_reviews: 1,
      is_express: false,
      is_season_sale: false,
    },
    {
      id: 14,
      url: "/products/catwoman-noir-edition-collectible-vinyl-figure",
      title: "Catwoman Noir Edition Collectible Vinyl Figure",
      product_desc: "Catwoman Noir Edition Collectible Vinyl Figure",
      overview_desc:
        "Styled in a dramatic black-and-white palette, this <em>special edition</em> piece captures Catwoman’s classic charm with a bold monochrome twist — a must-have for fans of DC Comics, Batman, and premium collectibles.",
      list_price: "37.89",
      current_price: "37.89",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_06cc572e-a58f-4682-8a86-be407102169c.jpg?v=1744814651",
      brand_name: "Cryptozoic Entertainment",
      rating: 0.0,
      num_reviews: 0,
      is_express: true,
      is_super_express: false,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 15,
      url: "/products/the-masque-daemons-of-slaanesh-chaos-warhammer-age-sigmar-40k-blister",
      title:
        "The Masque Daemons of Slaanesh Chaos Warhammer Age Sigmar 40K Blister",
      overview_desc:
        "Unleash the sinister grace of The Masque of Slaanesh, a mesmerizing and deadly daemon that dances across the battlefield! This highly detailed Warhammer Age of Sigmar & Warhammer 40K miniature embodies the chaotic beauty of Slaanesh, striking fear into enemies with hypnotic agility and relentless attacks.",
      product_desc:
        "The Masque Daemons of Slaanesh Chaos Warhammer Age Sigmar 40K Blister",
      list_price: "49.95",
      current_price: "44.95",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l1600_4fe2d797-1317-43d0-806b-6caac14ac058.jpg?v=1743396528",
      brand_name: "Games Workshop",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: true,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 16,
      url: "/products/premium-hard-shell-case-for-nintendo-switch-switch-oled-ultra-thin-protective-cover-m-l-styles?variant=50349258867026",
      title: "Premium Hard Shell Case for Nintendo Switch & Switch OLED – Ultra-Thin Protective Cover (M & L Styles)",
      overview_desc:
        "Enhance your Nintendo Switch or Switch OLED with this sleek hard shell protective case, designed for both M and L styles. Made from high-quality, lightweight materials, this ultra-thin cover provides superior protection against scratches, dust, and minor impacts.",
      product_desc:
        "Hard Shell Case | Nintendo Switch & Switch OLED Premium Ultra-Thin (M & L Styles) | Protective Cover",
      list_price: "10.79",
      current_price: "10.79",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/S243e902199914a08a36cc27475429ae8q.webp?v=1740518003",
      brand_name: "Swiftwintek",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: false
    }
  ];
}
function fetchNewArrivals() {
  return [
    {
      id: 1,
      url: "/products/hepa-air-purifier-for-clean-air-odor-removal",
      title:
        "HEPA Air Purifier for Clean Air & Odor Removal",
      overview_desc:
        "**<em>Breathe Easy: Advanced HEPA Air Purifier for Your Home</em>** Transform your living space with our premium HEPA Air Purifier, designed specifically to provide clean and fresh air while removing odors, dust, mold, and allergens.",
      product_desc:
        "HEPA Air Purifier for Clean Air & Odor Removal",
      list_price: "38.99",
      current_price: "29.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_dbf2f805-cec6-4c6c-b810-ef8d317d1ccd.jpg?v=1744713534",
      brand_name: "Swiftwintek",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 2,
      url: "/products/jbl-quantum-400-gaming-headphones-wired-surround",
      title: "JBL Quantum 400 Gaming Headphones - Wired & Surround",
      overview_desc:
        "**Conquer the Game: Elevate Your Audio Experience** Immerse yourself in the world of gaming with the JBL Quantum 400 Wired Over-Ear Gaming Headphones.",
      product_desc: "JBL Quantum 400 Gaming Headphones - Wired & Surround",
      list_price: "75.95",
      current_price: "49.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_89023301-f03e-4232-937f-d6e4afef09fa.jpg?v=1743927433",
      brand_name: "JBL",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 3,
      url: "/products/unpainted-kraken-miniature-for-d-d-gamers",
      title: "Unpainted Kraken Miniature for D&D Gamers",
      overview_desc:
        "This incredible figure is perfect for D&D enthusiasts who want to add a touch of creativity and personalization to their gameplay. Each mini comes primed and ready to paint, allowing you to unleash your artistic side while creating the ultimate game companion.",
      product_desc:
        "Unpainted Kraken Miniature for D&D Gamers",
      list_price: "55.49",
      current_price: "49.95",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_5a3275e5-e396-41c0-a89a-8df4083f503c.jpg?v=1743446231",
      brand_name: "WizKids",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: true,
    },
    {
      id: 4,
      url: "/products/kombat-kitty-gaming-headset-for-kids",
      title: "Kombat Kitty Gaming Headset for Kids",
      product_desc: "Kombat Kitty | Gaming Headset for Kids",
      overview_desc:
        "Compatible with all devices featuring a 3.5mm connector, such as PC, Mac, PlayStation, Xbox, Switch, and smartphones. Level up Your Game Today!",
      list_price: "26.17",
      current_price: "23.20",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/e339d8f90e60abf520782ea2c0aaccc3.jpg?v=1743186850",
      brand_name: "HyperGear",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_super_express: false,
      is_season_sale: false,
    },
    {
      id: 5,
      url: "/products/vault-boy-fallout-glow-in-dark-5-figure",
      title:
        "Vault Boy Fallout Glow in Dark 5\" Figure",
      overview_desc:
        "**<em>Shine Bright: Exclusive Vault Boy Glow in the Dark Figure</em>** Bring your Fallout collection to life with the Vault Boy Fallout Glow in the Dark Edition 5",
      product_desc:
        "Vault Boy Fallout Glow in Dark 5\" Figure",
      list_price: "45.99",
      current_price: "39.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_26188daf-a56e-4e21-a938-ee766096ea0b.jpg?v=1744727887",
      brand_name: "McFarlane Toys",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: true
    },
    {
      id: 6,
      url: "/products/the-masque-daemons-of-slaanesh-chaos-warhammer-age-sigmar-40k-blister",
      title:
        "The Masque Daemons of Slaanesh Chaos Warhammer Age Sigmar 40K Blister",
      overview_desc:
        "Unleash the sinister grace of The Masque of Slaanesh, a mesmerizing and deadly daemon that dances across the battlefield! This highly detailed Warhammer Age of Sigmar & Warhammer 40K miniature embodies the chaotic beauty of Slaanesh, striking fear into enemies with hypnotic agility and relentless attacks.",
      product_desc:
        "The Masque Daemons of Slaanesh Chaos Warhammer Age Sigmar 40K Blister",
      list_price: "49.95",
      current_price: "44.95",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l1600_4fe2d797-1317-43d0-806b-6caac14ac058.jpg?v=1743396528",
      brand_name: "Games Workshop",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: true,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 7,
      url: "/products/kree-supreme-intelligence-heroclix-figure",
      title:
        "Kree Supreme Intelligence HeroClix Figure",
      product_desc:
        "Kree Supreme Intelligence HeroClix Figure",
      overview_desc:
        "**<em>Unlock the Power of Kree Supreme Intelligence: Limited Edition HeroClix!</em>** Experience the thrill of commanding the esteemed Kree Supreme Intelligence with this exclusive HeroClix figure, originally available only during the 2015 HeroClix Convention Season.",
      list_price: "52.50",
      current_price: "47.55",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_53bf6b2c-6881-4cbc-8360-2820f3a2ab48.jpg?v=1744804240",
      brand_name: "WizKids",
      rating: 0.0,
      num_reviews: 0,
      is_express: true,
      is_super_express: false,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0,
      is_hot: true
    },
    {
      id: 8,
      url: "/products/hepa-air-purifier-for-large-rooms-smoke-allergens",
      title: "HEPA Air Purifier for Large Rooms - Smoke & Allergens",
      product_desc: "HEPA Air Purifier for Large Rooms - Smoke & Allergens",
      overview_desc:
        "**<em>Breathe Clean: Medical Grade HEPA Air Purifier for Home</em>** Enjoy fresh, purified air in your large living spaces with the Sejoy Home Air Purifier.",
      list_price: "49.99",
      current_price: "49.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_12069da1-a33d-489c-b1ae-89da6c84080d.jpg?v=1743944496",
      brand_name: "Sejoy",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 9,
      url: "/products/daemon-targaryen-collector-box-house-of-the-dragon",
      title: "Daemon Targaryen Collector Box – House of the Dragon",
      overview_desc:
        "Step into the epic saga of House Targaryen, where legend and legacy intertwine in breathtaking fashion. The Daemon Targaryen Collector Box captures the essence of a beloved character from the hit HBO series, House of the Dragon.",
      product_desc: "Daemon Targaryen Collector Box – House of the Dragon",
      list_price: "49.99",
      current_price: "47.95",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_4dbc0d9c-ac47-41c6-ba56-2c1ac42b1358.png?v=1744819166",
      brand_name: "McFarlane Toys",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: true,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 10,
      url: "/products/squishmallows-set-of-3-easter-axolotls-anastasia-monica-treyton-toydrop-exclusive-plush-toys",
      title:
        "Squishmallows Set of 3 Easter Axolotls - Anastasia, Monica & Treyton | Toydrop Exclusive Plush Toys",
      overview_desc:
        "Celebrate Easter with the limited-edition Squishmallows Set of 3 Easter Axolotls! This exclusive Toydrop collection features Anastasia, Monica, and Treyton, each designed with vibrant pastel colors and adorable details.",
      product_desc:
        "Squishmallows Set of 3 Easter Axolotls - Anastasia, Monica & Treyton | Toydrop Exclusive Plush Toys",
      list_price: "66.49",
      current_price: "50.00",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_f07e8e73-6beb-45fc-a8a8-ae1a961bf778.jpg?v=1744045152",
      brand_name: "Swiftwintek",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: true,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 11,
      url: "/products/hp-h200-gaming-headset-with-led-mic-comfort",
      title:
        "HP H200 Gaming Headset with LED Mic & Comfort",
      overview_desc:
        "Dive into immersive gameplay with the HP H200 Wired Gaming Headset, designed for serious gamers who demand the best. Featuring advanced 50mm audio drivers, this headset delivers exceptional stereo bass and simulated surround sound, enhancing every battle cry and explosion.",
      product_desc:
        "HP H200 | With LED Mic & Comfort | Gaming Headset",
      list_price: "43.14",
      current_price: "43.14",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_eb655a72-7603-46bb-af56-e7084499331e.jpg?v=1743192644",
      brand_name: "HP",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: false,
    },
    {
      id: 12,
      url: "/products/wi-fi-enabled-18-oscillating-pedestal-fan",
      title:
        "Wi-Fi Enabled 18” Oscillating Pedestal Fan",
      product_desc: "Wi-Fi Enabled 18” Oscillating Pedestal Fan",
      overview_desc:
        "**<em>Stay Cool Effortlessly with Smart Technology</em>.** Experience a breath of fresh air at home with the Comfort Zone 18-Inch Wi-Fi Oscillating Pedestal Fan.",
      list_price: "72.95",
      current_price: "49.95",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_baa11d3b-6478-49e2-a24f-61fac2ca59bf.jpg?v=1744045813",
      brand_name: "Swiftwintek",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 13,
      url: "/products/heavy-duty-adjustable-tv-stand-for-26-55-tvs",
      title:
        "Heavy Duty Adjustable TV Stand for 26\"-55\" TVs",
      overview_desc:
        "**Upgrade Your Viewing Experience with a Sturdy TV Stand** Transform your living space with our Heavy Duty Adjustable TV Stand, designed to securely accommodate 26\\",
      product_desc:
        "Heavy Duty Adjustable TV Stand for 26\"-55\" TVs",
      list_price: "39.99",
      current_price: "39.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_2d0c5e09-bab8-433e-9c8d-19bb0025a9bf.jpg?v=1743464931",
      brand_name: "Swiftwintek",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: false,
      is_super_express: true,
    },
    {
      id: 14,
      url: "/products/apple-ipod-touch-6th-7th-gen-256gb-fast-shipping",
      title:
        "Apple iPod Touch 6th & 7th Gen 256GB - Fast Shipping",
      overview_desc:
        "This best-selling device offers a stunning multi-touch display, an 8MP camera, and the latest iOS updates, ensuring you can enjoy your favorite apps and games without limitations.",
      product_desc:
        "iPod Touch | 6th & 7th Gen 256GB | Fast Shipping",
      list_price: "4.59",
      current_price: "4.59",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_d3d4ec05-86d6-42c7-aa5f-b391e615fcc8.jpg?v=1743544290",
      brand_name: "Apple",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0,
    },
    {
      id: 15,
      url: "/products/26-laptop-holder-sofa-side-end-c-table-multiple-stand-desk-notebook-beside-home",
      title:
        "26\" Laptop Holder Sofa Side End C Table Multiple Stand Desk Notebook Beside Home",
      overview_desc:
        "Are you looking for a side table for your living room or bedroom? This compact side table is not only sturdy but modern to match any furniture set. The C-shaped tray table stands steady on the floor and you can place it beside your bed or sofa as a laptop table, coffee table, or end table.",
      product_desc:
        "26\" Laptop Holder Sofa Side End C Table Multiple Stand Desk Notebook Beside Home",
      list_price: "47.99",
      current_price: "47.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_da2c7f5c-a46e-461b-a50d-27f7efac65a4.jpg?v=1743928313",
      brand_name: "Swiftwintek",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 16,
      url: "/products/adjustable-gpu-support-bracket-with-magnetic-base?variant=50610932056402",
      title:
        "Adjustable GPU Support Bracket with Magnetic Base",
      overview_desc:
        "**<em>Secure Your Graphics Card: Adjustable GPU Support Bracket</em>** Keep your gaming rig safe and stylish with the JEYI Adjustable GPU Support Bracket, designed to prevent GPU sag and protect your graphics card from potential damage.",
      product_desc:
        "Adjustable GPU Support Bracket with Magnetic Base",
      list_price: "6.48",
      current_price: "6.48",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Sf6d790354de348b880574f5e96a16fddT.webp?v=1744825232",
      brand_name: "JEYI",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: false,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0
    }
  ];
}
function fetchAllBargains() {
  return [
    {
      id: 1,
      url: "/products/saruman-grima-miniatures-lord-of-the-rings-set",
      title:
        "Saruman & Grima Miniatures - Lord of the Rings Set",
      overview_desc:
        "Dive into the enchanting world of Middle Earth with the Saruman the White & Gríma Wormtongue Miniature Set, perfect for avid tabletop gamers and collectors.",
      product_desc:
        "Saruman & Grima | Miniatures Lord of the Rings Set | Collectible Figurines",
      list_price: "74.76",
      current_price: "49.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_0a2299ac-b640-464e-b98c-d5eaa7e5c3bc.jpg?v=1743384301",
      brand_name: "Games Workshop",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: true,
    },
    {
      id: 2,
      url: "/products/samsung-evoplus-64gb-u1v10a1-128gb-256gb-512gb-u3v30a2-microsd-memory-tf-card-microsdxc-uhs-i-class10-read-speed-up-to-130mb-s?variant=49907056083282",
      title:
        "SAMSUNG EVO Plus MicroSD Memory Card - 64GB, 128GB, 256GB, 512GB UHS-I Class 10 with Read Speed up to 130MB/s",
      product_desc:
        "EVO Plus | 64GB, 256GB, 512GB Class 10 w/ Read Speed up to 130MB/s | Micro SD Card",
      overview_desc:
        "Unlock the full potential of your devices with the SAMSUNG EVOPlus MicroSD Memory Card. Available in capacities of 64GB, 128GB, 256GB, and 512GB, this microSD card is designed to meet all your storage needs while delivering top-notch performance.",
      list_price: "20.11",
      current_price: "13.16",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/SAMSUNG-EVOPlus-64GB-U1V10A1-128GB-256GB-512GB-U3V30A2-MicroSD-Memory-TF-Card-microSDXC-UHS-I-Class10_57ca95a4-fc2e-45f4-9ace-29486b423a62.webp?v=1733561579",
      brand_name: "SAMSUNG",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: false,
      bundle_amt: 3,
      bundle_discount: 15
    },
    {
      id: 3,
      url: "/products/baseus-organizer-bag-zipper-storage-case-for-iphone-15-14-pro-max-earphone-power-bank-cable-charger-pc-digital-accessories-bag",
      title:
        "Baseus EasyJourney Electronics Organizer Bag for iPhone 15/14 Pro Max - Zipper Storage Case for Cables, Chargers, and Accessories",
      overview_desc:
        "Transform your travel experience with the Baseus Organizer Bag Zipper Storage Case. Specially designed for the iPhone 15 and 14 Pro Max, this versatile storage solution is perfect for keeping all your essential electronics in one tidy place.",
      product_desc:
        "EasyJourney | iPhone 15/14 Pro Max - Zipper Case for Cables, Chargers, & Accessories | Electronics Organizer Bag",
      list_price: "15.95",
      current_price: "8.12",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Baseus-Organizer-Bag-Zipper-Storage-Case-for-iPhone-15-14-Pro-Max-Earphone-Power-Bank-Cable_c02bbaea-941c-4c42-9b57-374b60020cfe.webp?v=1732655294",
      brand_name: "Baseus",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: false,
    },
    {
      id: 4,
      url: "/products/ssk-aluminum-m2-ssd-case-usb-3-2-gen2-enclosure?variant=49966916338002",
      title: "SSK Aluminum M2 SSD Case USB 3.2 Gen2 Enclosure",
      overview_desc:
        "Enhance your storage capability with the SSK Aluminum M2 SSD Case USB 3.2 Gen2 Enclosure. Choose between the elegant and comfortable C371 slider version with an arc shell design or the refined C370 thickened version with a CNC-processed metal shell.",
      product_desc: "M.2 Case | Aluminum USB 3.2 Gen2 | SSD Enclosure",
      list_price: "36.91",
      current_price: "25.28",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Sb98b8d42bafb44f1a53f5c5980448571K.webp?v=1734642200",
      brand_name: "SSK",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: true,
    },
    {
      id: 5,
      url: "/products/gamesir-nova-lite-wireless-switch-controller-bluetooth-gamepad-with-hall-effect-for-nintendo-switch-iphone-android-and-pc",
      title:
        "GameSir Nova Lite Wireless Switch Controller – Bluetooth Gamepad with Hall Effect for Nintendo Switch, iPhone, Android, and PC",
      overview_desc:
        "Experience next-level gaming with the GameSir Nova Lite Wireless Switch Controller, designed for seamless compatibility with Nintendo Switch, iPhone, Android, and PC. Featuring Hall Effect sensing technology, this controller eliminates joystick drift for ultra-precise control and a longer lifespan.",
      product_desc:
        "Nova Lite Wireless | Switch Controller Bluetooth w/ Hall Effect iPhone, Android, and PC | Universal Gamepad",
      list_price: "62.70",
      current_price: "28.68",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/S5ba84da58575439896491f5361e1a543N.webp?v=1740405480",
      brand_name: "GameSir",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: false,
    },
    {
      id: 6,
      url: "/products/wireless-68-key-mechanical-gaming-keyboard",
      title:
        "Wireless 68-Key Mechanical Gaming Keyboard",
      product_desc: "Wireless 68-Key Mechanical Gaming Keyboard",
      overview_desc:
        "Transform your gaming experience with the Wireless 68-Key Mechanical Gaming Keyboard featuring dual connectivity modes—Bluetooth 5.0 and 2.4G USB.",
      list_price: "44.49",
      current_price: "35.95",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Sd8485ad189f74f7e8953d66f0278db8dj.webp?v=1744191846",
      brand_name: "Swiftwintek",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: false,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 7,
      url: "/products/thermalright-pa120-mini-white-cpu-cooler-6-heat-pipe-twin-tower-radiator-intel-amd-compatible",
      title:
        "Thermalright PA120 MINI WHITE CPU Cooler – 6 Heat Pipe, Twin-Tower Radiator, Intel & AMD Compatible",
      overview_desc:
        "Featuring a robust 6 heat pipe design and a twin-tower radiator, this air cooler ensures efficient heat dissipation for your high-performance CPU. Whether you're using Intel's LGA1700, 115X, 1200 or AMD's AM5 socket, this cooler is built for seamless compatibility.",
      product_desc:
        "PA120 MINI | 6 Heat Pipes BLACK Twin-Tower Radiator Intel & AMD Compatible | CPU Cooler",
      list_price: "55.66",
      current_price: "36.67",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/S697d342814b54c69bd36ff752a5c2450g.webp?v=1740645932",
      brand_name: "Thermalright",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: true,
    },
    {
      id: 8,
      url: "/products/kharadron-overlords-endrinmaster-figure-aos",
      title:
        "Kharadron Overlords Endrinmaster Figure AOS",
      product_desc:
        "Kharadron Overlords Endrinmaster Figure AOS",
      overview_desc:
        "Dive into the exciting world of Warhammer Age of Sigmar with the premium Kharadron Overlords Endrinmaster figure, a must-have for every passionate gamer and collector.",
      list_price: "44.22",
      current_price: "35.43",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_671e6b38-c940-4791-b671-da21dd609ca4.jpg?v=1743554647",
      brand_name: "Games Workshop",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: true,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 9,
      url: "/products/ultra-microsd-128gb-32gb-64gb-256gb-512gb-a1-micro-sd-card-sd-tf-flash-card-memory-card-class-10-for-phone?variant=49903998501202",
      title:
        "A1 Class 10 Ultra Micro SD Card - Available in 32GB, 64GB, 128GB, 256GB, and 512GB for Phones and Devices",
      overview_desc:
        "With a Class 10 rating, this microSD card ensures high-speed data transfer, making it ideal for 4K video recording and high-resolution photography.",
      product_desc:
        "A1 Class 10 Ultra | Available in 32GB, 64GB, 128GB, 256GB, & 512GB for Phones & Devices | Micro SD Card",
      list_price: "9.16",
      current_price: "6.87",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Ultra-microsd-128GB-32GB-64GB-256GB-512GB-A1-Micro-SD-Card-SD-TF-Flash-Card-Memory_9e288693-e18c-42e8-919f-43cf31190067.webp?v=1733483201",
      brand_name: "SanDisk",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: false,
    },
    {
      id: 10,
      url: "/products/wi-fi-enabled-18-oscillating-pedestal-fan",
      title:
        "Wi-Fi Enabled 18” Oscillating Pedestal Fan",
      product_desc: "Wi-Fi Enabled 18” Oscillating Pedestal Fan",
      overview_desc:
        "**<em>Stay Cool Effortlessly with Smart Technology</em>.** Experience a breath of fresh air at home with the Comfort Zone 18-Inch Wi-Fi Oscillating Pedestal Fan.",
      list_price: "72.95",
      current_price: "49.95",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_baa11d3b-6478-49e2-a24f-61fac2ca59bf.jpg?v=1744045813",
      brand_name: "Swiftwintek",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 11,
      url: "/products/kingfast-1tb-sata-3-ssd-for-pcs-laptops?variant=50477835190610",
      title:
        "KingFast 512GB SATA 3 SSD for PCs & Laptops",
      overview_desc:
        "Experience premium reliability and exceptional performance with the KingFast 1TB SATA 3 Solid State Drive, perfect for gamers and business users alike.",
      product_desc:
        "KingFast 512GB | 2.5\" SATA 3 SSD for PC & Laptops | Solid State Drive",
      list_price: "88.83",
      current_price: "46.27",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/S4994f0055262486bab576ffa9367cf1d5.webp?v=1742492959",
      brand_name: "KingFast",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: true,
      bundle_amt: 2,
      bundle_discount: 12.0
    },
    {
      id: 12,
      url: "/products/razer-basilisk-v3-gaming-mouse-fastest-switch-chroma-rgb",
      title: "Razer Basilisk V3 Gaming Mouse - Fastest Switch Chroma RGB",
      product_desc: "Basilisk V3 Gaming Mouse - Fastest Switch Chroma RGB",
      overview_desc:
        "Unleash your gaming potential with its fastest switch, Chroma RGB lighting, and 11 programmable buttons. Featuring a 26K DPI optical sensor and HyperScroll tilt wheel, this mouse is designed with iconic ergonomics and 100% PTFE mouse feet for smooth gliding on any surface.",
      list_price: "91.43",
      current_price: "49.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Razer_Basilisk_V3_Gaming_Mouse_-_Fastest_Switch_Chroma_RGB_f48e72b5-bec0-4769-8dda-977ee408a2a6.webp?v=1743904936",
      brand_name: "Razer",
      rating: 4.0,
      num_reviews: 1,
      is_express: true,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0,
    },
    {
      id: 13,
      url: "/products/cooler-master-mf120-halo-argb-cooling-fan-120mm?variant=49500952428882",
      title: "Cooler Master MF120 HALO ARGB Cooling Fan 120mm",
      product_desc: "MF120 HALO | ARGB 120mm PWM | Cooling Fan",
      overview_desc:
        "Designed with a 5V/3PIN ARGB interface and PWM functionality, this quiet fan ensures optimal airflow and temperature control, keeping your CPU cool during intense gaming sessions or heavy workloads.",
      list_price: "55.61",
      current_price: "25.59",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/S43550bb33dfe45a58f694dd720e8647at.webp?v=1727427745",
      brand_name: "Cooler Master",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: false,
    },
    {
      id: 14,
      url: "/products/pro-x3-wireless-gaming-mouse-lightweight-ergonomic-with-macro-features-26000-dpi-precision-sensor-for-pc-mac?variant=49769124954450",
      title:
        "Pro X3 Wireless Gaming Mouse - Lightweight & Ergonomic with Macro Features, 26000 DPI Precision Sensor for PC/Mac",
      product_desc:
        "Pro X3 | Lightweight & Ergonomic 26000 DPI PC/Mac | Wireless Gaming Mouse",
      overview_desc:
        "Equipped with the advanced PixArt PAW3395 sensor for pinpoint accuracy, making every click count with a remarkable 26000 DPI. It's crafted to fit comfortably in your hand, allowing for extended gaming sessions without discomfort.",
      list_price: "57.98",
      current_price: "31.77",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/S5a22da6a1d384ac68a76cba6245aa0ebb.jpg_640x640.jpg_33b6cae9-92a3-43a4-b62e-253970bae769.webp?v=1730972569",
      brand_name: "Attack Shark",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: false,
    },
    {
      id: 15,
      url: "/products/hepa-air-purifier-for-clean-air-odor-removal",
      title:
        "HEPA Air Purifier for Clean Air & Odor Removal",
      overview_desc:
        "**<em>Breathe Easy: Advanced HEPA Air Purifier for Your Home</em>** Transform your living space with our premium HEPA Air Purifier, designed specifically to provide clean and fresh air while removing odors, dust, mold, and allergens.",
      product_desc:
        "HEPA Air Purifier for Clean Air & Odor Removal",
      list_price: "38.99",
      current_price: "29.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_dbf2f805-cec6-4c6c-b810-ef8d317d1ccd.jpg?v=1744713534",
      brand_name: "Swiftwintek",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0
    },
    {
      id: 16,
      url: "/products/jbl-quantum-400-gaming-headphones-wired-surround",
      title: "JBL Quantum 400 Gaming Headphones - Wired & Surround",
      overview_desc:
        "**<em>Conquer the Game: Elevate Your Audio Experience</em>** Immerse yourself in the world of gaming with the JBL Quantum 400 Wired Over-Ear Gaming Headphones.",
      product_desc: "JBL Quantum 400 Gaming Headphones - Wired & Surround",
      list_price: "75.95",
      current_price: "49.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/s-l500_89023301-f03e-4232-937f-d6e4afef09fa.jpg?v=1743927433",
      brand_name: "JBL",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: true,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0
    }
  ];
}
function fetchBestsellers() {
  return [
    {
      id: 1,
      url: "/products/lenovo-2tb-1tb-512gb-256gb-128gb-micro-sd-tf-memory-cards-for-nintendo-switch-ps5?variant=50327535092050",
      title:
        "Lenovo 2TB, 1TB, 512GB, 256GB, 128GB Micro SD & TF Memory Cards for Nintendo Switch & PS5",
      product_desc: "Flash Memory Cards | 2TB, 1TB, 512GB, 256GB, 128GB Micro for Nintendo Switch & PS5 | Micro SD/TF Card",
      overview_desc:
        "Maximize your storage capacity with the Lenovo 2TB Memory Card, the perfect solution for gamers, content creators, and tech enthusiasts alike. This high-performance card offers a variety of sizes, including 2TB, 1TB, 512GB, 256GB, and 128GB, catering to all your storage needs.",
      list_price: "0.89",
      current_price: "0.89",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/S08ca59cfd0f24d25ad3ddaec1bc99092d.webp?v=1740100438",
      brand_name: "Lenovo",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: false,
    },
    {
      id: 2,
      url: "/products/adata-xpg-rgb-ddr4-memory-ram?variant=49520116924754",
      title: "ADATA XPG RGB DDR4 Memory RAM",
      product_desc: "XPG D35G | 3600MHz XMP RGB DDR4 | DRAM",
      overview_desc:
        "Elevate Performance with the ADATA XPG SPECTRIX D35G RGB DDR4 Memory RAM. Designed for gamers, content creators, & PC enthusiasts, this high-performance RAM module not only enhances your system's speed and responsiveness but also adds a visually stunning RGB glow to your setup.",
      list_price: "39.80",
      current_price: "39.80",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/ADATA_XPG_RGB_DDR4.webp?v=1734363041",
      brand_name: "ADATA",
      rating: 4.1,
      num_reviews: 3,
      is_express: true,
      is_season_sale: false,
    },
    {
      id: 3,
      url: "/products/lenovo-micro-sd-card-uhs-i-u3-a2-2tb-1tb-256gb-128gb-for-phones-pcs-huawei-lenovo-devices?variant=50071097540946",
      title:
        "Lenovo Micro SD Card (UHS-I U3 A2) - 2TB, 1TB, 256GB, 128GB for Phones, PCs, Huawei & Lenovo Devices",
      overview_desc:
        "With UHS-I U3 and A2 ratings, this card delivers lightning-fast read/write speeds, allowing for quick app launches, smooth video recording, and fast data transfers.",
      product_desc:
        "Flash Memory Cards | UHS-I U3 A2 2TB, 1TB, 256GB, 128GB for Phones, PCs, Huawei & Lenovo Devices | Micro SD Card",
      list_price: "8.48",
      current_price: "8.16",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/S52e8f182b176407eb8fb10bac1e7275ak_c8179325-6242-44c8-b471-286517c6c672.webp?v=1736583954",
      brand_name: "Lenovo",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: false,
      bundle_amt: 3,
      bundle_discount: 15
    },
    {
      id: 4,
      url: "/products/ultra-thin-m-2-ssd-heatsink-for-pcie-2280-solid-state-hard-drive-aluminum-alloy-cooling-thermal-pad-supports-single-double-sided-particles?_pos=7&_psq=m2&_ss=e&_v=1.0",
      title:
        "Ultra-Thin M.2 SSD Heatsink for PCIE 2280 Solid State Hard Drive - Aluminum Alloy Cooling Thermal Pad - Supports Single/Double-Sided Particles",
      product_desc:
        "M.2 Heatsink | PCIe 2280 Aluminum Cooling Thermal Pad Single/Double-Sided Particles | SSD Heatsink",
      overview_desc:
        "With its angular diversion type upper heat sink and all-aluminum construction, our heatsink not only looks sleek, but also efficiently dissipates heat to prevent overheating and slowdowns.",
      list_price: "6.84",
      current_price: "6.84",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Ultra-Thin_M.2_SSD_Heatsink_for_PCIE_2280_Solid_State_Hard_Drive.webp?v=1741334562",
      brand_name: "Swiftwintek",
      rating: 5.0,
      num_reviews: 1,
      is_express: false,
      is_season_sale: false,
    },
    {
      id: 5,
      url: "/products/lenovo-2tb-1tb-512gb-256gb-128gb-micro-sd-tf-memory-cards-for-nintendo-switch-ps5?variant=50327535092050",
      title:
        "Lenovo 2TB, 1TB, 512GB, 256GB, 128GB Micro SD & TF Memory Cards for Nintendo Switch & PS5",
      overview_desc:
        "Maximize your storage capacity with the Lenovo 2TB Memory Card, the perfect solution for gamers, content creators, and tech enthusiasts alike. This high-performance card offers a variety of sizes, including 2TB, 1TB, 512GB, 256GB, and 128GB, catering to all your storage needs.",
      product_desc:
        "Flash Memory Cards | 2TB, 1TB, 512GB, 256GB, 128GB Nintendo Switch & PS5 | Micro SD/TF Card",
      list_price: "0.89",
      current_price: "0.89",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Se08f8ad5eeac4794bba818d5fa68b4edv.webp?v=1740100439",
      brand_name: "Lenovo",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: false,
      bundle_amt: 3,
      bundle_discount: 15
    },
    {
      id: 6,
      url: "/products/jeyi-graphics-card-brace-gpu-support-bracket-ibrace-8?_pos=3&_psq=Jey&_ss=e&_v=1.0",
      title:
        "JEYI Graphics Card Brace GPU Support Bracket - iBrace-8",
      overview_desc:
        "Strengthen your graphics card setup with the expertly designed JEYI iBrace-8 Universal VGA Graphics Card Holder. Enjoy a Lightweight and Compact Aluminum Design",
      product_desc:
        "iBrace-8 | Universal VGA Aluminum | GPU Support Bracket",
      list_price: "9.54",
      current_price: "6.36",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/JEYI_Graphics_Card_Brace_GPU_Support_Bracket_-_iBrace-8.webp?v=1742848972",
      brand_name: "JEYI",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: false,
    },
    {
      id: 7,
      url: "/products/hd-premium-tempered-glass-screen-protector-for-nintendo-switch?variant=49349847187794",
      title:
        "HD Premium Tempered Glass - Screen Protector for Nintendo Switch",
      product_desc:
        "HD Premium | Tempered Glass for Nintendo Switch | Screen Protector",
      overview_desc:
        "Easy to install and ultra-thin, it maintains the original touchscreen sensitivity while providing a strong barrier against everyday wear and tear.",
      list_price: "6.92",
      current_price: "6.92",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/nintendo_switch_screen_protector.webp?v=1741078821",
      brand_name: "Swiftwintek",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: false,
    },
    {
      id: 8,
      url: "/products/luxury-liquid-silicone-magnetic-case-for-google-pixel-8-7-6-pro-for-magsafe-cases-wireless-charge-bumper-cover-phone-accessories?variant=49859983016274",
      title:
        "Premium Magnetic Liquid Silicone Case for Google Pixel 8 7 6 Pro - MagSafe Compatible Wireless Charging Bumper Cover",
      product_desc:
        "Premium Magnetic Liquid Silicone Case for Google Pixel 8 7 6 Pro - MagSafe Compatible Wireless Charging Bumper Cover",
      overview_desc:
        "Introducing the Luxury Liquid Silicone Magnetic Case for your Google Pixel 8, 7, and 6 Pro. This exquisite phone case combines elegance with functionality, ensuring your device is shielded from everyday wear and tear while maintaining a sophisticated look.",
      list_price: "4.65",
      current_price: "4.36",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Premium_Magnetic_Liquid_Silicone_Case_for_Google_Pixel_8_7_6_Pro.webp?v=1743757819",
      brand_name: "Swiftwintek",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: false,
    },
    {
      id: 9,
      url: "/products/logitech-k380-wireless-bluetooth-keyboard?variant=49231513354578",
      title: "Logitech K380 Wireless Bluetooth Keyboard",
      overview_desc:
        "Explore the versatility of the Logitech K380 SKU which offers multi-device connection capabilities through Bluetooth. In a small and lightweight design, this keyboard boasts exceptional portability while providing top-notch performance.",
      product_desc: "K380 | Bluetooth Membrane Tactile multi-device | Wireless Keyboard",
      list_price: "53.39",
      current_price: "53.39",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Logitech_K380_Wireless_Bluetooth_Keyboard_Be_Free.webp?v=1723314986",
      brand_name: "Logitech",
      rating: 0,
      num_reviews: 0,
      is_express: true,
      is_season_sale: false,
    },
    {
      id: 10,
      url: "/products/razer-basilisk-v3-gaming-mouse-fastest-switch-chroma-rgb",
      title: "Razer Basilisk V3 Gaming Mouse - Fastest Switch Chroma RGB",
      product_desc: "Basilisk V3 Gaming Mouse - Fastest Switch Chroma RGB",
      overview_desc:
        "Unleash your gaming potential with its fastest switch, Chroma RGB lighting, and 11 programmable buttons. Featuring a 26K DPI optical sensor and HyperScroll tilt wheel, this mouse is designed with iconic ergonomics and 100% PTFE mouse feet for smooth gliding on any surface.",
      list_price: "91.43",
      current_price: "49.99",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Razer_Basilisk_V3_Gaming_Mouse_-_Fastest_Switch_Chroma_RGB_f48e72b5-bec0-4769-8dda-977ee408a2a6.webp?v=1743904936",
      brand_name: "Razer",
      rating: 4.0,
      num_reviews: 1,
      is_express: true,
      is_season_sale: false,
      bundle_amt: 0,
      bundle_discount: 0.0,
      
    },
    {
      id: 11,
      url: "/products/xiaomi-micro-sd-memory-card-2tb-1tb-512gb-256gb-up-to-90mb-s-class10-u3-128gb-tf-card-4k-hd-for-usb-card-reader-adapter-microsd",
      title:
        "Xiaomi 2TB Micro SD Card - High-Speed 128GB to 1TB Storage, 90MB/s Class 10 U3, Ideal for 4K HD Videos and USB Card Reader Compatibility",
      product_desc:
        "Flash Memory Cards | High-Speed 128GB/2TB 90MB/s Class 10 U3 Ideal for 4K HD Videos & USB Card Reader Compatibility | Micro SD Card",
      overview_desc:
        "Upgrade your storage capabilities with the Xiaomi Micro SD Memory Card and experience faster app performance and higher-quality media capture like never before!",
      list_price: "9.84",
      current_price: "9.84",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Xiaomi_2TB_Micro_SD_Card_-_High-Speed_128GB_to_1TB_Storage.webp?v=1736680398",
      brand_name: "Xiaomi",
      rating: 4.1,
      num_reviews: 2,
      is_express: true,
      is_season_sale: false,
      bundle_amt: 3,
      bundle_discount: 15
    },
    {
      id: 12,
      url: "/products/8gb-crucial-ddr3l-sodimm-laptop-memory-1600mhz-1-35v?variant=47801310544210",
      title: "8GB Crucial DDR3L SODIMM Laptop Memory - 1600MHz, 1.35V",
      product_desc: "DDR3L | 2GB - 8GB SODIMM 1600MHz 1.35V | Laptop Memory",
      overview_desc:
        "This high-quality, best-selling memory module is designed for laptops & compact desktop systems. With a capacity of 8GB and a speed of 1600 MHz, it provides a perfect fit for your computing needs.",
      list_price: "2.32",
      current_price: "2.32",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/8GB_Crucial_DDR3L_SODIMM_Laptop_Memory_-_1600MHz_1.35V.webp?v=1737545218",
      brand_name: "Crucial",
      rating: 0,
      num_reviews: 0,
      is_express: false,
      is_season_sale: false,
    },
    {
      id: 13,
      url: "/products/300w-biolomix-2-in-1-coffee-spice-grinder?variant=50401695105362",
      title: "300W BioloMix 2-in-1 Coffee & Spice Grinder",
      product_desc: "300W BioloMix 2-in-1 Coffee & Spice Grinder",
      overview_desc:
        "**Ultimate Kitchen Must-Have: Grind & Chop with Ease!** Experience the convenience of the BioloMix 300W 2-in-1 Coffee and Spice Grinder, the perfect fit for culinary enthusiasts and coffee lovers alike.",
      list_price: "70.23",
      current_price: "62.27",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/S6ba44ae070384d1d83364eac324bbe5fO.webp?v=1741432424",
      brand_name: "BioloMix",
      rating: 4.0,
      num_reviews: 1,
      is_express: false,
      is_season_sale: true
    },
    {
      id: 14,
      url: "/products/razer-orochi-v2-lightweight-wireless-gaming-mouse-with-18k-dpi-sensor?_pos=2&_psq=orochi&_ss=e&_v=1.0",
      title: "Razer Orochi V2 – Lightweight Wireless Gaming Mouse with 18K DPI Sensor",
      product_desc: "Razer Orochi V2 – Lightweight Wireless Gaming Mouse with 18K DPI Sensor",
      overview_desc:
        "Experience gaming like never before with the Razer Orochi V2 Mobile Wireless Gaming Mouse. Engineered for the ultimate balance of performance and portability, this lightweight mouse is perfect for gamers on the move.",
      list_price: "80.07",
      current_price: "39.40",
      img_url:
        "https://cdn.shopify.com/s/files/1/0795/4854/7410/files/Razer-Orochi-V2-Mobile-Wireless-Gaming-Mouse-Lightweight-2-Wireless-Modes-5G-Mice-Advanced-18K-DPI_bc769bb2-24a0-4cbc-98cc-871f13e9fcb9.webp?v=1732654149",
      brand_name: "Razer",
      rating: 0.0,
      num_reviews: 0,
      is_express: false,
      is_super_express: false,
      is_season_sale: false,
      is_hot: true
    }
  ];
}
// ENDS HERE

let headerLinks = document.getElementsByClassName("header__menu-item");

const getAllLinks = () => {
  for (let index = 0; index < headerLinks.length; index++) {
    const hdrLink = headerLinks[index];
    hdrLink.addEventListener("click", (e) => {
      changeLinkColor(e);
    });
  }
};
function changeLinkColor(e) {
  const link = e.lastChild; // Assuming e.lastChild is a text node
  if (link.style.color === "rgb(57, 63, 82)") {
    // The computed color (rgb format)
    link.style.color = "blue"; // Change color to blue
  } else {
    link.style.color = "rgb(57, 63, 82)"; // Reset to default color
  }
}
// Get the main side button and alt side button
const mainSideBtn = document.getElementById("Details-menu-drawer-container");
let altSideBtn = document.getElementById("hburger-side__opener-wrapper");

// Add a click event listener to the main button
mainSideBtn.addEventListener("click", function (event) {
  // Prevent clicks on child elements from triggering the toggle
  if (event.target === mainSideBtn) {
    // Check the current display status of alt-sidebar-button and toggle it
    if (
      altSideBtn.style.display === "none" ||
      altSideBtn.style.display === ""
    ) {
      altSideBtn.style.display = "block"; // Show the button
    } else {
      altSideBtn.style.display = "none"; // Hide the button
    }
  }
});

// Optional: If needed, stop propagation on child elements to prevent it from bubbling up
mainSideBtn.addEventListener("click", function (event) {
  event.stopPropagation();
});

/*Collapsible sidebar*/
function w3_open() {
  document.getElementById("mySidebar").style = "width: 90%; left: 0rem;";
}
function w3_close() {
  document.getElementById("mySidebar").style = "width: 0%; left: -10rem;";
}
let scrollYBefore = 0;
window.addEventListener("scroll", () => {
  if (scrollYBefore < window.scrollY) {
    document.getElementById("collaps-side__top-section").style =
      "padding-top: 3rem;";
  } else if (scrollYBefore > window.scrollY) {
    document.getElementById("collaps-side__top-section").style =
      "padding-top: 6rem;";
  }

  if (scrollYBefore > window.scrollY && window.scrollY > 1500) {
    document.getElementById("move-to-top").style.top = "7.5rem";
    scrollYBefore = window.scrollY;
  }
  // Remove the 'move to top' link
  else if (window.scrollY < 1500 || scrollYBefore < window.scrollY) {
    document.getElementById("move-to-top").style.top = "-6rem";
    scrollYBefore = window.scrollY;
  }
});
// General function to toggle menus
const toggleMenu = (menuId) => {
  // Get all menu wrappers and hide them
  const menuWrappers = document.querySelectorAll('.menu__content-wrapper');
  menuWrappers.forEach(wrapper => {
    if (wrapper.id !== `${menuId}__content-wrapper`) {
      wrapper.classList.remove('visible');
    }
  });

  // Get the targeted menu
  const targetMenu = document.getElementById(`${menuId}__content-wrapper`);
  const isCurrentlyVisible = targetMenu.classList.contains('visible');
  targetMenu.classList.toggle('visible');

  // Reset all chevrons to their initial position
  const allChevrons = document.querySelectorAll('.menu-right__chevron');
  allChevrons.forEach(chevron => {
    chevron.classList.remove('rotated');
  });

  // Handle chevron rotation for the current menu
  const chevron = document.getElementById(`chevron-${menuId}__list-icon`);
  if (chevron) {
    // Only rotate the chevron if the menu is being shown
    if (!isCurrentlyVisible) {
      chevron.classList.add('rotated');
    }
  }
};

// Event listeners for buttons
const navMenuButtons = document.querySelectorAll('.nav__menu-link');
navMenuButtons.forEach(button => {
  button.addEventListener('click', () => {
    const menuId = button.getAttribute('data-menu-id');
    toggleMenu(menuId);
  });
});

// - TOP SLIDES IMAGE FUNCTIONALITY -
const slides = document.querySelector(".slides");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const dotsContainer = document.querySelector(".carousel-dots");
const totalSlides = document.querySelectorAll(".slide").length;
let index = 0;

function updateSlide() {
    slides.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
}

function createDots() {
    dotsContainer.innerHTML = ""; // Clear existing dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("div");
        dot.classList.add("carousel-dot"); // Use the new class name
        if (i === index) dot.classList.add("active");
        dot.addEventListener("click", () => {
            index = i;
            updateSlide();
        });
        dotsContainer.appendChild(dot);
    }
}

prevBtn.addEventListener("click", () => {
    index = (index - 1 + totalSlides) % totalSlides;
    updateSlide();
});
nextBtn.addEventListener("click", () => {
    index = (index + 1) % totalSlides;
    updateSlide();
});

createDots();
updateSlide();

setInterval(() => {
    index = (index + 1) % totalSlides;
    updateSlide();
}, 5000);
// Scroll into Announcement-bar section for each page/collection
document.addEventListener("DOMContentLoaded", function () {
  // Helper: Add #announcement-bar to links
  function appendAnchorToLinks(selector, pathStart) {
    const links = document.querySelectorAll(selector);
    links.forEach(link => {
      try {
        const url = new URL(link.href, window.location.origin);
        if (url.pathname.startsWith(pathStart) && url.hash !== "#shopify-section-sections--25149438460242__announcement_bar_YdTCGV") {
          url.hash = "shopify-section-sections--25149438460242__announcement_bar_YdTCGV";
          link.href = url.pathname + url.hash;
        }
      } catch (e) {
        // Ignore invalid or relative links
      }
    });
  }

  // 1. Update collection links
  appendAnchorToLinks('a[href^="/collections/"]', "/collections/");

  // 2. Update product links
  appendAnchorToLinks('a[href^="/products/"]', "/products/");
  
  // The remaining links
  appendAnchorToLinks('a[href^="/policies/"]', "/policies/");
  
  appendAnchorToLinks('a[href^="/blogs/"]', "/blogs/");

  appendAnchorToLinks('a[href^="/pages/"]', "/pages/");

  appendAnchorToLinks('a[href^="/cart"]', "/cart");

  // 3. Scroll to anchor after load
  if (window.location.hash === "#shopify-section-sections--25149438460242__announcement_bar_YdTCGV") {
    const el = document.querySelector("#shopify-section-sections--25149438460242__announcement_bar_YdTCGV");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
});
let lastScrollY = window.scrollY;
const customNav = document.querySelector('#menu-main__nav');

if (customNav) {
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      // Scrolling down
      customNav.classList.add('scrolled-down');
      customNav.classList.remove('scrolled-up');
    } else {
      // Scrolling up
      customNav.classList.add('scrolled-up');
      customNav.classList.remove('scrolled-down');
    }

    lastScrollY = currentScrollY;
  });
}
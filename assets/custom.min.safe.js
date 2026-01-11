"use strict";

/* =========================
   Helpers (safe + reusable)
   ========================= */
  const formatRelativeDateUS = (isoString) => {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  const DAY = 24 * 60 * 60 * 1000;

  // normalize to start of day so "Today/Yesterday" is stable
  const startOfDay = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diffDays = Math.floor((startOfDay(now) - startOfDay(d)) / DAY);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  const weeks = Math.floor(diffDays / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

  const months = Math.floor(diffDays / 30.44);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

  // older than ~1 year: show Month Year (cleaner than "17 months ago")
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(d);
};

const formatISODateTime = (isoString) => {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

   /* SMOOTH FADE-IN/SLIDE DISCOVERY ICON */
   const icon = document.querySelector('.discovery-icon');
if (icon) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        icon.classList.add('reveal');
      }
    });
  });
  obs.observe(icon);
}

  document.addEventListener("DOMContentLoaded", () => {
  const h1 = document.querySelector(".collection-hero__title");
  if (!h1) return;

  let full = h1.textContent.trim();

  // Extract only last segment after last dash
  // Example: "Category - Tech & Office Essentials - USB Flash Drives"
  // Result:  "USB Flash Drives"
  let title = full.split(" - ").pop().trim();

  // Hyphen rule (7 Day -> 7-Day)
  title = title.replace(/(\d+)\s+([A-Za-zÅÄÖåäö])/g, "$1-$2");

  // Trim rule
  const maxLength = 40;
  if (title.length > maxLength) {
    let trimmed = title.substring(0, maxLength);
    const cutAt = trimmed.lastIndexOf(" ");
    title = trimmed.substring(0, cutAt) + "…";
  }

  // Update H1 ONLY with cleaned title
  h1.textContent = title;
});

  document.addEventListener("DOMContentLoaded", () => {
  const tocToggle = document.querySelector(".toc-toggle");
  const sidebar   = document.querySelector(".swtek-article__sidebar");
  const tocItems  = document.querySelectorAll(".toc-item");

  // Stop script unless you're on an article page
  if (!tocToggle || !sidebar || tocItems.length === 0) return;

  // Toggle drawer
  tocToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("open");
    document.body.classList.toggle("toc-open");
  });

  // Prevent closing when interacting inside drawer
  sidebar.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Close drawer when tapping outside
  document.addEventListener("click", () => {
    sidebar.classList.remove("open");
    document.body.classList.remove("toc-open");
  });

  // Close drawer when a TOC item is clicked
  tocItems.forEach(item => {
    item.addEventListener("click", () => {
      sidebar.classList.remove("open");
      document.body.classList.remove("toc-open");
    });
  });
});

/* SCROLL-SPY USING OBSERVER */
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".swtek-article__section");
  const tocItems = document.querySelectorAll(".toc-item");

  const options = {
    root: null,               // viewport
    rootMargin: "-40% 0px -40% 0px",
    threshold: 0              // section considered active when midpoint crosses rootMargin
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        // Remove old active state
        tocItems.forEach(item => {
          item.classList.remove("toc-active");
        });

        // Add active state to matching TOC item
        const activeItem = document.querySelector(`.toc-item[data-target="${id}"]`);
        if (activeItem) {
          activeItem.classList.add("toc-active");
        }
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const tocItems = document.querySelectorAll(".toc-item");

  tocItems.forEach(item => {
    item.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);

      if (!targetSection) return;

      // 🔥 Shopify header height fix (automatically detects your theme header)
      const stickyHeader = document.querySelector("header.site-header, .header-wrapper, .shopify-section-header");
      const headerOffset = stickyHeader ? stickyHeader.offsetHeight + 85 : 120;

      // 🔥 Calculate exact scroll position
      const scrollPos = targetSection.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: scrollPos,
        behavior: "smooth"
      });
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const breadcrumb = document.querySelector("nav.breadcrumb.breadcrumb-collection[aria-label='breadcrumb']");
  if (!breadcrumb) return;

  // Keyword → { url, label } mapping
  const keywordLinks = {
    "Category": { url: "/collections/shop-by-category", label: "Shop by Category" },
    "Discover": { url: "/collections", label: "Discover" }
  };

  const items = breadcrumb.querySelectorAll("li[aria-current='page'], li:not(:first-child)");

  items.forEach(item => {
    let html = item.innerHTML;

    // Replace " - " with › for style consistency
    html = html.replace(/ - /g, " › ");

    // Replace keywords with link + optional label
    for (const [keyword, { url, label }] of Object.entries(keywordLinks)) {
      const pattern = new RegExp(`\\b${keyword}\\b`, "g");
      if (pattern.test(html)) {
        html = html.replace(
          pattern,
          `<a href="${url}" class="auto-breadcrumb-link color__blue link-uline__focus" style="color:var(--color-link,#0073ff);">${label}</a>`
        );
      }
    }

    item.innerHTML = html;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const breadcrumb = document.querySelector(".breadcrumb, nav[aria-label='breadcrumb']");

  if (breadcrumb) {
    // Find all breadcrumb text nodes
    const items = breadcrumb.querySelectorAll("li, span, a");

    items.forEach(item => {
      // Replace " - " only in plain text (not links like Home ›)
      if (item.textContent.includes(" - ")) {
        item.textContent = item.textContent.replace(/ - /g, " › ");
      }
    });
  }
});
   /* TRIM EVERYTHING BEFORE THE LAST '-' ON ALL COLLECTION PAGES, BREADCRUMP HANDLES PATH */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".collection-hero__text-wrapper");
  if (header) {
    // Get the visible text (ignore the visually-hidden span)
    const visibleText = header.childNodes[1]?.textContent?.trim();
    if (visibleText && visibleText.includes(" - ")) {
      const parts = visibleText.split(" - ");
      const finalPart = parts[parts.length - 1].trim();
      header.childNodes[1].textContent = finalPart;
    }
  }
});
   /* Remove 'empty' or redundant <p> elements */
  document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.pdesc__body p').forEach(p => {
    const html = p.innerHTML.trim();
    const text = p.textContent.trim();
    // Remove if it's empty or just a non-breaking space
    if (!text || html === '&nbsp;') {
      p.remove();
    }
  });
});
  function limitRecommendationBadges() {
  const rec = document.querySelector('product-recommendations');
  if (!rec) return;

  // Target only badges inside the recommendation section
  rec.querySelectorAll('.card__badge-wrapper').forEach(wrapper => {
    const badges = wrapper.querySelectorAll('.badge');
    if (badges.length > 2) {
      badges.forEach((badge, index) => {
        if (index >= 2) badge.style.display = 'none';
      });
    }
  });
}
// 1️⃣ Run once the section has fully loaded
document.addEventListener('shopify:section:load', event => {
  if (event.target.matches('product-recommendations, #product-recommendations, .product-recommendations')) {
    limitRecommendationBadges();
  }
});

// 2️⃣ Run once after the element finishes fetching its content
document.addEventListener('DOMContentLoaded', () => {
  const rec = document.querySelector('product-recommendations');
  if (rec) {
    // Observe when Shopify populates its content
    const observer = new MutationObserver(mutations => {
      if (rec.querySelector('.card__badge-wrapper')) {
        limitRecommendationBadges();
        observer.disconnect(); // stop after badges found
      }
    });
    observer.observe(rec, { childList: true, subtree: true });
  }
});

   /* Remove Excessive Product Badges*/
   document.querySelectorAll('.card__badge-wrapper').forEach(wrapper => {
  const badges = wrapper.querySelectorAll('.badge');
  if (badges.length > 2) {
    badges.forEach((badge, index) => {
      if (index >= 2) badge.style.display = 'none';
    });
  }
});
   /* Replace [at] with proper @ (to avoid bots/scrapers)*/
   document.querySelectorAll('.email-text').forEach(span => {
  const email = span.textContent.replace('[at]', '@');
  span.textContent = email;
  span.parentElement.href = `mailto:${email}`;
});
  /* Additional Q&A */
  const faqQs = document.querySelectorAll('.add-faq-q');

faqQs.forEach((q, index, arr) => {
  q.addEventListener('click', () => {
    const answer = q.nextElementSibling;
    const isOpen = answer.style.maxHeight; // check current state

    // Reset everything first
    answer.style.maxHeight = null;
    answer.style.padding = null;

    // If not open → open with custom padding
    if (!isOpen) {
      answer.style.maxHeight = '500px';
      answer.style.padding = '1rem 3rem';
    }
    q.lastElementChild.classList.toggle('active');
  });
});
/* Ends Here */

  document.querySelectorAll('.jdgm-rev__author').forEach(el => {
  el.innerHTML = el.innerHTML.replace(
    /\[Amazon Buyer\]/g,
    '<span class="review-source amazon">Amazon Buyer</span>'
  );
  el.innerHTML = el.innerHTML.replace(
    /\[eBay Buyer\]/g,
    '<span class="review-source ebay">eBay Buyer</span>'
  );
});
  document.querySelector('.w3-hide-large').addEventListener('touchstart', function() {
  this.classList.toggle('rotated');
});

// then in loadProductSection(...) call fetchCollectionDataCached instead of fetchCollectionData
async function fetchCollectionDataCached(handle) {
  const key = `coll:${handle}:v1`;
  const cached = sessionStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  const data = await fetchCollectionData(handle);
  try { sessionStorage.setItem(key, JSON.stringify(data)); } catch(_) {}
  return data;
}

const toPlain = (html) => {
  const d = document.createElement("div");
  d.innerHTML = html || "";
  return (d.textContent || d.innerText || "").trim();
};
const truncate = (s, n = 110) =>
  (typeof s === "string" && s.length > n) ? s.slice(0, n).trim() + " …" : (s || "");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function serviceTypeLookup(tags) {
  return (
    tags.find((t) => t === "express delivery" || t === "U.S. Super Express") || ""
  );
}
function displayExpressDetails(serviceType) {
  let icon = "";
  if (serviceType === "express delivery") {
    icon = "delivery_truck_speed";
    serviceType = "Express";
  } else if (serviceType === "U.S. Super Express") {
    icon = "electric_bolt";
    serviceType = 'Express<span style="font-size: 1.97rem;">+</span>';
  }
  return `
  <div class="tooltip-wrapper">
    <div class="tooltip-container font-mserrat abs-pos flex-row__all-center color__dark-blue-txt margin-top__micro bdr-rad__strongest-plus xs-blue__border-left" style="top: 10rem; background: rgba(252, 252, 252, .6); padding: .15rem .75rem; margin-right: 12rem;">
      <p class="h5-xtra tooltip-trigger mg__none font-wght__bold-regular font-italic">${serviceType}</p>
      <div class="tooltip-box" role="tooltip">${displayPolicyTerms(serviceType)}</div>
      <span class="material-symbols-outlined notranslate color__dark-blue-txt mg-left__micro-plus" style="font-size: 20px; rotate: 4deg; ${serviceType === 'Express' ? 'margin-left: 6px;' : ''}">${icon}</span>
    </div>
  </div>`;
}
function displayPolicyTerms(serviceType) {
  if (serviceType === "Express") {
    return `<strong style="margin-bottom: 4px;" class="display-block font-mserrat color__dark-blue-txt h4-normal font-wght__bold-regular">Fast & Reliable Express Delivery</strong>
    <p>Get your order quickly with our Express Delivery service, <strong>exclusively for U.S. customers.</strong> Receive products within <strong>5 – 7 days</strong>. For more info, visit our <button type="button" aria-label="Go to Express Shipping Policy for U.S. Customers" title="Click to read the express shipping policy for U.S. customers" onclick="redirectToPolicy(event)" id="express-delvr__policy-btn" class="shipping-link link-uline__focus express-delvr__policy-btn" tabindex="0">Express Delivery Policy</button> page.</p>`;
  } else {
    return `<strong style="margin-bottom: 4px;" class="display-block font-mserrat color__dark-blue-txt h4-normal font-wght__bold-regular">Priority Shipping for U.S. Customers</strong>
    <p>Receive products in just <strong>2 – 5 days</strong>, <strong>exclusively for U.S. customers</strong>. For more info, visit our <button type="button" aria-label="Go to Express Shipping Policy for U.S. Customers" title="Click to read the express shipping policy for U.S. customers" onclick="redirectToPolicy(event)" id="express-delvr__policy-btn" class="shipping-link link-uline__focus express-delvr__policy-btn" tabindex="0">Express Delivery Policy</button> page.</p>`;
  }
}
function calculateDiscount(listPrice, salePrice) {
  if (
    typeof listPrice !== "number" ||
    typeof salePrice !== "number" ||
    isNaN(listPrice) ||
    isNaN(salePrice) ||
    listPrice <= 0 ||
    salePrice < 0 ||
    salePrice > listPrice
  ) {
    throw new Error("Invalid price values");
  }
  const discount = ((listPrice - salePrice) / listPrice) * 100;
  return discount % 1 === 0 ? discount.toFixed(0) : discount.toFixed(1);
}
const renderStars = (rating) => {
  const stars = Math.floor(rating);
  let starHTML = "";
  for (let i = 0; i < 5; i++) {
    const noMarginClass = i === 4 ? "mg__none" : "";
    starHTML += i < stars
      ? `<i class="fa-solid fa-star ${noMarginClass}"></i>`
      : `<i class="fa-regular fa-star ${noMarginClass}"></i>`;
  }
  return starHTML;
};
function redirectToPolicy(event) {
  event.preventDefault();
  window.location.href = "/pages/express-delivery-terms-conditions-for-u-s-customers";
}
const calculateReviews = (rating, numReviews) => {
  if (rating < 1.0) return "";
  return ` <div class="card-review__wrapper"> ${renderStars(rating)} <p class="card-review__details">${rating.toFixed(1)} (${numReviews} reviews)</p> </div>`;
};
function showDiscountText(d) { return d > 0 ? `Now ${d}% Off` : "Standard"; }
function displayCouponIcon(d) { return d > 0 ? `<i class="fa-sharp fa-solid fa-tags"></i>` : ""; }
const parsePrice = (price) => parseFloat(price.replace(/[^\d.-]/g, "").replace(",", "."));
const calcListPrice = (lstPrice, curPrice) => {
  const list = parsePrice(lstPrice);
  const current = parsePrice(curPrice);
  return list > current ? `<s class="transcy-money">$${lstPrice} USD</s>` : "";
};

/* =========================
   Lazy image observer (one)
   ========================= */
const lazyObserver = new IntersectionObserver((entries, obs) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;

    const img = e.target;
    if (!img.dataset.src) {
      obs.unobserve(img);
      continue;
    }
    img.onload = () => img.removeAttribute("data-src");
    img.src = img.dataset.src;
    obs.unobserve(img);
  }
}, {
  rootMargin: "300px 0px",
  threshold: 0.01,
});

const lazyLoadImages = (container) => {
  if (!container) return;
  container.querySelectorAll("img[data-src]")
    .forEach(img => lazyObserver.observe(img));
};


/* =========================
   Product card + sections
   ========================= */
const createCard = (
  product,
  imgWidth,
  specialImgUrl,
  specialImgAlt,
  specialImgWidth,
  specialImgId
) => {
  // Major safety improvement: escape anything inserted into innerHTML/attributes
  const esc = (v) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const id = product.id;
  const handle = product.handle || "";
  const url = `/products/${encodeURIComponent(handle)}`;

  const titleRaw = product.title ?? "";
  const title = esc(titleRaw);

  const product_desc = esc(
    truncate(toPlain(product.descriptionHtml || ""), 40).replace(/\s*\n\s*/g, " ")
  );

  const firstVariant = product.variants?.edges?.[0]?.node;
  const compareAtPrice =
    firstVariant?.compareAtPrice?.amount != null
      ? parseFloat(firstVariant.compareAtPrice.amount)
      : null;
  const currentPrice =
    firstVariant?.price?.amount != null ? parseFloat(firstVariant.price.amount) : null;

  const createdAtMs = Date.parse(product.createdAt);
  const diffDays = Number.isFinite(createdAtMs)
    ? Math.abs(Date.now() - createdAtMs) / (1000 * 60 * 60 * 24)
    : Infinity;

  const newBadge =
    diffDays <= 14
      ? `<div class="badge badge--custom label-new abs-pos" style="z-index:1; top:0; left:0;">New</div>`
      : "";

  const img_url_raw =
    product.images?.edges?.[0]?.node?.transformedSrc || specialImgUrl || "";

  const img_url = esc(img_url_raw);

  const vendor = esc(product.vendor || "Brand");

  const tags = Array.isArray(product.tags) ? product.tags : [];
  let service = serviceTypeLookup(tags);
  if (service === "express delivery" || service === "U.S. Super Express") {
    service = displayExpressDetails(service);
  }

  const listItem = document.createElement("li");
  const newCard = document.createElement("article");
  newCard.className = "product-all";
  newCard.id = `${id}`;

  newCard.innerHTML = ` 
    <a href="${esc(url)}" title="${title}" aria-label="Show product: ${title}">
      <figure class="flex-column__all-center mg__none">
        <div style="position: relative; display: inline-block;">
          <div class="image-zoom-wrapper">
            <img class="car-product-card__img"
                data-src="${img_url}"
                alt="${title}"
                width="${esc(imgWidth)}" height="${esc(Math.round(imgWidth * 1))}"
                loading="lazy" decoding="async"
                srcset="${img_url}&width=220 220w, ${img_url}&width=320 320w, ${img_url}&width=480 480w"
                sizes="(max-width: 480px) 45vw, 300px" />
          </div>
          <div class="flex-column__align-start gap-3r">
            ${newBadge}
            ${
              compareAtPrice && currentPrice && compareAtPrice > currentPrice
                ? `<div class="cards-custom__badges"><p class="sale-product__badge mg__none">Sale</p>${service}</div>`
                : ""
            }
          </div>
        </div>
      </figure>
      
      <img class="card-special-badge"
        data-src="${esc(specialImgUrl)}"
        alt=""
        aria-hidden="true"
        width="${esc(specialImgWidth)}"
        height="auto"
        id="${esc(specialImgId)}"
        loading="lazy"
        decoding="async" />

      <p class="product__brand-name margin-top__none">${vendor}</p>
      <div class="car__title-wrap">
        <p class="car__product-title line-height__std-extra"><strong>${title}</strong></p>
      </div>
      <div class="flex-column__all-center gap-1r" style="position: relative;">
        <div class="carousel-card__desc-wrapper">
          <p class="product-desc mg__none">${product_desc || "Details & specs inside"}</p>
        </div>
        <div style="position: absolute; top: 42%; left: 50%; transform: translateX(-50%);">
          <span class="card-expand-more material-symbols-outlined flex-row__all-center color__dark-grey-txt notranslate">expand_more</span>
          ${calculatePrice(compareAtPrice, currentPrice)}
        </div>
      </div>
      
    </a>`;

  listItem.appendChild(newCard);
  return listItem;
};

const calculatePrice = (compareAtPrice, currentPrice) => {
  if (compareAtPrice && currentPrice && compareAtPrice > currentPrice) {
    const discountPercent = calculateDiscount(compareAtPrice, currentPrice);
    return `
      <div class="price-wrapper">
        <span class="list-price"><s>$${compareAtPrice.toFixed(2)} USD</s></span>
        <span class="cur-price"> From $${currentPrice.toFixed(2)} USD</span>
      </div>
      <div class="discount-badge ws-no-wrap"><i class="fa-solid fa-tags" style="color: rgb(255, 70, 14);"></i> Now ${discountPercent}% Off!</div>`;
  }
  else return `
    <div class="price-wrapper">
      <span class="cur-price"> From $${(currentPrice ?? 0).toFixed(2)} USD</span>
    </div>`;
}
const COLLECTION_HANDLES = Object.freeze({
  featured: "editors-choice",
  bestsellers: "bestsellers-customers-choice",
  bargains: "winteks-huge-sale",
  arrivals: "new-arrivals",
});

const loadProductSection = async (
  type,
  containerId,
  imgUrl,
  title,
  imgWidth,
  specialImgSize,
  additionalClass = ""
) => {
  const handle = COLLECTION_HANDLES[type];
  if (!handle) {
    console.error(`Invalid product type: '${type}'`);
    return;
  }

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id '${containerId}' not found.`);
    return;
  }

  let collectionData;
  try {
    // Use cached fetch if you have it; otherwise swap to fetchCollectionData(handle)
    collectionData = await fetchCollectionDataCached(handle);
  } catch (err) {
    console.error(`Failed to fetch collection '${handle}' for type '${type}':`, err);
    return;
  }

  const products =
    collectionData?.products?.edges?.map(edge => edge.node) ?? [];

  if (products.length === 0) {
    // Optional: you can choose to hide the whole section here if desired
    console.warn(`No products returned for collection '${handle}' (type '${type}').`);
    return;
  }

  const carouselProducts = shuffleArray(products);

  // Build in memory first (faster than repeated append)
  const frag = document.createDocumentFragment();
  for (const product of carouselProducts) {
    frag.appendChild(
      createCard(product, imgWidth, imgUrl, title, specialImgSize, additionalClass)
    );
  }

  container.appendChild(frag);

  // NEW: no timeout needed; observe images inside this container immediately
  lazyLoadImages(container);
};

const fetchCollectionData = async (collectionHandle) => {
  const MOBILE = matchMedia("(max-width: 768px)").matches;
  const FIRST  = MOBILE ? 22 : 40;
  const shop = "swtek.io";

  const token = document
    .querySelector('meta[name="storefront-token"]')
    ?.getAttribute("content");

  if (!token) {
    console.error("Missing Storefront API token (meta tag).");
    return [];
  }

  const query = `{
    collectionByHandle(handle: "${collectionHandle}") {
      products(first: ${FIRST}) {
        edges {
          node {
            id title handle descriptionHtml vendor createdAt tags
            images(first: 1) { edges { node { transformedSrc } } }
            variants(first: 1) {
              edges { node {
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
              } }
            }
          }
        }
      }
    }
  }`;

  try {
    const response = await fetch(`https://${shop}/api/2023-04/graphql.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    if (!data?.data?.collectionByHandle) throw new Error("Error fetching products");
    return data.data.collectionByHandle;
  } catch (error) {
    console.error("Error fetching collection data:", error);
    return [];
  }
};

/* =========================
   Misc site-wide utilities
   ========================= */
const cardSlide = (container, direction) => {
  const wrapper = document.getElementById(container);
  if (!wrapper) return;
  const step = 34;  // rem
  const maxSteps = 5;
  const current = parseFloat(wrapper.dataset.offset || "0"); // steps
  let next = current + (direction === "left" ? 1 : -1);
  if (next > 0) next = -maxSteps;
  if (next < -maxSteps) next = 0;
  wrapper.dataset.offset = String(next);
  wrapper.style.transform = `translate3d(${next * step}rem,0,0)`;
  wrapper.style.willChange = "transform";
};

// menu chevrons
const toggleMenu = (menuId) => {
  const menuWrappers = document.querySelectorAll(".menu__content-wrapper");
  menuWrappers.forEach((w) => {
    if (w.id !== `${menuId}__content-wrapper`) w.classList.remove("visible");
  });
  const targetMenu = document.getElementById(`${menuId}__content-wrapper`);
  if (!targetMenu) return;
  const isVisible = targetMenu.classList.contains("visible");
  targetMenu.classList.toggle("visible");
  document.querySelectorAll(".menu-right__chevron").forEach(c => c.classList.remove("rotated"));
  const chevron = document.getElementById(`chevron-${menuId}__list-icon`);
  if (chevron && !isVisible) chevron.classList.add("rotated");
};

// optionally hide home-only blocks on non-home routes
function hideHomeContent() {
  const path = location.pathname;
  const isHome = path === "/" || /^\/$/.test(path);
  const isCollection = /^\/collections\//.test(path);
  const isProduct = /^\/products\//.test(path);
  const isBlogIndex = /^\/blogs(\/|$)/.test(path);
  const isArticle = /^\/blogs\/[^\/]+\/.+/.test(path);
  const isPage = /^\/pages\//.test(path);
  const isOther = !(isHome || isCollection || isProduct || isBlogIndex || isArticle || isPage);

  if (!(isCollection || isProduct || isBlogIndex || isArticle || isPage || isOther)) return;

  ['.homepage-carousel', '.section-track-order', '#shopify-section-sections--25149438460242__swtek_banner_JaafNR']
    .forEach(sel => document.querySelectorAll(sel).forEach(el =>
      el.style.setProperty('display', 'none', 'important')
    ));
}

/* =========================
   Single bootstrap (once)
   ========================= */
(() => {
  if (window.__swiftBootstrapped) return;
  window.__swiftBootstrapped = true;

  const path = location.pathname;
  const isHome       = path === "/" || /^\/$/.test(path);
  const isProduct    = /^\/products\//.test(path);
  const isBlog       = /^\/blogs\//.test(path);
  // const isCollection = /^\/collections\//.test(path); // available if needed

  const start = () => {
    initGlobal();
    if (isHome)    initHome();
    if (isBlog)    initBlog();
    if (isProduct) initProduct();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();

/* =========================
   Initializers
   ========================= */
function initGlobal() {
  // Product sections
  if (!Array.isArray(window.productSections)) {
    console.error("productSections is missing or not an array.");
  } else {
    for (const section of productSections) {
      loadProductSection(
        section.type,
        section.containerId,
        section.imgUrl,
        section.title,
        section.imgWidth,
        section.specialImgSize,
        section.additionalClass || ""
      );
    }
  }
  // Scroll (mobile-friendly, rAF throttled)
  let lastY = window.scrollY, scheduled = false;
  const onScroll = () => {
    const y = window.scrollY, up = y < lastY;

    const topSection = document.getElementById("collaps-side__top-section");
    if (topSection) topSection.style.paddingTop = up ? "6rem" : "3rem";

    const moveTop = document.getElementById("move-to-top");
    if (moveTop) moveTop.style.top = (up && y > 1500) ? "7.5rem" : "-6rem";

    const deskTopBtn = document.querySelector(".move-to-top__desk");
    if (deskTopBtn) deskTopBtn.classList.toggle("is-visible", y > 800);

    lastY = y; scheduled = false;
  };
  window.addEventListener("scroll", () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  // Hash injector via delegation (replaces scan-on-load)
  document.body.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="/"]');
    if (!link) return;
    try {
      const url = new URL(link.href, location.origin);
      const eligible = ["/collections","/products/","/policies/","/blogs/","/pages/","/cart"];
      if (eligible.some(p => url.pathname.startsWith(p)) &&
          url.hash !== "#shopify-section-sections--25149438460242__announcement_bar_E6VNaJ") {
        url.hash = "shopify-section-sections--25149438460242__announcement_bar_E6VNaJ";
        link.href = url.pathname + url.hash;
      }
    } catch (_) {}
  }, { passive: true });

  // Desktop-only nav hide/show
  const mql = matchMedia("(min-width: 1025px)");
  let navAttached = false, removeNavScroll = () => {};
  const reevaluateNav = () => {
    const customNav = document.querySelector("#menu-main__nav");
    if (!mql.matches || !customNav) {
      if (navAttached) removeNavScroll();
      navAttached = false;
      return;
    }
    if (navAttached) return;
    let lastY = window.scrollY, scheduled = false;
    const onScroll = () => {
      const y = window.scrollY, up = y < lastY;
      customNav.classList.toggle("scrolled-up", up);
      customNav.classList.toggle("scrolled-down", !up);
      lastY = y; scheduled = false;
    };
    const listener = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(onScroll); } };
    window.addEventListener("scroll", listener, { passive: true });
    removeNavScroll = () => window.removeEventListener("scroll", listener);
    navAttached = true;
  };
  mql.addEventListener ? mql.addEventListener("change", reevaluateNav)
                       : mql.addListener(reevaluateNav);
  reevaluateNav();

  // Menu chevrons
  const navMenuButtons = document.querySelectorAll(".nav__menu-link");
  navMenuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const menuId = button.getAttribute("data-menu-id");
      toggleMenu(menuId);
    });
  });

  // Side menu toggles
  const mainSideBtn = document.getElementById("Details-menu-drawer-container");
  const altSideBtn  = document.getElementById("hburger-side__opener-wrapper");
  if (mainSideBtn && altSideBtn) {
    mainSideBtn.addEventListener("click", (event) => {
      if (event.target === mainSideBtn) {
        const v = altSideBtn.style.display;
        altSideBtn.style.display = (v === "none" || v === "") ? "block" : "none";
      }
    }, { passive: true });
    mainSideBtn.addEventListener("click", (e) => e.stopPropagation(), { passive: true });
  }

  // Optional: hide home-only blocks on other pages
  hideHomeContent();
  new MutationObserver(hideHomeContent).observe(document.documentElement, { childList: true, subtree: true });

  // “Why choose us” modal (safe guards)
  const modal = document.querySelector(".whyus-modal");
  if (modal) {
    const triggers = document.querySelectorAll("[data-whyus-open]");
    const closeEls = document.querySelectorAll("[data-whyus-close]");

    triggers.forEach(tr => {
      tr.addEventListener("click", function (e) {
        e.preventDefault();
        const targetSelector = this.getAttribute("data-whyus-open");
        const targetModal = document.querySelector(targetSelector);
        if (targetModal) {
          targetModal.classList.add("is-open");
          document.body.style.overflow = "hidden";
        }
      });
    });
    closeEls.forEach(el => {
      el.addEventListener("click", () => {
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
      }
    });
  }
}
function initHome() {
 function initHomeCarousel() {
  const slidesContainer = document.querySelector(".slides");
  const slideElements = document.querySelectorAll(".slide");
  if (!slidesContainer || slideElements.length === 0) return;

  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const dotsContainer = document.querySelector(".carousel-dots");
  const totalSlides = slideElements.length;

  let index = 0;
  let intervalId = null;
  const dots = [];

  // --- Get current slide width dynamically ---
  const getSlideWidth = () => {
    // For mobile, optionally add margin/gap logic
    if (window.innerWidth <= 768) {
      const computedStyle = getComputedStyle(slideElements[0]);
      const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
      const marginRight = parseFloat(computedStyle.marginRight) || 0;
      return slideElements[0].offsetWidth + marginLeft + marginRight;
    }
    return slideElements[0].offsetWidth; // desktop
  };

  // --- Slide update ---
  const updateSlide = () => {
    const slideWidth = getSlideWidth();
    slidesContainer.style.transform = `translate3d(-${index * slideWidth}px, 0, 0)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  };

  // --- Create navigation dots ---
  const createDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.className = "carousel-dot" + (i === index ? " active" : "");
      dot.addEventListener("click", () => { index = i; updateSlide(); }, { passive: true });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
  };

  // --- Auto-slide ---
  const startAutoSlide = () => {
    if (!intervalId) intervalId = setInterval(() => {
      index = (index + 1) % totalSlides;
      updateSlide();
    }, 6000);
  };
  const stopAutoSlide = () => { clearInterval(intervalId); intervalId = null; };

  // --- Event listeners ---
  prevBtn?.addEventListener("click", () => {
    index = (index - 1 + totalSlides) % totalSlides;
    updateSlide();
  });

  nextBtn?.addEventListener("click", () => {
    index = (index + 1) % totalSlides;
    updateSlide();
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stopAutoSlide() : (!reduceMotion && startAutoSlide());
  });

  // --- Responsive: recalc width on resize ---
  window.addEventListener("resize", updateSlide);

  // --- Init ---
  createDots();
  updateSlide();
  if (!reduceMotion) startAutoSlide();

  // --- Return cleanup function if needed ---
  return () => {
    stopAutoSlide();
    window.removeEventListener("resize", updateSlide);
  };
}

// Initialize
initHomeCarousel();
}

function initBlog() {
  document.querySelector("#featured-products-label").style.display = "hidden";
  const resetButton = document.getElementById("reset-filters");
  const tagPillsContainer = document.getElementById("tag-pills");
  const activeFiltersContainer = document.getElementById("active-filters");
  const articlesContainer = document.getElementById("blog-articles");
  const rawData = document.getElementById("blog-articles-data")?.textContent;

  if (!rawData || !articlesContainer || !tagPillsContainer || !activeFiltersContainer || !resetButton) return;

  const allArticles = JSON.parse(rawData);
  const allTags = [...new Set(allArticles.flatMap((article) => article.tags))];
  const tagColors = {
    "New Arrivals": "#e74c3c", "Tech News": "#2c3e50", "Business Insider": "#9b59b6",
    "General News": "#2c3e50", "Gaming News": "#e67e22", "Gaming Insights": "#e67e22",
    "Gaming": "#e67e22", "Nvidia Insights": "#27ae60", "History": "#6F4F28",
    "First Look": "#00b6f5", "Tech Explained": "#27ae60", "Tech Basics": "#27ae60",
    "Review": "#0073ff", "Software": "#00b6f5", "Versus": "#b8255f",
    "Tech Performance": "#e74c3c", "Retrospective": "#9b59b6",
    "Tech Upgrades": "#27ae60", "Guide": "#27ae60", "How to": "#00b6f5"
  };

  let activeFilters = new Set();

  function getContrastTextColor(hexColor) {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#000000" : "#ffffff";
  }

  function createPill(tag, isActive = false, withRemove = false) {
    const pill = document.createElement("button");
    pill.textContent = tag;
    pill.className = `pill ${isActive ? "pill--active" : "pill--inactive"}`;
    if (tag === "All") pill.id = "filter-all-btn";
    pill.setAttribute("type", "button");

    if (withRemove) {
      const removeBtn = document.createElement("span");
      removeBtn.innerHTML = `<i class="fa-solid fa-xmark removable-icon"></i>`;
      removeBtn.style.cursor = "pointer";
      removeBtn.style.marginLeft = "6px";
      removeBtn.style.color = "#999";
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFilter(tag);
      });
      pill.appendChild(removeBtn);
    }
    pill.addEventListener("click", () => {
      if (tag === "All") clearFilters(); else toggleFilter(tag);
    });
    return pill;
  }

  function updateUI() {
    Array.from(tagPillsContainer.querySelectorAll("button")).forEach(pill => {
      const pillTag = pill.textContent.replace(" ×", "").trim();
      if (activeFilters.has("All") && pillTag === "All") {
        pill.classList.add("pill--active"); pill.classList.remove("pill--inactive");
      } else if (activeFilters.has(pillTag)) {
        pill.classList.add("pill--active"); pill.classList.remove("pill--inactive");
      } else {
        pill.classList.remove("pill--active"); pill.classList.add("pill--inactive");
      }
    });

    activeFiltersContainer.innerHTML = "";
    if (!activeFilters.has("All")) {
      activeFilters.forEach(tag => {
        const pill = createPill(tag, true, true);
        activeFiltersContainer.appendChild(pill);
      });
    }

    let filteredArticles;
    if (activeFilters.has("All")) filteredArticles = allArticles;
    else {
      filteredArticles = allArticles.filter(article =>
        [...activeFilters].every(filterTag => article.tags.includes(filterTag))
      );
    }
    renderArticles(filteredArticles);
  }

  function toggleFilter(tag) {
    if (activeFilters.has(tag)) activeFilters.delete(tag);
    else activeFilters.add(tag);
    if (activeFilters.size === 0) activeFilters.add("All");
    else activeFilters.delete("All");
    updateUI();
  }
  function clearFilters() {
    activeFilters.clear();
    activeFilters.add("All");
    updateUI();
  }
  function stripHtml(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }
  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength).trim() + "..." : text;
  }
  function renderArticles(articles) {
    articlesContainer.innerHTML = "";
    const noArticlesMessage = document.getElementById("no-articles-message");
    if (!noArticlesMessage) return;

    if (articles.length === 0) {
      noArticlesMessage.style.display = "block";
      return;
    } else {
      noArticlesMessage.style.display = "none";
    }

    const existingCards = Array.from(articlesContainer.children);
    existingCards.forEach((card) => { card.classList.add("hide"); });

    setTimeout(() => {
      articlesContainer.innerHTML = "";
      if (articles.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No articles found.";
        message.className = "no-articles-message fade-in";
        articlesContainer.appendChild(message);
        return;
      }
      else {
        const countEl = document.getElementById("articles-count");
        if (countEl) {
          countEl.textContent = `Showing ${articles.length} article${articles.length !== 1 ? "s" : ""}`;
        }
      }
      articles.forEach((article) => {
        const card = document.createElement("a");
        card.href = `${article.url}`;
        card.ariaLabel = `Learn/read about: ${article.title}`;
        card.title = `${article.title}"`;
        card.className = "article-container std__box-shadow margin-bottom__narrow";

        const imageHtml = article.image
          ? `<img src="${article.image.src}?width=300&height=300&fit=crop" alt="${article.title}" class="article-image" loading="lazy" />`
          : `<div class="article-fallback-image"><span>Tech Article</span></div>`;

        const rawExcerpt = article.summary_html || "";
        const cleanExcerpt = stripHtml(rawExcerpt);
        const excerpt = truncateText(cleanExcerpt, 100);

        const tags = article.tags && article.tags.length > 0 ? article.tags : "";
        const tagPills = tags.length > 0
          ? tags.split(",").map((tag) => {
              const cleanTag = tag.trim();
              const bgColor = tagColors[cleanTag] || "#ccc";
              const textColor = getContrastTextColor(bgColor);
              return `<span class="article-tag" style="background-color: ${bgColor}; color: ${textColor}">${cleanTag}</span>`;
            }).join("")
          : "";

        const blogPathMatch = window.location.pathname.match(/^\/blogs\/[^\/]+/);
        const currentBlogPath = blogPathMatch ? blogPathMatch[0] : "/blogs";
        const readTime = article?.read_time || null;
        const publishedISO = article?.published_at || "";
        const relDate = publishedISO ? formatRelativeDateUS(publishedISO) : "";
        const absDate = publishedISO
          ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(publishedISO))
          : "";
        const dtAttr = publishedISO ? formatISODateTime(publishedISO) : "";
        const readTimeHtml = readTime
        ? `<div class="article-card__meta color__dark-blue-txt flex-row__just-start gap-sm margin-top__micro" style="transform: translateX(2px);">
              <i class="fa-solid fa-xs fa-book-open article-card__meta-icon" aria-hidden="true"></i>
              <span class="p-regular article-card__readtime font-mplus ltr-spac__inline--soft">
                ${readTime} min
              </span>
              &bull;
              <p class="p-regular font-mplus mg__none">
                <time class="article-card__date"
                      datetime="${dtAttr}"
                      title="${absDate}">
                  ${relDate}
                </time>
              </p>
          </div>`
        : "";
        card.innerHTML = `
          <div class="article-image-wrapper">${imageHtml}</div>
          <div class="article-card__content color__card-dimgrey-std">
            <h2 class="article-card__title text-align-left font-mserrat color__dark-blue-txt h3-normal line-height__std-mini font-wght__bold-regular">${article.title}</h2>
            ${readTimeHtml}
            <p class="article-excerpt__custom color__dark-grey-txt margin-bottom__thick p-xlarge line-height__std-extra font-mplus">${excerpt}</p>
            ${tagPills ? `<div class="article-tags">${tagPills}</div>` : ""}
            <div style="transform: translateX(2px);">
              <p class="color__dark-grey-txt thin-lgrey__border-top pd-top__min-plus width-90 ltr-spacing__inline--xl" style="font-size: 1.1rem;">
              <span class="font-wght__bold-regular ltr-spacing__inline--xl">${article.author === "Daniel Bäck" ? "Wintek Editorial" : article.author}</span>
            </p>
            </div>
          </div>`;
        card.classList.add("fade-in");
        articlesContainer.appendChild(card);
      });
    }, 250);
  }

  // Build tag pills UI
  tagPillsContainer.innerHTML = "";
  tagPillsContainer.appendChild(resetButton);
  tagPillsContainer.appendChild(createPill("All"));
  const uniqueTags = [...new Set(allTags.flatMap(tagStr => tagStr.split(",").map(t => t.trim())))];
  uniqueTags.forEach(tag => tagPillsContainer.appendChild(createPill(tag)));

  resetButton.addEventListener("click", (e) => { e.preventDefault(); clearFilters(); });

  activeFilters.add("All");
  updateUI();
}

function initProduct() {
  // Copy-to-clipboard (delegation)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const targetId = btn.getAttribute("data-copy-target");
    const el = document.getElementById(targetId);
    if (!el) return;
    const textToCopy = el.innerText.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      const icon = btn.querySelector(".product-id__copy-icon");
      if (icon) {
        icon.textContent = "check";
        setTimeout(() => { icon.textContent = "content_copy"; }, 1500);
      }
    }).catch(err => console.error("Copy failed", err));
  }, { passive: true });

  // Collapsible product description (delegation)
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".pdesc__toggle");
    if (!toggle) return;
    const wrap = toggle.closest(".pdesc");
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      wrap?.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "View more";
    } else {
      wrap?.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.textContent = "View less";
    }
  });
}

/* =========================
   (Optional) public helpers
   ========================= */
function w3_open() { const el = document.getElementById("mySidebar"); if (el) el.style = "width: 90%; left: 0rem;"; }
function w3_close() { const el = document.getElementById("mySidebar"); if (el) el.style = "width: 0%; left: -10rem;"; }

// Image zoom
(() => {
  const overlay = document.getElementById("swtek-img-zoom");
  if (!overlay) return;

  const overlayImg = overlay.querySelector(".swtek-img-zoom__img");
  const closeBtn = overlay.querySelector(".swtek-img-zoom__close");

  let lastFocus = null;

  const openZoom = (imgEl) => {
    lastFocus = document.activeElement;

    // Use currentSrc if available (handles srcset nicely)
    const src = imgEl.currentSrc || imgEl.src;
    overlayImg.src = src;
    overlayImg.alt = imgEl.alt || "";

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("swtek-zoom-lock");
    closeBtn.focus();
  };

  const closeZoom = () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    overlayImg.src = "";
    overlayImg.alt = "";
    document.body.classList.remove("swtek-zoom-lock");

    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  // Click image -> open
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".swtek-article__figure img");
    if (!img) return;

    // Optional: ignore tiny UI icons if they are images too
    // if (img.classList.contains("your-icon-class")) return;

    openZoom(img);
  });

  // Click backdrop -> close (but not if clicking the big image itself)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeZoom();
  });

  // Close button
  closeBtn.addEventListener("click", closeZoom);

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) closeZoom();
  });
})();

/* ==========================================================
   SAVORA RESTAURANT – shared script (all pages)
   ========================================================== */
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80";

const foods = [
  { name: "Jollof Rice & Chicken", cat: "Rice", description: "Tasty Nigerian jollof rice with grilled chicken.", price: 6500, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85",
    long: "Smoky party-style jollof rice cooked slowly in a rich tomato and pepper base, served with a juicy piece of grilled chicken and sweet fried plantain on the side.",
    time: "25 min", cal: "720 kcal", serves: "1 person", ingredients: ["Long-grain rice", "Tomatoes", "Scotch bonnet", "Chicken", "Onions", "Thyme & curry", "Plantain"],
    reviews: [["Amaka O.", 5, "Perfect spice and a real smoky flavour. It tastes just like home.", "2 weeks ago"], ["Seyi A.", 4, "Generous portion and the chicken was tender. Could be a little spicier for me.", "1 month ago"]] },
  { name: "Beef Burger", cat: "Fast Food", description: "A juicy burger with fresh vegetables and sauce.", price: 4500, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
    long: "A thick beef patty grilled to order, topped with melted cheese, crisp lettuce, tomato and our house sauce, all inside a toasted bun.",
    time: "20 min", cal: "850 kcal", serves: "1 person", ingredients: ["Beef patty", "Cheddar cheese", "Lettuce", "Tomato", "House sauce", "Toasted bun"],
    reviews: [["Tunde B.", 5, "Arrived hot and juicy. Easily the best burger I've had this year.", "3 days ago"], ["Kemi L.", 5, "The sauce is unreal. I will order again.", "3 weeks ago"], ["David N.", 4, "Big and filling. Fries on the side would make it perfect.", "2 months ago"]] },
  { name: "Fresh Garden Salad", cat: "Fresh & Sweet", description: "Crunchy vegetables with a tasty dressing.", price: 3500, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
    long: "A bowl of crunchy seasonal vegetables tossed in a light, tangy dressing. Fresh, filling and a great partner to any grilled dish.",
    time: "10 min", cal: "280 kcal", serves: "1 person", ingredients: ["Lettuce", "Cucumber", "Tomato", "Carrot", "Sweetcorn", "House dressing"],
    reviews: [["Ifeoma C.", 5, "So fresh and crunchy. The dressing is light and not heavy at all.", "1 week ago"], ["Bola T.", 4, "Great as a side with the grilled chicken.", "1 month ago"]] },
  { name: "Chocolate Cake", cat: "Fresh & Sweet", description: "A soft chocolate cake for a sweet treat.", price: 2800, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    long: "A soft, moist chocolate sponge layered with rich chocolate cream. The perfect way to end a meal, or a treat on its own.",
    time: "5 min", cal: "520 kcal", serves: "1 slice", ingredients: ["Dark chocolate", "Flour", "Eggs", "Butter", "Cream", "Cocoa"],
    reviews: [["Chioma E.", 5, "The perfect way to end a meal. So soft and not too sweet.", "5 days ago"], ["Femi R.", 5, "Ordered for my sister's birthday and everyone loved it.", "2 months ago"]] },
  { name: "Cheese Pizza", cat: "Fast Food", description: "Freshly baked pizza with melted cheese.", price: 7000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85",
    long: "Hand-stretched dough baked until golden, covered in tomato sauce and a generous layer of melted mozzarella. Made to share, or not.",
    time: "30 min", cal: "980 kcal", serves: "1–2 people", ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Oregano", "Olive oil"],
    reviews: [["Obinna K.", 4, "Crispy base and lots of cheese. Took a little longer than expected.", "2 weeks ago"], ["Zainab M.", 5, "Best pizza in town. We finished it in minutes.", "1 month ago"]] },
  { name: "Chicken Fried Rice", cat: "Rice", description: "Fried rice with vegetables and chicken.", price: 6000, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85",
    long: "Fluffy rice stir-fried with colourful vegetables, tender chicken pieces and a touch of seasoning. Light, savoury and full of flavour.",
    time: "20 min", cal: "690 kcal", serves: "1 person", ingredients: ["Rice", "Chicken", "Carrots", "Green peas", "Sweetcorn", "Spring onion", "Soy seasoning"],
    reviews: [["Grace I.", 5, "Full of vegetables and perfectly seasoned.", "1 week ago"], ["Yusuf A.", 4, "Very tasty. Pair it with the grilled chicken.", "6 weeks ago"]] },
  { name: "Creamy Pasta", cat: "Mains", description: "Pasta served with a rich, creamy sauce.", price: 5500, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=85",
    long: "Perfectly cooked pasta folded through a rich, silky cream sauce with garlic and herbs. Comfort food at its best.",
    time: "20 min", cal: "760 kcal", serves: "1 person", ingredients: ["Pasta", "Cream", "Garlic", "Parmesan", "Herbs", "Black pepper"],
    reviews: [["Nneka P.", 5, "Silky sauce and the portion is generous.", "4 days ago"], ["Idris S.", 4, "Really creamy. I added chicken on the side.", "1 month ago"]] },
  { name: "Grilled Chicken", cat: "Mains", description: "Seasoned chicken cooked until tender.", price: 5000, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85",
    long: "Chicken marinated overnight in our own blend of spices and grilled until the skin is crisp and the meat is tender all the way through.",
    time: "25 min", cal: "610 kcal", serves: "1 person", ingredients: ["Chicken", "Garlic", "Ginger", "Paprika", "Thyme", "Lemon"],
    reviews: [["Emeka U.", 5, "Juicy inside and crispy outside. The seasoning is spot on.", "2 weeks ago"], ["Halima B.", 5, "Smells and tastes amazing. Worth every naira.", "5 weeks ago"]] },
];

/* ---------- dishes edited in the admin page (kept in this browser) ---------- */
const DEFAULT_FOODS = JSON.parse(JSON.stringify(foods));
(function applyAdminFoods() {
  try {
    const saved = JSON.parse(localStorage.getItem("savoraAdminFoods") || "null");
    if (Array.isArray(saved) && saved.length) foods.splice(0, foods.length, ...saved);
  } catch {}
})();
const isLive = (i) => !!foods[i] && !foods[i].hidden;
const liveFoods = () => foods.map((f, i) => ({ f, i })).filter(({ f }) => !f.hidden);

/* ---------- admin data: orders, reservations, subscribers ---------- */
function readList(key) {
  try { const d = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(d) ? d : []; } catch { return []; }
}
function pushRecord(key, rec) {
  const list = readList(key);
  list.push(rec);
  try { localStorage.setItem(key, JSON.stringify(list)); } catch {}
}
function recordOrder(items) {
  if (!items.length) return;
  const u = getUser();
  const orders = readList("savoraOrders");
  const next = orders.reduce((m, o) => Math.max(m, +String(o.id).replace(/\D/g, "") || 0), 1000) + 1;
  pushRecord("savoraOrders", {
    id: "SV-" + next, ts: Date.now(), status: "New",
    customer: u ? { name: u.name, email: u.email } : null,
    items: items.map((i) => ({ id: i.id, name: foods[i.id].name, price: foods[i.id].price, qty: i.qty })),
    total: items.reduce((n, i) => n + foods[i.id].price * i.qty, 0),
  });
}

/* ---------- helpers ---------- */
const money = (n) => "₦" + n.toLocaleString("en-NG");
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- logo ---------- */
const LOGO_SVG = `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#e96820"/><path d="M9.5 25.5a10.5 10.5 0 0 1 21 0z" fill="#fff"/><circle cx="20" cy="13" r="1.9" fill="#fff"/><rect x="7" y="27" width="26" height="2.6" rx="1.3" fill="#f4b942"/><path d="M14.5 21a6.5 6.5 0 0 1 3.6-3.4" stroke="#e96820" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".45"/></svg>`;
const logoHTML = `<a class="logo" href="index.html" aria-label="Savora home">${LOGO_SVG}<b class="logo-text">Savora<i>.</i></b></a>`;

/* ---------- reviews (seed reviews + the ones people write, kept in this browser) ---------- */
function userReviews() {
  try { const d = JSON.parse(localStorage.getItem("savoraReviews") || "{}"); return d && typeof d === "object" ? d : {}; } catch { return {}; }
}
function reviewsFor(i) {
  const mine = (userReviews()[i] || []).slice().reverse().map((r) => ({ ...r, when: new Date(r.ts).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) }));
  const seeds = (foods[i].reviews || []).map(([name, rating, text, when]) => ({ name, rating, text, when }));
  return [...mine, ...seeds];
}
function ratingOf(i) {
  const r = reviewsFor(i);
  return { n: r.length, avg: r.length ? r.reduce((a, x) => a + x.rating, 0) / r.length : 0 };
}
const starsText = (v) => "★".repeat(Math.round(v)) + "☆".repeat(5 - Math.round(v));
function saveReview(i, review) {
  const d = userReviews();
  (d[i] = d[i] || []).push({ ...review, ts: Date.now() });
  try { localStorage.setItem("savoraReviews", JSON.stringify(d)); } catch {}
}

// any image that fails to load gets a safe fallback (once)
document.addEventListener(
  "error",
  (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && !img.dataset.failed) {
      img.dataset.failed = "1";
      img.src = FALLBACK_IMG;
    }
  },
  true
);

/* ---------- storage (cart + user) ---------- */
function getCart() {
  try {
    const data = JSON.parse(localStorage.getItem("savoraCart2") || "[]");
    return Array.isArray(data)
      ? data.filter((i) => isLive(i.id) && Number.isInteger(i.qty) && i.qty > 0)
      : [];
  } catch {
    return [];
  }
}
const saveCart = (c) => localStorage.setItem("savoraCart2", JSON.stringify(c));
const cartCount = () => getCart().reduce((n, i) => n + i.qty, 0);
const cartTotal = () => getCart().reduce((n, i) => n + i.qty * foods[i.id].price, 0);

function getUser() {
  try { return JSON.parse(localStorage.getItem("savoraUser") || "null"); } catch { return null; }
}
const isLoggedIn = () => !!getUser() && localStorage.getItem("savoraLoggedIn") === "true";

/* ---------- toast ---------- */
let toastTimer;
function showNotice(message) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
}

/* ---------- shared header / footer / cart drawer ---------- */
function renderLayout() {
  const page = document.body.dataset.page || "";
  const overHero = page === "home";
  const on = (k) => (page === k ? "active" : "");

  const currentUser = getUser();
  // Keep the profile out of the main link list; signed-in users get a compact
  // initial avatar beside the order button instead.
  const authLinks = isLoggedIn()
    ? ""
    : `<li><a class="btn btn-sm" href="login.html">LOG IN</a></li>`;
  const accountInitial = currentUser?.name?.trim()?.charAt(0)?.toUpperCase() || "?";
  const accountControl = isLoggedIn()
    ? `<a class="nav-user-avatar" href="profile.html" aria-label="Open ${esc(currentUser.name)}'s profile" title="${esc(currentUser.name)}">${esc(accountInitial)}</a>`
    : "";

  const header = $("#site-header");
  if (header) {
    header.className = "site-header" + (overHero ? " over-hero" : " scrolled");
    header.innerHTML = `
      <nav class="nav">
        ${logoHTML}
        <ul class="nav-links" id="nav-links">
          <li><a class="${on("home")}" href="index.html">HOME</a></li>
          <li><a class="${on("about")}" href="about.html">ABOUT US</a></li>
          <li><a class="${on("menu")}" href="menu.html">MENU</a></li>
          <li><a href="index.html#contact">CONTACT</a></li>
          ${authLinks}
        </ul>
        <div class="nav-actions">
          <a class="nav-search" href="menu.html#search" aria-label="Search for food"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></a>
          <button class="btn btn-sm cart-btn" id="open-cart" aria-label="Open my order">
            🛒 <span class="cart-label">MY ORDER</span> (<span id="cart-count">0</span>)
          </button>
          ${accountControl}
          <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">☰</button>
        </div>
      </nav>`;
  }

  const footer = $("#site-footer");
  if (footer) {
    footer.innerHTML = `
      <div class="newsletter">
        <div>
          <h3>Get fresh offers in your inbox</h3>
          <p>Join our list for new dishes and special deals.</p>
        </div>
        <form class="news-form" id="news-form">
          <input type="email" placeholder="Your email address" required aria-label="Email" />
          <button class="btn" type="submit">SUBSCRIBE</button>
        </form>
      </div>
      <div class="footer-grid">
        <div>
          ${logoHTML}
          <p style="margin-top:14px">Good food, good mood. Delicious meals prepared with care.</p>
          <div class="socials">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">in</a>
            <a href="#" aria-label="Twitter">X</a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <a href="index.html">Home</a>
          <a href="about.html">About Us</a>
          <a href="login.html#register">Registration</a>
          <a href="login.html">Login</a>
        </div>
        <div>
          <h4>Our Menu</h4>
          <a href="menu.html">Popular Dishes</a>
          <a href="menu.html">Rice Dishes</a>
          <a href="menu.html">Drinks &amp; Desserts</a>
        </div>
        <div>
          <h4>Contact Us</h4>
          <p>hello@savora.example</p>
          <p style="margin-top:8px">Open daily, 9am – 10pm</p>
        </div>
      </div>
      <div class="copyright">© 2026 Savora Restaurant. School project demonstration.</div>`;
  }

  // app-style bottom bar for phones (pages that have the navbar)
  if (header) {
    const ico = (d) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
    const inMenu = page === "menu" || page === "food";
    const acct = isLoggedIn() ? "profile.html" : "login.html";
    document.body.insertAdjacentHTML(
      "beforeend",
      `<nav class="bottom-nav" aria-label="Main">
         <a href="index.html" class="${on("home")}">${ico('<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h5v-6h4v6h5V10"/>')}<span>Home</span></a>
         <a href="menu.html" class="${inMenu ? "active" : ""}">${ico('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>')}<span>Menu</span></a>
         <a href="menu.html#search">${ico('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')}<span>Search</span></a>
         <button type="button" id="bn-order" aria-label="Open my order">${ico('<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>')}<span>Order</span><b class="bn-badge" hidden>0</b></button>
         <a href="${acct}" class="${page === "profile" ? "active" : ""}">${isLoggedIn() ? `<b class="bottom-account-avatar">${esc(accountInitial)}</b>` : ico('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>')}<span>Account</span></a>
       </nav>`
    );
  }

  // cart drawer + toast (every page)
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="overlay" id="overlay"></div>
     <aside class="drawer" id="drawer" aria-label="My order">
       <div class="drawer-head"><h3>My Order</h3><button class="close-btn" id="close-cart" aria-label="Close">✕</button></div>
       <div class="drawer-body" id="drawer-body"></div>
       <div class="drawer-foot">
         <div class="drawer-total"><span>Total</span><span id="drawer-total">₦0</span></div>
         <button class="btn" id="checkout-btn">PLACE ORDER →</button>
       </div>
     </aside>
     <div class="toast" id="toast" role="status"></div>`
  );

  bindLayout();
}

function bindLayout() {
  const header = $("#site-header");
  const links = $("#nav-links");
  const toggle = $("#nav-toggle");

  toggle?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "✕" : "☰";
  });
  links?.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      links.classList.remove("open");
      header.classList.remove("nav-open");
      toggle.textContent = "☰";
    }
  });

  if (document.body.dataset.page === "home") {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  $("#open-cart")?.addEventListener("click", openCart);
  $("#bn-order")?.addEventListener("click", openCart);
  $("#close-cart")?.addEventListener("click", closeCart);
  $("#overlay")?.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeCart());
  $("#checkout-btn")?.addEventListener("click", () => {
    if (!cartCount()) return showNotice("Your order is empty. Add a meal first!");
    if (!isLoggedIn()) {
      showNotice("Please log in to place your order.");
      return setTimeout(() => (location.href = "login.html"), 1200);
    }
    recordOrder(getCart());
    saveCart([]);
    updateCart();
    closeCart();
    showNotice("Thank you! Your order has been placed (demo).");
  });

  $("#news-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const em = e.target.querySelector("input[type=email]")?.value.trim().toLowerCase();
    if (em && !readList("savoraSubscribers").some((x) => x.email === em)) pushRecord("savoraSubscribers", { email: em, ts: Date.now() });
    e.target.reset();
    showNotice("Thanks for subscribing!");
  });

  updateCart();
}

/* ---------- cart ---------- */
function openCart() { $("#drawer").classList.add("open"); $("#overlay").classList.add("open"); }
function closeCart() { $("#drawer")?.classList.remove("open"); $("#overlay")?.classList.remove("open"); }

function addToCart(index, qty = 1) {
  const cart = getCart();
  const item = cart.find((i) => i.id === index);
  item ? (item.qty += qty) : cart.push({ id: index, qty });
  saveCart(cart);
  updateCart();
  showNotice(qty > 1 ? `${qty} plates of ${foods[index].name} added to your order!` : foods[index].name + " added to your order!");
}

function changeQty(index, delta) {
  let cart = getCart();
  const item = cart.find((i) => i.id === index);
  if (!item) return;
  item.qty += delta;
  cart = cart.filter((i) => i.qty > 0);
  saveCart(cart);
  updateCart();
}

function removeFromCart(index) {
  saveCart(getCart().filter((i) => i.id !== index));
  updateCart();
}

function orderRowsHTML(editable) {
  const cart = getCart();
  if (!cart.length) {
    return `<div class="empty"><p>Your order is empty. Visit the menu to add a meal.</p>
            <a class="btn btn-sm" href="menu.html">BROWSE MENU</a></div>`;
  }
  return cart
    .map((i) => {
      const f = foods[i.id];
      return `<div class="order-row">
        <img src="${f.image}" alt="${f.name}" />
        <div class="name">${f.name}
          <small>${money(f.price)} each</small>
          <span class="qty">
            <button onclick="changeQty(${i.id}, -1)" aria-label="Decrease">−</button>
            <b>${i.qty}</b>
            <button onclick="changeQty(${i.id}, 1)" aria-label="Increase">+</button>
          </span>
        </div>
        <div style="text-align:right"><strong>${money(f.price * i.qty)}</strong><br>
          <button class="link-btn" onclick="removeFromCart(${i.id})">Remove</button></div>
      </div>`;
    })
    .join("");
}

function updateCart() {
  const count = cartCount();
  document.querySelectorAll("#cart-count").forEach((el) => (el.textContent = count));
  document.querySelectorAll(".bn-badge").forEach((el) => { el.textContent = count > 9 ? "9+" : count; el.hidden = !count; });
  const body = $("#drawer-body");
  if (body) body.innerHTML = orderRowsHTML();
  const total = $("#drawer-total");
  if (total) total.textContent = money(cartTotal());

  // profile page extras
  const po = $("#profile-order");
  if (po) po.textContent = count;
  const items = $("#order-items");
  if (items) items.innerHTML = orderRowsHTML() + (count ? `<div class="order-total"><span>Total</span><span>${money(cartTotal())}</span></div>` : "");
}

/* ---------- menu ---------- */
function foodCardHTML(f, i) {
  const { avg, n } = ratingOf(i);
  return `
    <a class="food-card" href="food.html?id=${i}" aria-label="View ${esc(f.name)}">
      <div class="food-img">
        <img src="${f.image}" alt="${esc(f.name)}" loading="lazy" />
        <span class="tag">${f.cat.toUpperCase()}</span>
      </div>
      <div class="food-info">
        <div class="rate"><span class="stars">★</span><b>${avg.toFixed(1)}</b><small>(${n})</small></div>
        <h3>${f.name}</h3>
        <p>${f.description}</p>
        <div class="food-bottom">
          <span class="price">${money(f.price)}</span>
          <span class="view-btn">VIEW →</span>
        </div>
      </div>
    </a>`;
}

let activeCat = "All";
let searchTerm = "";

function renderMenu() {
  const menu = $("#food-menu");
  if (!menu) return;

  // home page: short preview, no filters
  const preview = +menu.dataset.preview;
  if (preview) {
    menu.innerHTML = liveFoods().slice(0, preview).map(({ f, i }) => foodCardHTML(f, i)).join("");
    return;
  }

  // menu page: sidebar categories + search
  const cats = ["All", ...new Set(liveFoods().map(({ f }) => f.cat))];
  const countFor = (c) => liveFoods().filter(({ f }) => c === "All" || f.cat === c).length;
  $("#menu-cats").innerHTML = cats
    .map(
      (c) => `<li><button type="button" class="cat-btn ${c === activeCat ? "active" : ""}" data-cat="${c}">
        <span>${c === "All" ? "All dishes" : c}</span><b>${countFor(c)}</b></button></li>`
    )
    .join("");

  const q = searchTerm.trim().toLowerCase();
  if (!cats.includes(activeCat)) activeCat = "All";
  const list = liveFoods()
    .filter(({ f }) => activeCat === "All" || f.cat === activeCat)
    .filter(({ f }) => !q || [f.name, f.description, f.cat].some((t) => t.toLowerCase().includes(q)));

  $("#menu-count").textContent = list.length
    ? `${list.length} ${list.length === 1 ? "dish" : "dishes"}${activeCat !== "All" ? " in " + activeCat : ""}${q ? ` matching “${searchTerm.trim()}”` : ""}`
    : "";

  menu.innerHTML = list.length
    ? list.map(({ f, i }) => foodCardHTML(f, i)).join("")
    : `<div class="menu-empty"><h3>No dishes found</h3>
         <p>Try a different word or pick another category.</p>
         <button class="btn btn-sm" type="button" id="menu-reset">SHOW ALL DISHES</button></div>`;
}

function initMenuPage() {
  if (document.body.dataset.page !== "menu") return;
  const focusSearch = () => {
    if (location.hash !== "#search") return;
    const el = $("#menu-search");
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    setTimeout(() => el.focus({ preventScroll: true }), 350);
  };
  focusSearch();
  window.addEventListener("hashchange", focusSearch);
  $("#menu-cats").addEventListener("click", (e) => {
    const b = e.target.closest(".cat-btn");
    if (!b) return;
    activeCat = b.dataset.cat;
    renderMenu();
  });
  const input = $("#menu-search");
  input.addEventListener("input", () => { searchTerm = input.value; renderMenu(); });
  $("#menu-search-form").addEventListener("submit", (e) => { e.preventDefault(); searchTerm = input.value; renderMenu(); });
  $("#food-menu").addEventListener("click", (e) => {
    if (!e.target.closest("#menu-reset")) return;
    activeCat = "All"; searchTerm = ""; input.value = "";
    renderMenu();
  });
}

/* ---------- login / register slider ---------- */
function initAuthTabs() {
  const track = $("#auth-track");
  if (!track) return;
  const tabs = document.querySelectorAll(".auth-tabs [data-mode]");
  const pill = $(".auth-pill");
  const text = $("#visual-text");
  const copy = {
    login: ["Your table is <em>waiting</em>", "Log in to see your profile and manage your order."],
    register: ["Great food starts with <em>one click</em>", "Create a free account to start ordering your favourite meals."],
  };
  let mode = null;

  function setMode(next, animate = true) {
    if (next === mode) return;
    const first = mode === null;
    mode = next;
    const reg = next === "register";
    track.classList.toggle("is-register", reg);
    pill.classList.toggle("is-register", reg);
    tabs.forEach((t) => t.setAttribute("aria-selected", t.dataset.mode === next));
    // only the visible form can be tabbed into
    $("#panel-login").inert = reg;
    $("#panel-register").inert = !reg;
    $("#panel-login").setAttribute("aria-hidden", reg);
    $("#panel-register").setAttribute("aria-hidden", !reg);
    document.title = (reg ? "Register" : "Log In") + " – Savora Restaurant";
    if (!first) history.replaceState(null, "", "#" + next);

    const apply = () => { text.innerHTML = `<h2>${copy[next][0]}</h2><p>${copy[next][1]}</p>`; };
    if (first || !animate) return apply();
    text.classList.add("out");
    setTimeout(() => { apply(); text.classList.remove("out"); }, 220);
  }

  tabs.forEach((t) => t.addEventListener("click", () => setMode(t.dataset.mode)));
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-switch]");
    if (!a) return;
    e.preventDefault();
    setMode(a.dataset.switch);
  });
  window.addEventListener("hashchange", () => setMode(location.hash === "#register" ? "register" : "login"));
  // arrow keys move between the two tabs
  $(".auth-tabs").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const next = e.key === "ArrowRight" ? "register" : "login";
    setMode(next);
    $("#tab-" + next).focus();
  });
  setMode(location.hash === "#register" ? "register" : "login", false);
}

/* ---------- food detail page ---------- */
function initFoodPage() {
  const root = $("#food-detail");
  if (!root) return;
  const id = Number(new URLSearchParams(location.search).get("id"));
  if (!Number.isInteger(id) || !isLive(id)) {
    root.innerHTML = `<div class="menu-empty"><h3>We couldn't find that dish</h3><p>It may have been removed from the menu.</p><a class="btn btn-sm" href="menu.html">BACK TO MENU</a></div>`;
    return;
  }
  const f = foods[id];
  document.title = f.name + " – Savora Restaurant";
  let plates = 1;

  const related = foods.map((x, i) => i).filter((i) => i !== id && isLive(i)).sort((a, b) => (foods[b].cat === f.cat) - (foods[a].cat === f.cat)).slice(0, 3);

  root.innerHTML = `
    <a class="fd-back" href="menu.html">← Back to menu</a>
    <div class="fd-grid">
      <div class="fd-media"><img src="${f.image}" alt="${esc(f.name)}" /><span class="tag">${f.cat.toUpperCase()}</span></div>
      <div class="fd-body">
        <div class="fd-rate" id="fd-rate"></div>
        <h1>${f.name}</h1>
        <p class="fd-desc">${f.long}</p>

        <ul class="fd-meta">
          <li><b>${f.time}</b><small>Prep time</small></li>
          <li><b>${f.cal}</b><small>Per plate</small></li>
          <li><b>${f.serves}</b><small>Serves</small></li>
        </ul>

        <div class="fd-buybox">
          <div class="fd-price"><strong>${money(f.price)}</strong><small>per plate</small></div>
          <div class="fd-plates">
            <span class="fd-label" id="plates-label">How many plates?</span>
            <div class="qty-lg" role="group" aria-labelledby="plates-label">
              <button type="button" id="plates-minus" aria-label="One plate less">−</button>
              <b id="plates" aria-live="polite">1</b>
              <button type="button" id="plates-plus" aria-label="One plate more">+</button>
            </div>
            <div class="fd-total">Total <strong id="fd-total">${money(f.price)}</strong></div>
          </div>
          <div class="fd-actions">
            <button class="btn btn-outline" id="fd-add" type="button">ADD TO ORDER</button>
            <button class="btn" id="fd-buy" type="button">BUY NOW</button>
          </div>
        </div>

        <h2 class="fd-sub">What's in it</h2>
        <ul class="fd-ing">${f.ingredients.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>
    </div>

    <section class="rv" id="reviews" aria-labelledby="rv-title">
      <h2 id="rv-title">Reviews</h2>
      <div class="rv-grid">
        <div class="rv-summary" id="rv-summary"></div>
        <div>
          <form class="rv-form" id="rv-form" novalidate>
            <h3>Write a review</h3>
            <div class="rv-pick" role="radiogroup" aria-label="Your rating" id="rv-stars">
              ${[1, 2, 3, 4, 5].map((n) => `<button type="button" role="radio" aria-checked="false" aria-label="${n} star${n > 1 ? "s" : ""}" data-n="${n}">★</button>`).join("")}
              <span id="rv-hint">Tap to rate</span>
            </div>
            <div class="field"><label for="rv-name">Your name</label><input id="rv-name" type="text" maxlength="40" placeholder="Enter your name" value="${esc(getUser()?.name || "")}" required /></div>
            <div class="field"><label for="rv-text">Your review</label><textarea id="rv-text" rows="3" maxlength="400" placeholder="What did you think of this dish?" required></textarea></div>
            <button class="btn btn-sm" type="submit">POST REVIEW</button>
          </form>
          <div class="rv-list" id="rv-list"></div>
        </div>
      </div>
    </section>

    <section class="fd-more">
      <h2>You may also like</h2>
      <div class="menu-grid">${related.map((i) => foodCardHTML(foods[i], i)).join("")}</div>
    </section>`;

  /* plates */
  const setPlates = (n) => {
    plates = Math.min(20, Math.max(1, n));
    $("#plates").textContent = plates;
    $("#fd-total").textContent = money(f.price * plates);
    $("#plates-minus").disabled = plates === 1;
    $("#plates-plus").disabled = plates === 20;
  };
  setPlates(1);
  $("#plates-minus").addEventListener("click", () => setPlates(plates - 1));
  $("#plates-plus").addEventListener("click", () => setPlates(plates + 1));

  /* add / buy */
  $("#fd-add").addEventListener("click", () => addToCart(id, plates));
  $("#fd-buy").addEventListener("click", () => {
    if (!isLoggedIn()) {
      showNotice("Please log in to place your order.");
      return setTimeout(() => (location.href = "login.html"), 1200);
    }
    recordOrder([{ id, qty: plates }]);
    showNotice(`Thank you! ${plates} × ${f.name} ordered (demo).`);
  });

  /* reviews */
  function renderReviews() {
    const list = reviewsFor(id);
    const { avg, n } = ratingOf(id);
    $("#fd-rate").innerHTML = `<span class="stars">${starsText(avg)}</span><b>${avg.toFixed(1)}</b><a href="#reviews">${n} review${n === 1 ? "" : "s"}</a>`;
    const bars = [5, 4, 3, 2, 1].map((s) => {
      const c = list.filter((r) => r.rating === s).length;
      return `<div class="bar"><span>${s}★</span><i><u style="width:${n ? (c / n) * 100 : 0}%"></u></i><em>${c}</em></div>`;
    }).join("");
    $("#rv-summary").innerHTML = `<div class="big">${avg.toFixed(1)}</div><div class="stars">${starsText(avg)}</div><small>${n} review${n === 1 ? "" : "s"}</small>${bars}`;
    $("#rv-list").innerHTML = list
      .map((r) => `<article class="review-item"><div class="avatar">${esc(r.name.charAt(0).toUpperCase())}</div>
          <div><div class="top"><strong>${esc(r.name)}</strong><small>${esc(r.when)}</small></div>
          <div class="stars">${starsText(r.rating)}</div><p>${esc(r.text)}</p></div></article>`)
      .join("");
  }
  renderReviews();

  let rating = 0;
  const hints = ["Tap to rate", "Poor", "Fair", "Good", "Very good", "Excellent"];
  const paint = (v) => {
    document.querySelectorAll("#rv-stars button").forEach((b) => {
      b.classList.toggle("on", +b.dataset.n <= v);
      b.setAttribute("aria-checked", +b.dataset.n === rating);
    });
    $("#rv-hint").textContent = hints[v];
  };
  $("#rv-stars").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) { rating = +b.dataset.n; paint(rating); }
  });
  $("#rv-stars").addEventListener("mouseover", (e) => { const b = e.target.closest("button"); if (b) paint(+b.dataset.n); });
  $("#rv-stars").addEventListener("mouseleave", () => paint(rating));

  $("#rv-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#rv-name").value.trim();
    const text = $("#rv-text").value.trim();
    if (!rating) return showNotice("Please tap a star rating first.");
    if (!name) return showNotice("Please enter your name.");
    if (text.length < 3) return showNotice("Please write a short review.");
    saveReview(id, { name, rating, text });
    renderReviews();
    e.target.reset();
    $("#rv-name").value = getUser()?.name || name;
    rating = 0; paint(0);
    showNotice("Thanks! Your review has been posted.");
  });
}

/* ---------- hero carousel (home page) ---------- */
function initHeroCarousel() {
  const stage = $("#coverflow");
  if (!stage) return;
  const order = [0, 1, 4, 3, 2, 5, 6, 7, ...foods.map((x, i) => i)];
  const picks = [...new Set(order)].filter(isLive).slice(0, 6).map((i) => ({ ...foods[i], i }));
  if (picks.length < 3) return;
  const n = picks.length;
  const DELAY = 3600;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cur = 0, timer = null;

  // blurred colour glow behind the stage, one layer per dish (cross-fades)
  const glow = picks.map((f) => `<img src="${f.image}" alt="" />`).join("");
  stage.innerHTML =
    `<div class="cf-glow" aria-hidden="true">${glow}</div>` +
    picks
      .map(
        (f, k) => `
      <div class="cf-card" data-k="${k}" role="group" aria-label="${f.name}">
        <div class="cf-inner">
          <img src="${f.image}" alt="${f.name}" draggable="false" />
          <span class="cf-shine" aria-hidden="true"></span>
          <div class="cf-cap">
            <div class="cf-meta"><small>${f.cat}</small><strong>${f.name}</strong></div>
            <div class="cf-buy"><span>${money(f.price)}</span><a class="add-btn" href="food.html?id=${f.i}" aria-label="View ${f.name}">VIEW →</a></div>
          </div>
        </div>
      </div>`
      )
      .join("");
  const cards = [...stage.querySelectorAll(".cf-card")];
  const glows = [...stage.querySelectorAll(".cf-glow img")];
  const dots = $("#cf-dots");
  dots.innerHTML = picks.map((f, k) => `<button type="button" data-k="${k}" aria-label="Show ${f.name}"><i></i></button>`).join("");
  const dotEls = [...dots.children];

  function render() {
    const half = Math.floor(n / 2);
    cards.forEach((c, k) => {
      const off = ((k - cur + n + half) % n) - half;
      c.dataset.pos = Math.abs(off) <= 1 ? off : "hide";
      c.querySelectorAll("a").forEach((b) => (b.tabIndex = off === 0 ? 0 : -1));
    });
    glows.forEach((g, k) => g.classList.toggle("on", k === cur));
    dotEls.forEach((d, k) => {
      d.classList.toggle("active", k === cur);
      d.classList.remove("run");
    });
    void dots.offsetWidth; // restart the timer fill
    if (!reduce && timer) dotEls[cur].classList.add("run");
  }
  const go = (k) => { cur = (k + n) % n; render(); };
  const stop = () => { clearInterval(timer); timer = null; dotEls.forEach((d) => d.classList.remove("run")); };
  const start = () => {
    if (reduce) return;
    stop();
    timer = setInterval(() => go(cur + 1), DELAY);
    dotEls[cur].classList.remove("run"); void dots.offsetWidth; dotEls[cur].classList.add("run");
  };
  dots.style.setProperty("--delay", DELAY + "ms");

  stage.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    const c = e.target.closest(".cf-card");
    if (c && c.dataset.pos !== "0") { go(+c.dataset.k); start(); }
  });
  dots.addEventListener("click", (e) => {
    const d = e.target.closest("button");
    if (d) { go(+d.dataset.k); start(); }
  });

  // swipe
  let x0 = null;
  stage.addEventListener("pointerdown", (e) => { if (!e.target.closest("button, a")) x0 = e.clientX; });
  stage.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); start(); }
  });

  // gentle 3D tilt that follows the mouse
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    stage.addEventListener("mousemove", (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.setProperty("--ry", (x * 14).toFixed(2) + "deg");
      stage.style.setProperty("--rx", (-y * 10).toFixed(2) + "deg");
    });
    stage.addEventListener("mouseleave", () => {
      stage.style.setProperty("--ry", "0deg");
      stage.style.setProperty("--rx", "0deg");
    });
  }

  const box = $(".hero-visual");
  box.addEventListener("mouseenter", stop);
  box.addEventListener("mouseleave", start);
  box.addEventListener("focusin", stop);
  box.addEventListener("focusout", start);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  render();
  start();
}

/* ---------- auth ---------- */
function registerUser(event) {
  event.preventDefault();
  const user = {
    name: $("#reg-name").value.trim(),
    email: $("#reg-email").value.trim().toLowerCase(),
    password: $("#reg-password").value,
  };
  if (localStorage.getItem("savoraUser")) {
    showNotice("An account already exists in this browser. Please log in.");
    return setTimeout(() => (location.href = "login.html"), 1400);
  }
  localStorage.setItem("savoraUser", JSON.stringify(user));
  localStorage.setItem("savoraLoggedIn", "true");
  showNotice("Your account has been created!");
  setTimeout(() => (location.href = "profile.html"), 900);
}

function loginUser(event) {
  event.preventDefault();
  const saved = getUser();
  const email = $("#login-email").value.trim().toLowerCase();
  const password = $("#login-password").value;
  if (!saved || saved.email !== email || saved.password !== password) {
    return showNotice("Details not correct. Please register or check your login details.");
  }
  localStorage.setItem("savoraLoggedIn", "true");
  showNotice("Welcome back!");
  setTimeout(() => (location.href = "profile.html"), 800);
}

function logoutUser() {
  localStorage.removeItem("savoraLoggedIn");
  location.href = "index.html";
}

function editProfile() {
  const user = getUser();
  if (!user) return;
  const newName = prompt("Enter your new name:", user.name);
  if (newName && newName.trim()) {
    user.name = newName.trim();
    localStorage.setItem("savoraUser", JSON.stringify(user));
    renderProfile();
    showNotice("Your name has been updated.");
  }
}

function renderProfile() {
  const user = getUser();
  $("#profile-name").textContent = user.name;
  $("#profile-email").textContent = user.email;
  $("#profile-avatar").textContent = user.name.charAt(0).toUpperCase();
}

function togglePw(btn) {
  const input = btn.previousElementSibling;
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  btn.textContent = show ? "HIDE" : "SHOW";
}

/* ---------- page extras ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) return els.forEach((e) => e.classList.add("in"));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
    { threshold: 0.15 }
  );
  els.forEach((e) => io.observe(e));
}

function initCounters() {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count, suffix = el.dataset.suffix || "";
      const start = performance.now(), dur = 1600;
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach((e) => io.observe(e));
}

function reserveTable(event) {
  event.preventDefault();
  const u = getUser();
  pushRecord("savoraReservations", {
    id: "RS-" + (1001 + readList("savoraReservations").length), ts: Date.now(), status: "Pending",
    name: $("#r-name").value.trim(), date: $("#r-date").value, guests: $("#r-guests").value,
    email: u ? u.email : "",
  });
  event.target.reset();
  showNotice("Thank you! We'll confirm your table shortly.");
}

/* ---------- start ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "admin") return; // the admin page runs its own script (admin.js)

  // page guards
  if (page === "profile" && !isLoggedIn()) { location.replace("login.html"); return; }
  if ((page === "login" || page === "register") && isLoggedIn()) { location.replace("profile.html"); return; }

  renderLayout();
  renderMenu();
  initMenuPage();
  initFoodPage();
  initHeroCarousel();
  initAuthTabs();
  if (page === "profile") renderProfile();
  initReveal();
  initCounters();
});

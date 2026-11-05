/* ==========================================================
   SAVORA – admin page logic
   Uses helpers from script.js: foods, DEFAULT_FOODS, money, $, esc, readList, getUser
   Data lives in this browser's localStorage.
   ========================================================== */
(() => {
  "use strict";
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const K = { hash: "savoraAdminHash", orders: "savoraOrders", res: "savoraReservations", subs: "savoraSubscribers", reviews: "savoraReviews", foods: "savoraAdminFoods" };
  const SESSION = "savoraAdminAuth";

  const write = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { toast("Browser storage is full. Try a smaller photo."); return false; } };
  const toast = (m) => showNotice(m);
  const fmtDate = (ts) => new Date(ts).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
  const fmtTime = (ts) => new Date(ts).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
  const pill = (t) => `<span class="pill ${esc(String(t).toLowerCase())}">${esc(t)}</span>`;
  const empty = (title, text) => `<div class="ad-empty"><b>${title}</b>${text}</div>`;
  const orders = () => readList(K.orders);
  const transactions = () => readList("savoraTransactions");
  const reservations = () => readList(K.res);
  const reviewsObj = () => { try { const d = JSON.parse(localStorage.getItem(K.reviews) || "{}"); return d && typeof d === "object" ? d : {}; } catch { return {}; } };

  /* ---------- passcode (stored as a hash, never as plain text) ---------- */
  async function hash(text) {
    const data = new TextEncoder().encode("savora-admin::" + text);
    if (window.crypto?.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", data);
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    let h = 5381; for (const b of data) h = ((h << 5) + h + b) >>> 0; // fallback for very old browsers
    return "x" + h.toString(16);
  }

  const gate = $("#gate"), app = $("#app");
  let setupMode = false;

  function showGate() {
    setupMode = !localStorage.getItem(K.hash);
    app.hidden = true; gate.hidden = false;
    $("#gate-title").textContent = setupMode ? "Create your admin passcode" : "Admin sign in";
    $("#gate-sub").textContent = setupMode ? "First time here. Choose a passcode (6+ characters) to protect this page." : "Enter your admin passcode to manage the restaurant.";
    $("#gate-label").textContent = setupMode ? "New passcode" : "Passcode";
    $("#gate-pass").autocomplete = setupMode ? "new-password" : "current-password";
    $("#gate-confirm-wrap").hidden = !setupMode;
    $("#gate-pass2").required = setupMode;
    $("#gate-btn").textContent = setupMode ? "CREATE & ENTER" : "SIGN IN";
    $("#gate-error").textContent = "";
    $("#gate-pass").value = $("#gate-pass2").value = "";
    $("#gate-pass").focus();
  }

  $("#gate-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const pass = $("#gate-pass").value, err = $("#gate-error");
    if (setupMode) {
      if (pass.length < 6) return (err.textContent = "Use at least 6 characters.");
      if (pass !== $("#gate-pass2").value) return (err.textContent = "The two passcodes don't match.");
      try { localStorage.setItem(K.hash, await hash(pass)); } catch { return (err.textContent = "Could not save in this browser."); }
    } else if ((await hash(pass)) !== localStorage.getItem(K.hash)) {
      $("#gate-pass").value = "";
      return (err.textContent = "Wrong passcode. Try again.");
    }
    try { sessionStorage.setItem(SESSION, "1"); } catch {}
    enter();
  });

  $("#logout").addEventListener("click", () => { try { sessionStorage.removeItem(SESSION); } catch {} showGate(); });

  /* ---------- tabs ---------- */
  const TABS = {
    overview: ["Overview", "How the restaurant is doing."],
    dishes: ["Dishes", "Edit what shows on the menu and the home page."],
    orders: ["Orders", "Orders placed on the website."],
    transactions: ["Transaction history", "Track order payments, amounts and the dishes included in each sale."],
    reservations: ["Reservations", "Table bookings from the home page."],
    customers: ["Customers", "Accounts and newsletter sign-ups."],
    reviews: ["Reviews", "What guests wrote about your dishes."],
    settings: ["Settings", "Passcode, backup and data tools."],
  };
  let tab = "overview";

  function go(name) {
    if (!TABS[name]) name = "overview";
    tab = name;
    $$("#nav button").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
    $$(".ad-tab").forEach((s) => (s.hidden = s.id !== "tab-" + name));
    $("#tab-title").textContent = TABS[name][0];
    $("#tab-sub").textContent = TABS[name][1];
    $("#tab-actions").innerHTML = name === "dishes" ? `<button class="btn btn-sm" id="add-dish">＋ ADD DISH</button>` : "";
    $("#add-dish")?.addEventListener("click", () => openDish(-1));
    if (location.hash !== "#" + name) history.replaceState(null, "", "#" + name);
    render();
    window.scrollTo({ top: 0 });
  }
  $("#nav").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) go(b.dataset.tab); });

  function enter() {
    gate.hidden = true; app.hidden = false;
    go(location.hash.slice(1) || "overview");
  }

  /* ---------- rendering ---------- */
  function render() {
    badges();
    ({ overview, dishes: renderDishes, orders: renderOrders, transactions: renderTransactions, reservations: renderRes, customers: renderCustomers, reviews: renderReviews, settings: () => {} })[tab]();
  }

  function badges() {
    const n = orders().filter((o) => o.status === "New").length, r = reservations().filter((x) => x.status === "Pending").length;
    const set = (id, v) => { const el = $(id); el.textContent = v; el.hidden = !v; };
    set("#badge-orders", n); set("#badge-res", r);
    const pendingTx = transactions().filter((t) => t.paymentStatus === "Pending").length; set("#badge-tx", pendingTx);
  }

  function overview() {
    const os = orders(), live = os.filter((o) => o.status !== "Cancelled");
    const revenue = live.reduce((n, o) => n + o.total, 0);
    const rs = reservations();
    const liveDishes = foods.filter((f) => !f.hidden).length;
    const tile = (label, value, sub, color) => `<div class="kpi" style="--k:${color}"><small>${label}</small><strong>${value}</strong><span>${sub}</span></div>`;
    $("#kpis").innerHTML =
      tile("Revenue", money(revenue), `from ${live.length} order${live.length === 1 ? "" : "s"}`, "#e96820") +
      tile("Orders", os.length, `${os.filter((o) => o.status === "New").length} new`, "#f4b942") +
      tile("Reservations", rs.length, `${rs.filter((r) => r.status === "Pending").length} waiting for you`, "#183b12") +
      tile("Dishes on menu", liveDishes, `${foods.length - liveDishes} hidden`, "#c9540f");

    const tally = {};
    live.forEach((o) => o.items.forEach((i) => (tally[i.name] = (tally[i.name] || 0) + i.qty)));
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const max = top[0]?.[1] || 1;
    $("#top-dishes").innerHTML = top.length
      ? top.map(([n, q]) => `<div class="bar-row"><b>${esc(n)}</b><span>${q} sold</span><i><u style="width:${(q / max) * 100}%"></u></i></div>`).join("")
      : empty("No sales yet", "Orders will show up here.");

    const today = new Date().toISOString().slice(0, 10);
    const up = rs.filter((r) => r.status !== "Cancelled" && r.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
    $("#up-res").innerHTML = up.length
      ? up.map((r) => { const d = new Date(r.date + "T12:00:00"); return `<div class="res-item"><div class="res-date"><b>${d.getDate()}</b><small>${d.toLocaleString("en", { month: "short" }).toUpperCase()}</small></div><div><b>${esc(r.name)}</b><small>${esc(r.guests)}</small></div><div style="margin-left:auto">${pill(r.status)}</div></div>`; }).join("")
      : empty("Nothing booked", "New table bookings will appear here.");

    $("#recent-orders").innerHTML = orderTable(os.slice().reverse().slice(0, 5), false);
  }

  /* orders */
  function orderTable(list, actions) {
    if (!list.length) return empty("No orders yet", "When a guest places an order on the website, it appears here.");
    return `<table class="ad-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th class="num">Total</th><th>Status</th>${actions ? "<th></th>" : ""}</tr></thead><tbody>${list.map((o) => `
      <tr><td><b>${esc(o.id)}</b><small>${fmtDate(o.ts)} · ${fmtTime(o.ts)}</small></td>
      <td>${o.customer ? `${esc(o.customer.name)}<small>${esc(o.customer.email)}</small>` : "Guest"}</td>
      <td>${o.items.map((i) => `${i.qty} × ${esc(i.name)}`).join("<br>")}</td>
      <td class="num">${money(o.total)}</td>
      <td>${actions ? `<select data-order="${esc(o.id)}" aria-label="Status of ${esc(o.id)}">${["New", "Preparing", "Delivered", "Cancelled"].map((s) => `<option${s === o.status ? " selected" : ""}>${s}</option>`).join("")}</select>` : pill(o.status)}</td>
      ${actions ? `<td><div class="row-actions"><button class="mini del" data-del-order="${esc(o.id)}">Delete</button></div></td>` : ""}</tr>`).join("")}</tbody></table>`;
  }
  function renderOrders() {
    const f = $("#order-filter").value;
    $("#order-table").innerHTML = orderTable(orders().filter((o) => !f || o.status === f).reverse(), true);
  }
  $("#order-filter").addEventListener("change", renderOrders);
  $("#order-table").addEventListener("change", (e) => {
    const s = e.target.closest("select[data-order]"); if (!s) return;
    const all = orders(), o = all.find((x) => x.id === s.dataset.order);
    if (o) { o.status = s.value; write(K.orders, all); badges(); toast(`${o.id} marked ${o.status}.`); }
  });
  $("#order-table").addEventListener("click", (e) => {
    const b = e.target.closest("[data-del-order]"); if (!b || !confirm("Delete this order for good?")) return;
    write(K.orders, orders().filter((o) => o.id !== b.dataset.delOrder)); render(); toast("Order deleted.");
  });

  /* transactions: a local ledger linked to each order (not a payment gateway) */
  function syncTransactions() {
    const list = transactions();
    const known = new Set(list.map((t) => t.orderId));
    let changed = false;
    orders().forEach((o) => {
      if (known.has(o.id)) return;
      list.push({
        id: "TX-" + String(o.id).replace(/[^0-9]/g, ""), orderId: o.id,
        ts: o.ts || Date.now(), customer: o.customer || null,
        items: (o.items || []).map((i) => ({ ...i })), total: Number(o.total) || 0,
        paymentStatus: "Pending", method: "Not recorded"
      });
      changed = true;
    });
    if (changed) write("savoraTransactions", list);
    return list;
  }
  function renderTransactions() {
    const all = syncTransactions();
    const paid = all.filter((t) => t.paymentStatus === "Paid");
    const pending = all.filter((t) => t.paymentStatus === "Pending");
    const refunded = all.filter((t) => t.paymentStatus === "Refunded");
    const tile = (label, value, note, cls) => `<div class="tx-kpi ${cls}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`;
    $("#tx-summary").innerHTML =
      tile("Recorded sales", money(paid.reduce((n, t) => n + t.total, 0)), `${paid.length} marked paid`, "sales") +
      tile("Awaiting payment", money(pending.reduce((n, t) => n + t.total, 0)), `${pending.length} pending`, "pending") +
      tile("Refunded", money(refunded.reduce((n, t) => n + t.total, 0)), `${refunded.length} refunded`, "refund");
    const f = $("#tx-filter").value, q = $("#tx-search").value.trim().toLowerCase();
    const list = all.filter((t) => (!f || t.paymentStatus === f) && (!q || [t.id, t.orderId, t.customer?.name, t.customer?.email, ...(t.items || []).map((i) => i.name)].join(" ").toLowerCase().includes(q)))
      .sort((a, b) => b.ts - a.ts);
    $("#tx-table").innerHTML = list.length ? `<table class="ad-table tx-table"><thead><tr><th>Transaction</th><th>Customer</th><th>Dishes ordered</th><th class="num">Amount</th><th>Payment</th><th>Method</th></tr></thead><tbody>${list.map((t) => {
      const dishLines = (t.items || []).map((i) => {
        const found = foods.find((f) => f.name === i.name);
        const img = found?.image || "";
        return `<div class="tx-dish-line">${img ? `<img src="${esc(img)}" alt="" loading="lazy" />` : `<span class="tx-dish-fallback">🍽</span>`}<span><b>${esc(i.name)}</b><small>${Number(i.qty) || 1} × ${money(Number(i.price) || 0)}</small></span></div>`;
      }).join("");
      return `<tr><td><b class="tx-id">${esc(t.id)}</b><small>Order ${esc(t.orderId)}</small><small>${fmtDate(t.ts)} · ${fmtTime(t.ts)}</small></td>
        <td><b>${esc(t.customer?.name || "Guest")}</b><small>${esc(t.customer?.email || "Guest checkout")}</small></td>
        <td><div class="tx-dishes">${dishLines || "—"}</div></td>
        <td class="num tx-amount">${money(Number(t.total) || 0)}</td>
        <td><select data-tx-status="${esc(t.id)}" aria-label="Payment status for ${esc(t.id)}">${["Pending", "Paid", "Refunded"].map((v) => `<option${v === t.paymentStatus ? " selected" : ""}>${v}</option>`).join("")}</select></td>
        <td><select data-tx-method="${esc(t.id)}" aria-label="Payment method for ${esc(t.id)}">${["Not recorded", "Cash", "Bank transfer", "Card", "Other"].map((v) => `<option${v === (t.method || "Not recorded") ? " selected" : ""}>${v}</option>`).join("")}</select></td></tr>`;
    }).join("")}</tbody></table>` : empty("No transactions found", "New website orders will automatically appear here. You can update their payment status and method.");
  }
  $("#tx-filter").addEventListener("change", renderTransactions);
  $("#tx-search").addEventListener("input", renderTransactions);
  $("#tx-table").addEventListener("change", (e) => {
    const status = e.target.closest("[data-tx-status]"), method = e.target.closest("[data-tx-method]");
    if (!status && !method) return;
    const id = (status || method).dataset.txStatus || (status || method).dataset.txMethod;
    const all = transactions(), t = all.find((x) => x.id === id); if (!t) return;
    if (status) t.paymentStatus = status.value;
    if (method) t.method = method.value;
    write("savoraTransactions", all); badges(); renderTransactions();
    toast(`${t.id} updated.`);
  });

  /* reservations */
  function renderRes() {
    const f = $("#res-filter").value;
    const list = reservations().filter((r) => !f || r.status === f).sort((a, b) => b.date.localeCompare(a.date) || b.ts - a.ts);
    $("#res-table").innerHTML = list.length
      ? `<table class="ad-table"><thead><tr><th>Booking</th><th>Guest</th><th>Date</th><th>Guests</th><th>Status</th><th></th></tr></thead><tbody>${list.map((r) => `
        <tr><td><b>${esc(r.id)}</b><small>booked ${fmtDate(r.ts)}</small></td><td>${esc(r.name)}${r.email ? `<small>${esc(r.email)}</small>` : ""}</td>
        <td>${r.date ? fmtDate(r.date + "T12:00:00") : "—"}</td><td>${esc(r.guests)}</td><td>${pill(r.status)}</td>
        <td><div class="row-actions">
          ${r.status !== "Confirmed" ? `<button class="mini ok" data-res="${esc(r.id)}" data-set="Confirmed">Confirm</button>` : ""}
          ${r.status !== "Cancelled" ? `<button class="mini" data-res="${esc(r.id)}" data-set="Cancelled">Cancel</button>` : ""}
          <button class="mini del" data-res="${esc(r.id)}" data-set="delete">Delete</button></div></td></tr>`).join("")}</tbody></table>`
      : empty("No reservations", "Table bookings made on the home page appear here.");
  }
  $("#res-filter").addEventListener("change", renderRes);
  $("#res-table").addEventListener("click", (e) => {
    const b = e.target.closest("[data-res]"); if (!b) return;
    let all = reservations();
    if (b.dataset.set === "delete") { if (!confirm("Delete this reservation?")) return; all = all.filter((r) => r.id !== b.dataset.res); }
    else { const r = all.find((x) => x.id === b.dataset.res); if (r) r.status = b.dataset.set; }
    write(K.res, all); render();
  });

  /* customers */
  function renderCustomers() {
    const u = getUser();
    $("#cust-table").innerHTML = u
      ? `<div class="res-item"><div class="res-date" style="width:46px"><b>${esc(u.name.charAt(0).toUpperCase())}</b></div><div><b>${esc(u.name)}</b><small>${esc(u.email)}</small></div><div style="margin-left:auto">${localStorage.getItem("savoraLoggedIn") === "true" ? '<span class="pill live">Signed in</span>' : '<span class="pill hidden">Signed out</span>'}</div></div>`
      : empty("No account yet", "Accounts created on the website appear here.");
    const subs = readList(K.subs);
    $("#sub-table").innerHTML = subs.length
      ? `<table class="ad-table"><thead><tr><th>Email</th><th>Joined</th><th></th></tr></thead><tbody>${subs.slice().reverse().map((s) => `<tr><td>${esc(s.email)}</td><td>${fmtDate(s.ts)}</td><td><div class="row-actions"><button class="mini del" data-sub="${esc(s.email)}">Remove</button></div></td></tr>`).join("")}</tbody></table>`
      : empty("No subscribers", "Emails from the “Get fresh offers” box show up here.");
  }
  $("#sub-table").addEventListener("click", (e) => {
    const b = e.target.closest("[data-sub]"); if (!b) return;
    write(K.subs, readList(K.subs).filter((s) => s.email !== b.dataset.sub)); renderCustomers();
  });

  /* reviews written by guests (the built-in sample reviews are part of the dish data) */
  function renderReviews() {
    const rows = [];
    Object.entries(reviewsObj()).forEach(([i, list]) => (list || []).forEach((r) => rows.push({ i: +i, ...r })));
    rows.sort((a, b) => b.ts - a.ts);
    $("#rev-table").innerHTML = rows.length
      ? `<table class="ad-table"><thead><tr><th>Dish</th><th>Guest</th><th>Rating</th><th>Review</th><th></th></tr></thead><tbody>${rows.map((r) => `
        <tr><td>${esc(foods[r.i]?.name || "Removed dish")}<small>${fmtDate(r.ts)}</small></td><td>${esc(r.name)}</td><td style="color:var(--gold);white-space:nowrap">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</td><td style="min-width:220px">${esc(r.text)}</td>
        <td><div class="row-actions"><button class="mini del" data-rev="${r.i}:${r.ts}">Delete</button></div></td></tr>`).join("")}</tbody></table>`
      : empty("No guest reviews yet", "Reviews written on dish pages appear here so you can remove any you don't want.");
  }
  $("#rev-table").addEventListener("click", (e) => {
    const b = e.target.closest("[data-rev]"); if (!b || !confirm("Delete this review?")) return;
    const [i, ts] = b.dataset.rev.split(":"), all = reviewsObj();
    all[i] = (all[i] || []).filter((r) => String(r.ts) !== ts);
    write(K.reviews, all); renderReviews(); toast("Review deleted.");
  });

  /* ---------- dishes ---------- */
  const saveFoods = () => write(K.foods, foods);

  function renderDishes() {
    $("#dish-table").innerHTML = `<table class="ad-table"><thead><tr><th>Dish</th><th>Category</th><th class="num">Price</th><th>Status</th><th></th></tr></thead><tbody>${foods.map((f, i) => `
      <tr><td><div class="ad-dish"><img src="${esc(f.image)}" alt="" /><div><b>${esc(f.name)}</b><small>${esc(f.description)}</small></div></div></td>
      <td>${esc(f.cat)}</td><td class="num">${money(f.price)}</td><td>${pill(f.hidden ? "Hidden" : "Live")}</td>
      <td><div class="row-actions"><button class="mini" data-edit="${i}">Edit</button><button class="mini ${f.hidden ? "ok" : "del"}" data-toggle="${i}">${f.hidden ? "Show" : "Hide"}</button></div></td></tr>`).join("")}</tbody></table>`;
  }
  $("#dish-table").addEventListener("click", (e) => {
    const ed = e.target.closest("[data-edit]"), tg = e.target.closest("[data-toggle]");
    if (ed) return openDish(+ed.dataset.edit);
    if (tg) {
      const f = foods[+tg.dataset.toggle];
      if (!f.hidden && foods.filter((x) => !x.hidden).length <= 3) return toast("Keep at least 3 dishes showing on the menu.");
      f.hidden = !f.hidden; saveFoods(); renderDishes(); toast(`${f.name} is now ${f.hidden ? "hidden from" : "showing on"} the menu.`);
    }
  });

  let editing = -1;
  const F = { name: $("#d-name"), cat: $("#d-cat"), price: $("#d-price"), time: $("#d-time"), cal: $("#d-cal"), serves: $("#d-serves"), desc: $("#d-desc"), long: $("#d-long"), ing: $("#d-ing"), img: $("#d-img") };

  function openDish(i) {
    editing = i;
    const f = i >= 0 ? foods[i] : { name: "", cat: "", price: "", time: "", cal: "", serves: "1 person", description: "", long: "", ingredients: [], image: "" };
    $("#dish-title").textContent = i >= 0 ? "Edit dish" : "Add dish";
    F.name.value = f.name; F.cat.value = f.cat; F.price.value = f.price; F.time.value = f.time || ""; F.cal.value = f.cal || ""; F.serves.value = f.serves || "";
    F.desc.value = f.description; F.long.value = f.long || ""; F.ing.value = (f.ingredients || []).join(", "); F.img.value = f.image;
    $("#d-prev").src = f.image || "";
    $("#cat-list").innerHTML = [...new Set(foods.map((x) => x.cat))].map((c) => `<option value="${esc(c)}">`).join("");
    $("#dish-error").textContent = "";
    $("#modal").hidden = false; F.name.focus();
  }
  const closeDish = () => ($("#modal").hidden = true);
  $("#dish-close").addEventListener("click", closeDish);
  $("#dish-cancel").addEventListener("click", closeDish);
  $("#modal").addEventListener("mousedown", (e) => { if (e.target.id === "modal") closeDish(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#modal").hidden) closeDish(); });
  F.img.addEventListener("input", () => ($("#d-prev").src = F.img.value.trim()));

  // photo upload: shrink it first so it fits in the browser's storage
  $("#d-file").addEventListener("change", (e) => {
    const file = e.target.files[0]; if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      const im = new Image();
      im.onload = () => {
        const w = Math.min(900, im.width), h = Math.round(im.height * (w / im.width));
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        c.getContext("2d").drawImage(im, 0, 0, w, h);
        F.img.value = c.toDataURL("image/jpeg", 0.82); $("#d-prev").src = F.img.value;
      };
      im.onerror = () => ($("#dish-error").textContent = "That file isn't a usable image.");
      im.src = rd.result;
    };
    rd.readAsDataURL(file); e.target.value = "";
  });

  $("#dish-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#dish-error"), price = Math.round(+F.price.value);
    const name = F.name.value.trim(), cat = F.cat.value.trim(), desc = F.desc.value.trim(), image = F.img.value.trim();
    if (!name || !cat || !desc) return (err.textContent = "Please fill in the name, category and short description.");
    if (!(price >= 0) || F.price.value === "") return (err.textContent = "Enter a valid price.");
    if (!image) return (err.textContent = "Add a photo link or upload a photo.");
    const base = editing >= 0 ? foods[editing] : { reviews: [] };
    const dish = {
      ...base, name, cat, price, image, description: desc,
      long: F.long.value.trim() || desc, time: F.time.value.trim() || "20 min", cal: F.cal.value.trim() || "—", serves: F.serves.value.trim() || "1 person",
      ingredients: F.ing.value.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (editing >= 0) foods[editing] = dish; else foods.push(dish);
    if (!saveFoods()) { if (editing < 0) foods.pop(); return; }
    closeDish(); renderDishes(); toast(editing >= 0 ? "Dish updated." : "Dish added to the menu.");
  });

  /* ---------- settings ---------- */
  $("#pass-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("#pw-error");
    if ((await hash($("#pw-old").value)) !== localStorage.getItem(K.hash)) return (err.textContent = "Current passcode is wrong.");
    const n = $("#pw-new").value; if (n.length < 6) return (err.textContent = "Use at least 6 characters.");
    localStorage.setItem(K.hash, await hash(n)); e.target.reset(); err.textContent = ""; toast("Passcode changed.");
  });

  $("#export").addEventListener("click", () => {
    const data = { exportedAt: new Date().toISOString(), dishes: foods, orders: orders(), transactions: syncTransactions(), reservations: reservations(), subscribers: readList(K.subs), reviews: reviewsObj() };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = "savora-backup-" + new Date().toISOString().slice(0, 10) + ".json"; a.click(); URL.revokeObjectURL(a.href);
  });

  $("#sample").addEventListener("click", () => {
    const now = Date.now(), day = 864e5, o = orders(), r = reservations();
    const mk = (n, ago, status, who, lines) => ({ id: "SV-" + n, ts: now - ago, status, customer: { name: who, email: who.split(" ")[0].toLowerCase() + "@example.com" },
      items: lines.map(([i, qty]) => ({ id: i, name: DEFAULT_FOODS[i].name, price: DEFAULT_FOODS[i].price, qty })), total: lines.reduce((s, [i, q]) => s + DEFAULT_FOODS[i].price * q, 0) });
    const start = o.reduce((m, x) => Math.max(m, +String(x.id).replace(/\D/g, "") || 0), 1000);
    [mk(start + 1, 5 * day, "Delivered", "Amaka Okafor", [[0, 2], [3, 1]]), mk(start + 2, 2 * day, "Delivered", "Tunde Bello", [[1, 2]]),
     mk(start + 3, day / 2, "Preparing", "Chioma Eze", [[4, 1], [2, 1]]), mk(start + 4, 3600e3, "New", "Seyi Adeyemi", [[5, 2], [7, 1]])].forEach((x) => o.push(x));
    const d = (n) => new Date(now + n * day).toISOString().slice(0, 10);
    [["Grace Ibrahim", 1, "2 people", "Pending"], ["Femi Raji", 3, "4 people", "Confirmed"], ["Zainab Musa", 6, "5+ people", "Pending"]]
      .forEach(([name, n, guests, status], k) => r.push({ id: "RS-" + (2001 + r.length + k), ts: now - k * day, status, name, date: d(n), guests, email: "" }));
    write(K.orders, o); write(K.res, r); render(); toast("Sample orders and bookings added.");
  });
  const wipe = (btn, key, msg) => $(btn).addEventListener("click", () => { if (confirm(msg)) { write(key, []); render(); toast("Done."); } });
  wipe("#clear-orders", K.orders, "Delete ALL orders? This can't be undone.");
  wipe("#clear-res", K.res, "Delete ALL reservations? This can't be undone.");
  $("#reset-menu").addEventListener("click", () => {
    if (!confirm("Put the menu back to the original dishes? Your edits and added dishes will be lost.")) return;
    try { localStorage.removeItem(K.foods); } catch {}
    foods.splice(0, foods.length, ...JSON.parse(JSON.stringify(DEFAULT_FOODS))); render(); toast("Menu reset to the original dishes.");
  });

  /* ---------- start ---------- */
  window.addEventListener("hashchange", () => { if (!app.hidden) go(location.hash.slice(1)); });
  let authed = false; try { authed = sessionStorage.getItem(SESSION) === "1" && !!localStorage.getItem(K.hash); } catch {}
  authed ? enter() : showGate();
})();

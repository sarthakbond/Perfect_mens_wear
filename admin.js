(() => {
  "use strict";

  const config = window.PERFECT_MENS_CONFIG || {};
  const login = document.querySelector("[data-admin-login]");
  const dashboard = document.querySelector("[data-admin-dashboard]");
  const adminTranslations = {
    "SECURE STORE ACCESS": "सुरक्षित दुकान प्रवेश", "Sign in.": "साइन इन करा.",
    "Sign in with an authorized Supabase account. Admin access is enforced by database row-level security.": "अधिकृत Supabase खात्याने साइन इन करा. अॅडमिन प्रवेश डेटाबेसच्या row-level security द्वारे संरक्षित आहे.",
    "Email": "ईमेल", "Password": "पासवर्ड", "Sign in": "साइन इन", "Return to the store": "दुकानाकडे परत जा",
    "STORE ADMINISTRATION": "दुकान व्यवस्थापन", "Manage your store.": "तुमचे दुकान व्यवस्थापित करा.",
    "Sign out": "साइन आउट", "Products": "उत्पादने", "Order enquiries": "ऑर्डर चौकशी",
    "Store information": "दुकानाची माहिती", "Homepage banner": "मुखपृष्ठ बॅनर",
    "Admin sections": "अॅडमिन विभाग", "Product": "उत्पादन",
    "Product catalogue": "उत्पादन कॅटलॉग", "Product name": "उत्पादनाचे नाव",
    "Product name (Marathi)": "उत्पादनाचे नाव (मराठी)", "Brand": "ब्रँड",
    "Category": "प्रकार", "Category (Marathi)": "प्रकार (मराठी)", "Price (INR)": "किंमत (INR)",
    "MRP (optional)": "कमाल किरकोळ किंमत (ऐच्छिक)", "Stock quantity": "साठ्यातील नग",
    "Sizes (comma-separated)": "आकार (स्वल्पविरामाने वेगळे करा)",
    "Colours (comma-separated)": "रंग (स्वल्पविरामाने वेगळे करा)", "Tag": "टॅग",
    "Tag (Marathi)": "टॅग (मराठी)", "Product gallery photos (up to 6)": "उत्पादन गॅलरी फोटो (६ पर्यंत)",
    "Visible in the store": "दुकानात दिसेल", "Mark as a bestseller": "लोकप्रिय उत्पादन म्हणून दर्शवा",
    "Mark as a new arrival": "नवीन आगमन म्हणून दर्शवा", "Save product": "उत्पादन जतन करा",
    "Clear form": "फॉर्म रिकामा करा", "Price": "किंमत", "Stock": "साठा",
    "Visible": "दृश्यमान", "Actions": "कृती", "Edit": "बदला", "Delete": "हटवा",
    "Yes": "होय", "No": "नाही", "No catalogue products have been added.": "कॅटलॉगमध्ये उत्पादने जोडलेली नाहीत.",
    "Enquiries submitted through WhatsApp are not copied to this dashboard. This list displays only enquiries securely submitted to the configured Supabase project.": "WhatsApp वरून पाठवलेल्या चौकशा या डॅशबोर्डमध्ये दिसत नाहीत. येथे फक्त Supabase प्रकल्पात सुरक्षितपणे जतन केलेल्या चौकशा दिसतात.",
    "Received": "प्राप्त", "Customer": "ग्राहक", "Contact": "संपर्क", "Enquiry": "चौकशी",
    "Status": "स्थिती", "Mark handled": "हाताळले असे चिन्हांकित करा", "No enquiries received.": "चौकशी प्राप्त झालेली नाही.",
    "Store phone": "दुकानाचा फोन", "Opening hours": "उघडण्याची वेळ", "Full store address": "दुकानाचा पूर्ण पत्ता",
    "Google Maps directions URL": "Google Maps मार्ग URL", "Google Maps embed URL (optional)": "Google Maps embed URL (ऐच्छिक)",
    "Instagram profile URL (optional)": "Instagram प्रोफाइल URL (ऐच्छिक)", "Save store information": "दुकानाची माहिती जतन करा",
    "Banner title": "बॅनर शीर्षक", "Banner title (Marathi)": "बॅनर शीर्षक (मराठी)", "Image URL": "प्रतिमा URL", "Upload a banner image": "बॅनर प्रतिमा अपलोड करा",
    "Store page link (optional)": "दुकानाच्या पृष्ठाची लिंक (ऐच्छिक)", "Publish this banner": "हा बॅनर प्रकाशित करा",
    "Save homepage banner": "मुखपृष्ठ बॅनर जतन करा",
    "Saving product…": "उत्पादन जतन होत आहे…", "Product saved.": "उत्पादन जतन केले.",
    "Product deleted.": "उत्पादन हटवले.", "Store information saved.": "दुकानाची माहिती जतन केली.",
    "Homepage banner saved.": "मुखपृष्ठ बॅनर जतन केला.", "Enquiry marked handled.": "चौकशी हाताळलेली म्हणून चिन्हांकित केली.",
    "new": "नवीन", "handled": "हाताळलेली",
    "Store administration | Perfect Mens Wear": "दुकान व्यवस्थापन | परफेक्ट मेन्स वेअर",
    "MENS WEAR · STORE ADMIN": "MENS WEAR · दुकान व्यवस्थापन",
    "Language preference could not be saved in this browser.": "या ब्राउझरमध्ये भाषेची पसंती जतन होऊ शकली नाही.",
    "Switch language": "भाषा बदला"
  };
  let language = "en";
  let accessToken = "";
  let currentUser = null;
  let productRows = [];

  try {
    language = localStorage.getItem("perfect-mens-wear-language-v1") === "mr" ? "mr" : "en";
  } catch (error) {
    console.error("Could not restore the language preference.", error);
  }

  function t(value) {
    return language === "mr" ? adminTranslations[value] || value : value;
  }

  function translateStaticContent() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (!node.parentElement?.closest("script, style")) {
        if (node.dataset.originalText === undefined) node.dataset.originalText = node.nodeValue;
        const source = node.dataset.originalText.trim();
        if (source) node.nodeValue = node.dataset.originalText.replace(source, t(source));
      }
      node = walker.nextNode();
    }
    document.querySelectorAll("[placeholder], [aria-label], [title]").forEach((element) => {
      for (const attribute of ["placeholder", "aria-label", "title"]) {
        if (!element.hasAttribute(attribute)) continue;
        const key = `original${attribute.replace(/(^|-)(\w)/g, (_, _separator, character) => character.toUpperCase())}`;
        if (element.dataset[key] === undefined) element.dataset[key] = element.getAttribute(attribute);
        element.setAttribute(attribute, t(element.dataset[key]));
      }
    });
    document.documentElement.lang = language;
    const toggle = document.querySelector("[data-admin-language-toggle]");
    if (toggle) toggle.textContent = language === "en" ? "मराठी" : "English";
    if (document.documentElement.dataset.originalTitle === undefined) document.documentElement.dataset.originalTitle = document.title;
    document.title = t(document.documentElement.dataset.originalTitle);
    document.querySelectorAll("[data-admin-message], [data-dashboard-message]").forEach((element) => {
      if (element.dataset.originalMessage !== undefined) element.textContent = t(element.dataset.originalMessage);
    });
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage === "mr" ? "mr" : "en";
    try {
      localStorage.setItem("perfect-mens-wear-language-v1", language);
    } catch (error) {
      console.error("Could not save the language preference.", error);
      showMessage("Language preference could not be saved in this browser.", true);
    }
    translateStaticContent();
    if (!dashboard.hidden) {
      Promise.all([loadProducts(), loadEnquiries()]).catch((error) => {
        console.error("Could not refresh translated admin tables.", error);
        showMessage(error.message, true);
      });
    }
  }

  function configured() {
    return /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(String(config.supabaseUrl || ""))
      && /^[A-Za-z0-9._-]{20,}$/.test(String(config.supabaseAnonKey || ""));
  }

  function showMessage(message, isError) {
    const output = document.querySelector(dashboard.hidden ? "[data-admin-message]" : "[data-dashboard-message]");
    if (!output) return;
    output.dataset.originalMessage = message;
    output.textContent = t(message);
    output.classList.toggle("is-error", Boolean(isError));
  }

  function apiHeaders(withAuth, prefer) {
    if (!configured()) throw new Error("Supabase URL and public anon key must be configured in site-config.js.");
    const headers = {
      apikey: config.supabaseAnonKey,
      Authorization: `Bearer ${withAuth ? accessToken : config.supabaseAnonKey}`,
      "Content-Type": "application/json"
    };
    if (prefer) headers.Prefer = prefer;
    return headers;
  }

  async function request(table, method, query, body, prefer) {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/${table}${query ? `?${query}` : ""}`, {
      method,
      headers: apiHeaders(true, prefer),
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`Supabase ${table} request failed (${response.status}): ${text.slice(0, 400)}`);
    return text ? JSON.parse(text) : null;
  }

  async function uploadImage(file) {
    if (!file) return "";
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Use a JPG, PNG, or WebP image.");
    if (file.size > 20 * 1024 * 1024) throw new Error("Source images must be 20 MB or smaller.");
    const bitmap = await createImageBitmap(file);
    const maxDimension = 1800;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      throw new Error("This browser could not prepare the image for upload.");
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const optimizedImage = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("This image could not be optimized.")), "image/webp", 0.82);
    });
    canvas.width = 0;
    canvas.height = 0;
    if (optimizedImage.size > 5 * 1024 * 1024) throw new Error("The optimized image is still larger than 5 MB.");
    const path = `${crypto.randomUUID()}.webp`;
    const response = await fetch(`${config.supabaseUrl}/storage/v1/object/product-images/${path}`, {
      method: "POST",
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "image/webp",
        "x-upsert": "false"
      },
      body: optimizedImage
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`Image upload failed (${response.status}): ${text.slice(0, 300)}`);
    return `${config.supabaseUrl}/storage/v1/object/public/product-images/${path}`;
  }

  async function uploadImages(files) {
    if (files.length > 6) throw new Error("A product can have up to 6 gallery photos.");
    return Promise.all(files.map(uploadImage));
  }

  function splitList(value) {
    return String(value || "").split(",").map((entry) => entry.trim()).filter(Boolean);
  }

  function showDashboard() {
    login.hidden = true;
    dashboard.hidden = false;
    document.querySelector("[data-admin-user]").textContent = currentUser.email;
  }

  async function verifyAdmin() {
    const result = await request("admin_users", "GET", `select=user_id&user_id=eq.${encodeURIComponent(currentUser.id)}`);
    if (!Array.isArray(result) || !result.some((row) => row.user_id === currentUser.id)) {
      throw new Error("This authenticated account is not authorized as a store administrator.");
    }
  }

  async function loadProducts() {
    productRows = await request("products", "GET", "select=*&order=created_at.desc");
    const table = document.querySelector("[data-product-table]");
    table.innerHTML = productRows.map((product) => `<tr>
      <td>${escapeHtml(language === "mr" ? product.name_mr || product.name : product.name)}<small>${escapeHtml(product.brand)}</small></td>
      <td>${escapeHtml(language === "mr" ? product.category_mr || product.category : product.category)}</td><td>${formatPrice(product.price)}</td><td>${Number(product.stock)}</td><td>${t(product.active ? "Yes" : "No")}</td>
      <td><button type="button" class="admin-row-action" data-edit-product="${escapeHtml(product.id)}">${t("Edit")}</button><button type="button" class="admin-row-action is-danger" data-delete-product="${escapeHtml(product.id)}">${t("Delete")}</button></td>
    </tr>`).join("") || `<tr><td colspan="6">${t("No catalogue products have been added.")}</td></tr>`;
    translateStaticContent();
  }

  async function loadEnquiries() {
    const enquiries = await request("order_enquiries", "GET", "select=*&order=created_at.desc");
    const table = document.querySelector("[data-enquiry-table]");
    table.innerHTML = enquiries.map((entry) => `<tr>
      <td>${escapeHtml(new Date(entry.created_at).toLocaleString())}</td>
      <td>${escapeHtml(entry.customer_name)}</td><td>${escapeHtml(entry.customer_contact)}</td>
      <td>${escapeHtml(entry.message)}</td><td>${escapeHtml(t(entry.status))}</td>
      <td><button type="button" class="admin-row-action" data-enquiry-done="${escapeHtml(entry.id)}">${t("Mark handled")}</button></td>
    </tr>`).join("") || `<tr><td colspan="6">${t("No enquiries received.")}</td></tr>`;
    translateStaticContent();
  }

  async function loadStore() {
    const rows = await request("store_settings", "GET", "select=key,value&key=eq.store");
    const data = rows[0]?.value || {};
    const form = document.querySelector("[data-store-form]");
    for (const [key, value] of Object.entries(data)) {
      const input = form.elements.namedItem(key);
      if (input) input.value = String(value || "");
    }
  }

  async function loadDashboardData() {
    await Promise.all([loadProducts(), loadEnquiries(), loadStore()]);
  }

  function editProduct(id) {
    const product = productRows.find((row) => row.id === id);
    if (!product) return;
    const form = document.querySelector("[data-product-form]");
    for (const key of ["id", "name", "name_mr", "brand", "category", "category_mr", "price", "mrp", "stock", "tag", "tag_mr"]) form.elements.namedItem(key).value = product[key] ?? "";
    form.elements.namedItem("sizes").value = (product.sizes || []).join(", ");
    form.elements.namedItem("colors").value = (product.colors || []).join(", ");
    form.elements.namedItem("active").checked = Boolean(product.active);
    form.elements.namedItem("bestseller").checked = Boolean(product.bestseller);
    form.elements.namedItem("new_arrival").checked = Boolean(product.new_arrival);
    form.dataset.imageUrls = JSON.stringify(product.images || []);
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function saveProduct(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      showMessage("Saving product…");
      const selectedFiles = data.getAll("images").filter((file) => file instanceof File && file.size > 0);
      const uploadedImages = await uploadImages(selectedFiles);
      const previous = productRows.find((row) => row.id === data.get("id"));
      let images = uploadedImages;
      if (!images.length) {
        try {
          images = JSON.parse(form.dataset.imageUrls || "[]");
        } catch (error) {
          throw new Error("The existing product gallery could not be read. Please choose images again.");
        }
      }
      if (!images.length && previous?.images?.length) images = previous.images;
      const id = String(data.get("id") || crypto.randomUUID());
      const payload = {
        id,
        name: String(data.get("name")).trim(),
        name_mr: String(data.get("name_mr") || "").trim() || null,
        brand: String(data.get("brand")).trim(),
        category: String(data.get("category")).trim(),
        category_mr: String(data.get("category_mr") || "").trim() || null,
        price: Number(data.get("price")),
        mrp: data.get("mrp") ? Number(data.get("mrp")) : null,
        stock: Number(data.get("stock")),
        sizes: splitList(data.get("sizes")),
        colors: splitList(data.get("colors")),
        tag: String(data.get("tag") || "").trim(),
        tag_mr: String(data.get("tag_mr") || "").trim() || null,
        bestseller: data.get("bestseller") === "on",
        new_arrival: data.get("new_arrival") === "on",
        images,
        active: data.get("active") === "on"
      };
      if (!payload.name || !payload.brand || !payload.category || !payload.sizes.length) {
        throw new Error("Enter a product name, brand, category, and at least one size.");
      }
      if (!Number.isFinite(payload.price) || payload.price < 0 || !Number.isInteger(payload.stock) || payload.stock < 0) throw new Error("Enter a valid non-negative price and whole-number stock quantity.");
      if (payload.mrp !== null && (!Number.isFinite(payload.mrp) || payload.mrp < payload.price)) throw new Error("MRP must be equal to or higher than the selling price.");
      if (!payload.images.length) throw new Error("Upload at least one product gallery photo before saving.");
      await request("products", "POST", "on_conflict=id", payload, "resolution=merge-duplicates,return=representation");
      form.reset();
      form.elements.namedItem("active").checked = true;
      delete form.dataset.imageUrls;
      await loadProducts();
      showMessage("Product saved.");
    } catch (error) {
      console.error("Could not save product.", error);
      showMessage(error.message, true);
    }
  }

  async function saveStore(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      if (data.phone && !/^[+\d\s().-]{7,25}$/.test(data.phone)) throw new Error("Enter a valid store phone number or leave the field blank.");
      if (!/^https:\/\/(?:maps\.app\.goo\.gl\/|www\.google\.com\/maps)/i.test(String(data.mapUrl || ""))) {
        throw new Error("Enter a Google Maps directions link.");
      }
      if (data.mapEmbedUrl && !/^https:\/\/(www\.)?google\.com\/maps\/embed\?/.test(data.mapEmbedUrl)) {
        throw new Error("Enter a valid Google Maps Embed URL or leave the field blank.");
      }
      if (data.instagramUrl && !/^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._/]+\/?$/.test(data.instagramUrl)) {
        throw new Error("Enter a valid Instagram profile link or leave the field blank.");
      }
      await request("store_settings", "POST", "on_conflict=key", { key: "store", value: data }, "resolution=merge-duplicates,return=representation");
      showMessage("Store information saved.");
    } catch (error) {
      console.error("Could not save store information.", error);
      showMessage(error.message, true);
    }
  }

  async function saveBanner(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const file = data.get("image");
      const uploaded = file instanceof File && file.size ? await uploadImage(file) : "";
      const imageUrl = uploaded || String(data.get("image_url") || "").trim();
      if (!/^https:\/\/[^\s"'<>]+$/.test(imageUrl)) throw new Error("Provide an HTTPS image URL or upload a banner image.");
      const title = String(data.get("title") || "").trim();
      if (!title) throw new Error("Enter a homepage banner title.");
      await request("homepage_banners", "PATCH", "active=eq.true", { active: false }, "return=minimal");
      await request("homepage_banners", "POST", "", {
        title,
        title_mr: String(data.get("title_mr") || "").trim() || null,
        image_url: imageUrl,
        link_url: ["collection.html", "contact.html"].includes(String(data.get("link_url") || "").trim()) ? String(data.get("link_url")).trim() : null,
        active: data.get("active") === "on",
        sort_order: 0
      }, "return=representation");
      showMessage("Homepage banner saved.");
    } catch (error) {
      console.error("Could not save homepage banner.", error);
      showMessage(error.message, true);
    }
  }

  async function handleDashboardClick(event) {
    const edit = event.target.closest("[data-edit-product]");
    const remove = event.target.closest("[data-delete-product]");
    const handled = event.target.closest("[data-enquiry-done]");
    const tab = event.target.closest("[data-admin-tab]");
    try {
      if (edit) editProduct(edit.dataset.editProduct);
      if (remove && window.confirm("Delete this product from the catalogue?")) {
        await request("products", "DELETE", `id=eq.${encodeURIComponent(remove.dataset.deleteProduct)}`, undefined, "return=minimal");
        await loadProducts();
        showMessage("Product deleted.");
      }
      if (handled) {
        await request("order_enquiries", "PATCH", `id=eq.${encodeURIComponent(handled.dataset.enquiryDone)}`, { status: "handled" }, "return=minimal");
        await loadEnquiries();
        showMessage("Enquiry marked handled.");
      }
      if (tab) {
        document.querySelectorAll("[data-admin-tab]").forEach((button) => button.setAttribute("aria-selected", String(button === tab)));
        document.querySelectorAll("[data-admin-panel]").forEach((panel) => { panel.hidden = panel.dataset.adminPanel !== tab.dataset.adminTab; });
        if (tab.dataset.adminTab === "enquiries") await loadEnquiries();
      }
    } catch (error) {
      console.error("Admin action failed.", error);
      showMessage(error.message, true);
    }
  }

  async function signIn(event) {
    event.preventDefault();
    if (!configured()) {
      showMessage("Set the Supabase project URL and public anon key in site-config.js, then apply supabase-setup.sql.");
      return;
    }
    const data = new FormData(event.currentTarget);
    try {
      showMessage("Signing in…");
      const response = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { apikey: config.supabaseAnonKey, "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.msg || result.message || "Sign-in failed.");
      accessToken = result.access_token;
      currentUser = result.user;
      await verifyAdmin();
      showDashboard();
      await loadDashboardData();
    } catch (error) {
      console.error("Admin sign-in or initialization failed.", error);
      accessToken = "";
      currentUser = null;
      login.hidden = false;
      dashboard.hidden = true;
      showMessage(error.message, true);
    }
  }

  async function signOut() {
    try {
      const response = await fetch(`${config.supabaseUrl}/auth/v1/logout`, {
        method: "POST",
        headers: apiHeaders(true)
      });
      if (!response.ok) throw new Error(`Supabase sign-out failed (${response.status}).`);
    } catch (error) {
      console.error("Supabase sign-out failed.", error);
      showMessage(error.message, true);
    } finally {
      accessToken = "";
      currentUser = null;
      dashboard.hidden = true;
      login.hidden = false;
      document.querySelector("[data-admin-login-form]").reset();
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function formatPrice(value) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value) || 0);
  }

  document.querySelector("[data-admin-login-form]")?.addEventListener("submit", signIn);
  document.querySelector("[data-product-form]")?.addEventListener("submit", saveProduct);
  document.querySelector("[data-product-reset]")?.addEventListener("click", () => {
    const form = document.querySelector("[data-product-form]");
    form.reset();
    delete form.dataset.imageUrls;
    form.elements.namedItem("active").checked = true;
  });
  document.querySelector("[data-store-form]")?.addEventListener("submit", saveStore);
  document.querySelector("[data-banner-form]")?.addEventListener("submit", saveBanner);
  document.querySelector("[data-admin-dashboard]")?.addEventListener("click", handleDashboardClick);
  document.querySelector("[data-admin-signout]")?.addEventListener("click", signOut);
  document.querySelector("[data-admin-language-toggle]")?.addEventListener("click", () => setLanguage(language === "en" ? "mr" : "en"));
  translateStaticContent();
})();

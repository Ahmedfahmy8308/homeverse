<div align="center">

  <img src="./assets/images/branding/homeverse-logo-dark.png" alt="Homeverse logo" width="300" />

  <h1>Homeverse Real Estate Platform</h1>

  <p><strong>A Modern, Fully Responsive Real Estate Marketplace Platform</strong></p>

  <p>
    <a href="https://homeverse.ufuq-tech.com" target="_blank">
      <img src="https://img.shields.io/badge/Live_Website-homeverse.ufuq--tech.com-0052FF?style=for-the-badge&logo=vercel" alt="Live Demo" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/HTML-5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS-3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/Status-Optimized-1f883d?style=flat-square" alt="Status" />
  </p>

</div>

---

## 🌟 Overview

**Homeverse** is an advanced, multi-page frontend application for real estate listing, renting, and buying. Designed with user experience at its core, it offers dynamic property browsing, interactive property cards, a seamless multilingual experience (Arabic / English), and a complete set of inner pages including Blog, About, Profile, Authentication, and more.

### ✨ Key Features
- 🌍 **Fully Bilingual (i18n):** Flawless integration of LTR (English) and RTL (Arabic) with instant, memory-persistent translation switching without page reloads.
- 📱 **100% Responsive Design:** Smooth, modern UI perfectly optimized for desktops, tablets, and mobile devices.
- ❤️ **Interactive Property Cards:** Users can add properties to their "Favorites" or "Compare" list. User choices are instantly saved to the browser's `localStorage` and persist across all pages.
- 🖼️ **Immersive Property Galleries:** Interactive, full-screen image preview modals with smooth animations.
- ⚡ **Optimized Architecture:** Clean, modularized code structure. Global headers, footers, and design tokens ensure lightning-fast loading and ultra-low maintenance.

---

## 🚀 Live Demo

Experience the platform live at:
👉 **[homeverse.ufuq-tech.com](https://homeverse.ufuq-tech.com)**

---

## 🛠️ Technology Stack

- **HTML5:** Semantic architecture and fully structured multi-page layout.
- **CSS3:** Custom CSS variables, Flexbox/Grid layouts, and modularized styling (`style.css`, `pages-extra.css`, `legacy-ar.css` for RTL).
- **Vanilla JavaScript:** 
  - Dynamic `i18n.js` for on-the-fly language switching and DOM manipulation.
  - Interactive `properties.js` for persistent UI actions and modal generation.
- **Ionicons:** Scalable, lightweight SVG icons.

---

## 📂 Project Structure

```text
homeverse/
├── index.html                # Global Entry Point (Redirects to main app)
├── html/                     # Main Application Pages
│   ├── index.html            # Homepage (Hero, Properties, Services)
│   ├── about.html            # About Us
│   ├── property.html         # Properties Listing
│   ├── blog.html             # News & Articles
│   ├── profile.html          # User Dashboard
│   ├── login.html            # User Authentication
│   └── register.html         # Account Creation
├── assets/
│   ├── css/                  # Global and modular stylesheets
│   ├── js/                   # Core logic (translations, interactions)
│   ├── locales/              # JSON Language files (en.json, ar.json)
│   ├── images/               # High-res static assets & banners
│   └── fonts/                # Custom typographies
└── README.md
```

---

## 💻 Getting Started (Local Development)

Because Homeverse utilizes the Fetch API to dynamically load translation files (`ar.json`, `en.json`), it must be run via a local web server (opening the file directly via `file://` will trigger CORS restrictions).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ahmedfahmy8308/homeverse.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd homeverse
   ```

3. **Start a local development server:**
   Using Python:
   ```bash
   python -m http.server 5500
   ```
   Or using Node.js (Live Server):
   ```bash
   npx serve .
   ```

4. **View the application:**
   Open your browser and navigate to `http://localhost:5500`

---

## 👨‍💻 Credits & Enhancements

This project was extensively restructured, optimized, and enhanced for production readiness.

🔥 **Enhanced & Optimized by:**  
**Ahmed Fahmy** at **[Ufuq Tech](https://ufuq-tech.com)**

### Notable Enhancements by Ufuq:
- Migrated legacy HTML translation pages into a dynamic JSON-based localization system.
- Standardized global DOM elements (Header/Footer) across all sub-pages.
- Implemented persistent UI states (`localStorage`) for the property interaction engine.
- Re-architected CSS logic to eliminate global namespace collisions.
- Designed custom animated image modals and improved mobile layout stability.

---

## 📄 License & Copyright

&copy; 2026 **Ufuq Tech** / **Ahmed Fahmy**. All Rights Reserved.  
This software architecture and modifications are proprietary. Unauthorized copying of the customized scripts via any medium is strictly prohibited.

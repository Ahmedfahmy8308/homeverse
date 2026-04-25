const i18n = {
  currentLang: localStorage.getItem('lang') || 'en',
  
  async loadTranslations() {
    try {
      const response = await fetch(`../assets/locales/${this.currentLang}.json`);
      if (!response.ok) throw new Error('Network response was not ok');
      this.translations = await response.json();
      this.applyTranslations();
      this.updateDirection();
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (this.translations && this.translations[key]) {
        el.textContent = this.translations[key];
      }
    });

    // Specific logic for language switcher text
    const langBtn = document.querySelector('[data-lang-switch]');
    if (langBtn) {
      langBtn.textContent = this.currentLang === 'en' ? 'اللغة العربية' : 'English';
    }
  },

  updateDirection() {
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // Conditionally load RTL CSS
    const oldLink = document.getElementById('rtl-css');
    if (this.currentLang === 'ar') {
      if (!oldLink) {
        const link = document.createElement('link');
        link.id = 'rtl-css';
        link.rel = 'stylesheet';
        link.href = '../assets/css/legacy-ar.css';
        document.head.appendChild(link);
      }
    } else {
      if (oldLink) {
        oldLink.remove();
      }
    }
  },

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('lang', this.currentLang);
    this.loadTranslations();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  i18n.loadTranslations();

  // Attach event listener to language switcher
  const langSwitches = document.querySelectorAll('[data-lang-switch]');
  langSwitches.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      i18n.toggleLanguage();
    });
  });
});

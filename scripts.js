// Enhanced Portfolio JavaScript with Modern Features

// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Global state
const state = {
  isLoaded: false,
  currentTestimonial: 0,
  totalTestimonials: 0,
  isScrolling: false,
  currentFilter: 'all',
  observers: new Map(),
  particles: []
};

// Theme management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.toggle = $('#themeToggle');
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    this.toggle?.addEventListener('click', () => this.toggleTheme());
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update meta theme-color
    const metaTheme = $('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = theme === 'dark' ? '#090d12' : '#ffffff';
    }
  }

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    
    // Add visual feedback
    this.toggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
      this.toggle.style.transform = 'scale(1)';
    }, 150);
  }
}

// Loading screen manager
class LoadingManager {
  constructor() {
    this.loadingScreen = $('#loading-screen');
    this.progressBar = $('#progressBar');
    this.progress = 0;
    this.init();
  }

  init() {
    this.simulateLoading();
    window.addEventListener('load', () => this.hideLoading());
  }

  simulateLoading() {
    const interval = setInterval(() => {
      this.progress += Math.random() * 30;
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(interval);
      }
      this.updateProgress();
    }, 200);
  }

  updateProgress() {
    if (this.progressBar) {
      this.progressBar.style.width = `${this.progress}%`;
    }
  }

  hideLoading() {
    setTimeout(() => {
      if (this.loadingScreen) {
        this.loadingScreen.classList.add('hidden');
        setTimeout(() => {
          this.loadingScreen.remove();
        }, 500);
      }
      state.isLoaded = true;
      document.body.classList.add('loaded');
    }, 800);
  }
}

// Scroll progress indicator
class ScrollProgress {
  constructor() {
    this.progressBar = $('#progressBar');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
  }

  updateProgress() {
    if (!this.progressBar || !state.isLoaded) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    
    this.progressBar.style.width = `${Math.min(progress, 100)}%`;
  }
}

// Navigation manager
class NavigationManager {
  constructor() {
    this.nav = $('#nav');
    this.menuBtn = $('#menuBtn');
    this.links = $$('.links a');
    this.sections = $$('main section[id]');
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupActiveLinks();
    this.setupNavbarBackground();
  }

  setupMobileMenu() {
    this.menuBtn?.addEventListener('click', () => {
      const isExpanded = this.menuBtn.getAttribute('aria-expanded') === 'true';
      this.menuBtn.setAttribute('aria-expanded', !isExpanded);
      this.nav.classList.toggle('open');
    });

    // Close menu when clicking links
    this.links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          this.nav.classList.remove('open');
          this.menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.nav.classList.contains('open')) {
        this.nav.classList.remove('open');
        this.menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  setupSmoothScrolling() {
    this.links.forEach(link => {
      if (link.getAttribute('href')?.startsWith('#')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const targetSection = $(targetId);
          
          if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        });
      }
    });
  }

  setupActiveLinks() {
    const linkMap = new Map();
    this.links.forEach(link => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        linkMap.set(href.slice(1), link);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = linkMap.get(id);
        
        if (link) {
          if (entry.isIntersecting) {
            // Remove active from all links
            this.links.forEach(l => l.removeAttribute('aria-current'));
            // Add active to current link
            link.setAttribute('aria-current', 'true');
          }
        }
      });
    }, {
      rootMargin: '-45% 0px -50% 0px'
    });

    this.sections.forEach(section => observer.observe(section));
  }

  setupNavbarBackground() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        this.nav.style.background = 'rgba(11,15,20,.98)';
        this.nav.style.backdropFilter = 'saturate(140%) blur(20px)';
      } else {
        this.nav.style.background = 'linear-gradient(180deg, rgba(11,15,20,.95), rgba(11,15,20,.75))';
        this.nav.style.backdropFilter = 'saturate(140%) blur(20px)';
      }
      
      // Hide/show navbar on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        this.nav.style.transform = 'translateY(-100%)';
      } else {
        this.nav.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    }, { passive: true });
  }
}

// Animation manager
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupParticles();
    this.setupSkillBars();
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('animate');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    $$('[data-animate]').forEach(el => observer.observe(el));
  }

  setupParticles() {
    const particlesContainer = $('.particles');
    if (!particlesContainer) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const duration = Math.random() * 20 + 10;
      
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationName = 'float';
      
      particlesContainer.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, duration * 1000);
    };

    // Create initial particles
    for (let i = 0; i < 20; i++) {
      setTimeout(createParticle, i * 200);
    }

    // Continue creating particles
    setInterval(createParticle, 2000);
  }

  setupSkillBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBars = entry.target.querySelectorAll('.skill-progress');
          progressBars.forEach(bar => {
            const progress = bar.dataset.progress;
            setTimeout(() => {
              bar.classList.add('animated');
              bar.style.width = `${progress}%`;
            }, 500);
          });
          observer.unobserve(entry.target);
        }
      });
    });

    $$('.skills-grid').forEach(grid => observer.observe(grid));
  }
}

// Project filter manager
class ProjectFilterManager {
  constructor() {
    this.filterBtns = $$('.filter-btn');
    this.projectCards = $$('.project-card');
    this.init();
  }

  init() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => this.filterProjects(btn));
    });
  }

  filterProjects(activeBtn) {
    const filter = activeBtn.dataset.filter;
    
    // Update active button
    this.filterBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');

    // Filter projects
    this.projectCards.forEach(card => {
      card.classList.add('filtering');
      
      const shouldShow = filter === 'all' || 
                        card.dataset.category?.includes(filter);
      
      if (shouldShow) {
        card.classList.remove('filter-out');
        card.style.display = 'block';
      } else {
        card.classList.add('filter-out');
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });

    // Remove filtering class after animation
    setTimeout(() => {
      this.projectCards.forEach(card => {
        card.classList.remove('filtering');
      });
    }, 500);

    state.currentFilter = filter;
  }
}

// Testimonials slider
class TestimonialsSlider {
  constructor() {
    this.track = $('#testimonialsTrack');
    this.prevBtn = $('#prevBtn');
    this.nextBtn = $('#nextBtn');
    this.dotsContainer = $('#sliderDots');
    this.testimonials = $$('.testimonial-card');
    this.currentIndex = 0;
    this.init();
  }

  init() {
    if (!this.track || this.testimonials.length === 0) return;

    state.totalTestimonials = this.testimonials.length;
    this.createDots();
    this.setupControls();
    this.setupAutoplay();
    this.setupSwipeGestures();
  }

  createDots() {
    this.testimonials.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });
  }

  setupControls() {
    this.prevBtn?.addEventListener('click', () => this.previousSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.previousSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
  }

  setupAutoplay() {
    let autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);

    // Pause on hover
    const slider = $('.testimonials-slider');
    slider?.addEventListener('mouseenter', () => {
      clearInterval(autoplayInterval);
    });

    slider?.addEventListener('mouseleave', () => {
      autoplayInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    });
  }

  setupSwipeGestures() {
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;

    this.track.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }, { passive: true });

    this.track.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      const touch = e.touches[0];
      distX = touch.clientX - startX;
      distY = touch.clientY - startY;
    }, { passive: true });

    this.track.addEventListener('touchend', () => {
      if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 50) {
        if (distX > 0) {
          this.previousSlide();
        } else {
          this.nextSlide();
        }
      }
      startX = 0;
      startY = 0;
      distX = 0;
      distY = 0;
    }, { passive: true });
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.track.classList.add('transitioning');
    this.track.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dots
    $$('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Update buttons
    this.prevBtn.disabled = index === 0;
    this.nextBtn.disabled = index === this.testimonials.length - 1;

    setTimeout(() => {
      this.track.classList.remove('transitioning');
    }, 500);
  }

  nextSlide() {
    if (this.currentIndex < this.testimonials.length - 1) {
      this.goToSlide(this.currentIndex + 1);
    } else {
      this.goToSlide(0); // Loop back to start
    }
  }

  previousSlide() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    } else {
      this.goToSlide(this.testimonials.length - 1); // Loop to end
    }
  }
}

// Contact form manager
class ContactFormManager {
  constructor() {
    this.form = $('#contactForm');
    this.submitBtn = $('#submitBtn');
    this.submitText = $('#submitText');
    this.submitSpinner = $('#submitSpinner');
    this.formStatus = $('#formStatus');
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.setupValidation();
    this.setupSubmission();
  }

  setupValidation() {
    const inputs = this.form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';

    // Remove previous error state
    formGroup.classList.remove('error', 'success');

    // Validation rules
    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      errorMessage = `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} is required`;
    } else if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    } else if (field.name === 'message' && field.value.length < 10) {
      isValid = false;
      errorMessage = 'Message must be at least 10 characters long';
    }

    // Update UI
    if (!isValid) {
      formGroup.classList.add('error');
      if (errorElement) {
        errorElement.textContent = errorMessage;
      }
    } else if (field.value.trim()) {
      formGroup.classList.add('success');
    }

    return isValid;
  }

  clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
  }

  async setupSubmission() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate all fields
      const inputs = this.form.querySelectorAll('input[required], textarea[required]');
      let isFormValid = true;
      
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        this.showStatus('Please fix the errors above', 'error');
        return;
      }

      // Show loading state
      this.setLoadingState(true);

      try {
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create mailto link as fallback
        const subject = encodeURIComponent(data.subject || 'Portfolio Contact');
        const body = encodeURIComponent(
          `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
        );
        
        window.location.href = `mailto:kareem.shakl.eg@gmail.com?subject=${subject}&body=${body}`;
        
        this.showStatus('Thank you! Your email client will open with the message.', 'success');
        this.form.reset();
        
        // Clear form state
        this.form.querySelectorAll('.form-group').forEach(group => {
          group.classList.remove('error', 'success');
        });

      } catch (error) {
        this.showStatus('Something went wrong. Please try again.', 'error');
        console.error('Form submission error:', error);
      } finally {
        this.setLoadingState(false);
      }
    });
  }

  setLoadingState(loading) {
    if (loading) {
      this.submitText.textContent = 'Sending...';
      this.submitSpinner.style.display = 'inline-block';
      this.submitBtn.disabled = true;
    } else {
      this.submitText.textContent = 'Send Message';
      this.submitSpinner.style.display = 'none';
      this.submitBtn.disabled = false;
    }
  }

  showStatus(message, type) {
    this.formStatus.textContent = message;
    this.formStatus.className = `form-status ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.formStatus.className = 'form-status';
      this.formStatus.textContent = '';
    }, 5000);
  }
}

// Back to top button
class BackToTopManager {
  constructor() {
    this.button = $('#backToTop');
    this.init();
  }

  init() {
    if (!this.button) return;

    window.addEventListener('scroll', () => this.toggleVisibility(), { passive: true });
    this.button.addEventListener('click', () => this.scrollToTop());
  }

  toggleVisibility() {
    if (window.scrollY > 300) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Notification system
class NotificationManager {
  constructor() {
    this.container = this.createContainer();
  }

  createContainer() {
    const container = document.createElement('div');
    container.className = 'notifications-container';
    container.style.cssText = `
      position: fixed;
      top: 90px;
      right: 20px;
      z-index: 1001;
      pointer-events: none;
    `;
    document.body.appendChild(container);
    return container;
  }

  show(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.pointerEvents = 'auto';
    
    this.container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);

    return notification;
  }
}

// Performance monitor
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    if ('PerformanceObserver' in window) {
      this.observePerformance();
    }
    
    window.addEventListener('load', () => {
      this.logPerformanceMetrics();
    });
  }

  observePerformance() {
    // Observe paint metrics
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics[entry.name] = entry.startTime;
      }
    });
    paintObserver.observe({ entryTypes: ['paint'] });

    // Observe layout shifts
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.cls = clsValue;
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  logPerformanceMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
    this.metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
    
    console.log('Portfolio Performance Metrics:', this.metrics);
  }
}

// Accessibility manager
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupReducedMotion();
    this.setupScreenReaderAnnouncements();
  }

  setupKeyboardNavigation() {
    // Tab trap for mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const nav = $('#nav');
        if (nav.classList.contains('open')) {
          const focusableElements = nav.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  setupFocusManagement() {
    // Add focus indicators for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }

  setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.body.classList.add('reduced-motion');
    }

    prefersReducedMotion.addEventListener('change', () => {
      if (prefersReducedMotion.matches) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    });
  }

  setupScreenReaderAnnouncements() {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-announce';
    document.body.appendChild(announcer);

    // Announce section changes
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.querySelector('h2')?.textContent;
          if (sectionName) {
            announcer.textContent = `${sectionName} section`;
          }
        }
      });
    }, { threshold: 0.5 });

    $$('main section[id]').forEach(section => observer.observe(section));
  }

  announce(message) {
    const announcer = $('.sr-announce');
    if (announcer) {
      announcer.textContent = message;
    }
  }
}

// Service Worker registration
class ServiceWorkerManager {
  constructor() {
    this.init();
  }

  async init() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registered successfully:', registration);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update notification
              const notification = new NotificationManager();
              notification.show('A new version is available. Refresh to update.', 'info', 10000);
            }
          });
        });
      } catch (error) {
        console.log('ServiceWorker registration failed:', error);
      }
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  const themeManager = new ThemeManager();
  const loadingManager = new LoadingManager();
  const scrollProgress = new ScrollProgress();
  const navigationManager = new NavigationManager();
  const animationManager = new AnimationManager();
  const projectFilterManager = new ProjectFilterManager();
  const testimonialsSlider = new TestimonialsSlider();
  const contactFormManager = new ContactFormManager();
  const backToTopManager = new BackToTopManager();
  const notificationManager = new NotificationManager();
  const performanceMonitor = new PerformanceMonitor();
  const accessibilityManager = new AccessibilityManager();
  const serviceWorkerManager = new ServiceWorkerManager();

  // Set footer year
  const yearElement = $('#year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Add resize handler for responsive adjustments
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Close mobile menu on resize
      if (window.innerWidth > 900) {
        const nav = $('#nav');
        const menuBtn = $('#menuBtn');
        nav?.classList.remove('open');
        menuBtn?.setAttribute('aria-expanded', 'false');
      }
    }, 250);
  }, { passive: true });

  // Add error handling for failed image loads
  $$('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.display = 'none';
      console.warn('Failed to load image:', this.src);
    });
  });

  // Initialize intersection observer for lazy loading
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          lazyImageObserver.unobserve(img);
        }
      });
    });

    $$('img[data-src]').forEach(img => lazyImageObserver.observe(img));
  }

  // Add global error handler
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Don't show error notifications in production
    if (window.location.hostname === 'localhost') {
      notificationManager.show('An error occurred. Check console for details.', 'error');
    }
  });

  // Add unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault(); // Prevent default browser behavior
  });

  console.log('🚀 Portfolio initialized successfully!');
});

// Expose useful functions globally
window.PortfolioAPI = {
  showNotification: (message, type, duration) => {
    const notificationManager = new NotificationManager();
    return notificationManager.show(message, type, duration);
  },
  
  scrollToSection: (sectionId) => {
    const section = $(`#${sectionId}`);
    if (section) {
      const offsetTop = section.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  },
  
  filterProjects: (filter) => {
    const filterBtn = $(`.filter-btn[data-filter="${filter}"]`);
    if (filterBtn) {
      filterBtn.click();
    }
  },
  
  getPerformanceMetrics: () => {
    return state.metrics || {};
  }
};

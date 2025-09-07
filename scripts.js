// Utility: sr-only class
const style = document.createElement('style');
style.textContent = `.sr{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`;
document.head.appendChild(style);

// Mobile nav toggle
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');
menuBtn?.addEventListener('click', () => {
  const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', !isExpanded);
  nav.classList.toggle('open');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
});

// Active link highlighting on scroll
const sections = document.querySelectorAll('main section[id]');
const linkMap = new Map([...document.querySelectorAll('.links a[href^="#"]')].map(a=>[a.getAttribute('href').slice(1), a]));
const io2 = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    const id = e.target.id; const link = linkMap.get(id);
    if(!link) return;
    if(e.isIntersecting){ 
      document.querySelectorAll('.links a[aria-current="true"]').forEach(el=>el.removeAttribute('aria-current')); 
      link.setAttribute('aria-current','true'); 
    }
  });
}, {rootMargin:'-45% 0px -50% 0px'});
sections.forEach(s=> io2.observe(s));

// Intersection animations
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e => { 
    if(e.isIntersecting){ 
      e.target.classList.add('in'); 
      io.unobserve(e.target);
    } 
  });
}, {threshold:.12});
document.querySelectorAll('[data-animate]').forEach(el=> io.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form (client‑only demo with basic validation)
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitSpinner = document.getElementById('submitSpinner');

form?.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const status = document.getElementById('formStatus');
  
  // Show loading state
  submitText.textContent = 'Sending...';
  submitSpinner.style.display = 'inline-block';
  submitBtn.disabled = true;
  
  // Get form data
  const fd = new FormData(form);
  const name = (fd.get('name')||'').toString().trim();
  const email = (fd.get('email')||'').toString().trim();
  const message = (fd.get('message')||'').toString().trim();

  // Validate
  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if(!name || !validEmail.test(email) || message.length < 10){
    status.textContent = 'Please provide a name, valid email, and message (10+ chars).';
    status.style.color = 'var(--danger)';
    
    // Reset button state
    submitText.textContent = 'Send Message';
    submitSpinner.style.display = 'none';
    submitBtn.disabled = false;
    return;
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, you would send this to your backend
  const subject = encodeURIComponent('New project inquiry');
  const body = encodeURIComponent(`Hi Kareem,\n\nMy name is ${name}.\n\n${message}\n\nYou can reach me at ${email}.`);
  window.location.href = `mailto:kareem.shakl.eg@gmail.com?subject=${subject}&body=${body}`;
  
  status.textContent = 'Thanks, ' + name + '! Opening your mail client…';
  status.style.color = 'var(--ok)';
  form.reset();
  
  // Reset button state after delay
  setTimeout(() => {
    submitText.textContent = 'Send Message';
    submitSpinner.style.display = 'none';
    submitBtn.disabled = false;
    status.textContent = '';
  }, 3000);
});

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => {
    img.src = img.dataset.src;
  });
}

// Service worker registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful');
    }).catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

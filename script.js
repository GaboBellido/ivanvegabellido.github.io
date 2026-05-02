// Year stamp in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth-scroll polyfill fallback for older browsers (most modern browsers handle this via CSS)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || targetId === '#top') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

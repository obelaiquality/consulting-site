
    fetch('partials/nav.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('site-nav').innerHTML = html;
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        if (link.getAttribute('href').split('/').pop() === currentPage) {
          link.classList.add('active');
        }
      });
    });
  
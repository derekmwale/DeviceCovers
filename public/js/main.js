// Main site functionality
document.addEventListener('DOMContentLoaded', function () {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      // Only proceed if href is a valid non-empty selector
      if (href && href !== '#' && href.length > 1) {
        try {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        } catch (err) {
          console.warn('Invalid selector:', href);
        }
      }
    });
  });

  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (token) {
    // User is logged in, show dashboard link
    const dashLink = document.querySelector('a[href="/dashboard"]');
    if (dashLink) {
      dashLink.style.display = 'inline';
    }
  }
});

// Logout function
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

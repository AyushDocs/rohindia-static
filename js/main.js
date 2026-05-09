// Rohindia - JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeNewsletterForm();
    initializeParallax();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeHeroButtons();
    initializeExploreToggle();
});

// Navigation functionality
function initializeNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const header = document.querySelector('.header');

    // ...existing code...

    // Mobile menu toggle
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}
// ...existing code...


// Form validation
function handleApplicationSubmit() {
	let isValid = true;

	const name = document.getElementById('name');
	const email = document.getElementById('email');
	const city = document.getElementById('city');
    const country = document.getElementById('country');
    const reason = document.getElementById('reason');
    const contribution = document.getElementById('contribution');
    const professionalStatus = document.getElementById('professionalStatus');



	// Name validation
	if (!name.value.trim()) {
		showError('name', 'Name is required');
		isValid = false;
	} else if (name.value.trim().length < 2) {
		showError('name', 'Name must be at least 2 characters');
		isValid = false;
	}

	// Email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email.value.trim()) {
		showError('email', 'Email is required');
		isValid = false;
	} else if (!emailRegex.test(email.value)) {
		showError('email', 'Please enter a valid email address');
		isValid = false;
	}

    // City validation
    if (!city.value.trim()) {
        showError('city', 'City is required');
        isValid = false;
    }

    // Country validation
    if (!country.value.trim()) {
        showError('country', 'Country is required');
        isValid = false;
    }
    // Reason validation
    if (!reason.value.trim()) {
        showError('reason', 'Please tell us why you want to join');
        isValid = false;
    }
    // Contribution validation
    if (!contribution.value.trim()) {
        showError('contribution', 'Please tell us how you can contribute');
        isValid = false;
    }
    // Professional Status validation
    if (!professionalStatus.value.trim()) {
        showError('professionalStatus', 'Please tell us your current professional status');
        isValid = false;
    }

	return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');

    if (field && errorElement) {
        field.style.borderColor = '#e74c3c';
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputs = document.querySelectorAll('input, select, textarea');

    errorElements.forEach(element => {
        element.style.display = 'none';
        element.textContent = '';
    });

    inputs.forEach(input => {
        input.style.borderColor = '#E8DCC6';
    });
}

// Newsletter form functionality
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = newsletterForm.querySelector('input[type="email"]');
            const button = newsletterForm.querySelector('button');

            if (email.value.trim()) {
                // Simulate successful subscription
                const originalText = button.textContent;
                button.textContent = 'Subscribed!';
                button.style.background = '#28a745';

                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                    email.value = '';
                }, 2000);
            }
        });
    }
}

// Parallax scrolling effect
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-bg, .hero-background');

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach(element => {
            element.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    });
}

// Smooth scrolling functionality
function initializeSmoothScrolling() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Global function for CTA button
function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Modern hero button functionality
function initializeHeroButtons() {
    const shopButton = document.querySelector('.cta-primary');
    const learnButton = document.querySelector('.cta-secondary');

    if (shopButton) {
        shopButton.addEventListener('click', function() {
            window.location.href = '/shop';
        });
    }

    if (learnButton) {
        learnButton.addEventListener('click', function() {
            scrollToSection('highlights');
        });
    }
}

// Explore page: show first N articles and reveal rest on button click
function initializeExploreToggle() {
    const btn = document.getElementById('exploreMoreBtn');
    const blogGrid = document.querySelector('.blog-grid');
    if (!btn || !blogGrid) return;

    const cards = Array.from(blogGrid.querySelectorAll('.blog-card'));
    const initialVisible = 3;

    function updateVisibility(showAll) {
        cards.forEach((card, idx) => {
            if (showAll) {
                card.style.display = '';
            } else {
                card.style.display = (idx < initialVisible) ? '' : 'none';
            }
        });
        btn.textContent = showAll ? 'Show less' : 'Explore more';
        btn.setAttribute('aria-expanded', showAll ? 'true' : 'false');
    }

    // initialize
    updateVisibility(false);

    btn.addEventListener('click', function() {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        updateVisibility(!expanded);
        // smooth scroll to keep context when collapsing
        if (expanded) {
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Animation on scroll
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.highlight-card, .testimonial-card, .blog-card, .value-card, .timeline-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Enhanced hover effects for cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.highlight-card, .blog-card, .product-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Shopify iframe fallback
function checkShopifyIframe() {
    const iframe = document.querySelector('.shopify-iframe');
    const fallback = document.querySelector('.shop-fallback');

    if (iframe && fallback) {
        iframe.addEventListener('error', function() {
            iframe.style.display = 'none';
            fallback.style.display = 'block';
        });

        // Check if iframe loads successfully
        setTimeout(() => {
            try {
                iframe.contentWindow.location.href;
            } catch (e) {
                // If we can't access iframe content, show fallback
                iframe.style.display = 'none';
                fallback.style.display = 'block';
            }
        }, 3000);
    }
}

// Initialize Shopify check when DOM is loaded
document.addEventListener('DOMContentLoaded', checkShopifyIframe);

// Performance optimization - lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('.image-placeholder[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.backgroundImage = `url(${img.dataset.src})`;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Cache control headers handled by HTTP server
// No service worker registration needed

// Accessibility enhancements
function enhanceAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--dark-brown);
        color: var(--snow-white);
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });

    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main landmark to main content
    const main = document.querySelector('main');
    if (main) {
        main.id = 'main';
        main.setAttribute('role', 'main');
    }
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Error handling for production
window.addEventListener('error', function(e) {
    if (window.location.hostname !== 'localhost') {
        console.error('JavaScript Error:', e.error);
        // In production, you might want to send this to an error reporting service
    }
});

// Console styling for branding (development only)
if (window.location.hostname === 'localhost') {
    console.log(
        '%cRohindia%c\nWhere luxury meets the perfect cup ☕',
        'color: #D4AF37; font-size: 24px; font-weight: bold; font-family: Playfair Display, serif;',
        'color: #2C1810; font-size: 14px; font-family: Inter, sans-serif;'
    );
}

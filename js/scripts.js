document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Sticky Navbar on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100; // Trigger animation 100px before element is in view

        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };

    // Initial check on load
    revealOnScroll();

    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);

    // ==========================================
    // Form Validation Logic
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formErrors = document.getElementById('form-errors');
    
    // Initialize intl-tel-input
    const phoneInput = document.querySelector("#phone");
    let iti;
    if (phoneInput) {
        iti = window.intlTelInput(phoneInput, {
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/utils.js",
            initialCountry: "us",
            preferredCountries: ["us", "ca"],
        });
    }

    // Disposable email domains list (static)
    const disposableDomains = [
        "mailinator.com", "10minutemail.com", "guerrillamail.com", 
        "tempmail.com", "yopmail.com", "throwawaymail.com", "temp-mail.org",
        "emailondeck.com", "nada.ltd", "getnada.com", "trashmail.com", 
        "dispostable.com", "sharklasers.com", "anonaddy.com", "maildrop.cc"
    ];

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let errors = [];
            formErrors.innerHTML = '';
            formErrors.style.display = 'none';

            // 1. Email Validation (Disposable Check)
            const emailValue = document.getElementById('email').value.trim();
            const emailDomain = emailValue.split('@')[1];
            if (emailDomain && disposableDomains.includes(emailDomain.toLowerCase())) {
                errors.push("Disposable email addresses are not accepted. Please use a professional or personal email.");
            }

            // 2. Phone Validation
            const phoneValue = phoneInput.value.trim();
            if (phoneValue && iti) {
                // Check intl-tel-input structural validation
                if (!iti.isValidNumber()) {
                    errors.push("Please enter a valid phone number format.");
                } else {
                    // Check heuristics: No repeating 6+ same digits
                    const rawNumber = phoneValue.replace(/\D/g, ''); // strip non-digits
                    if (/(\d)\1{5,}/.test(rawNumber)) {
                        errors.push("The phone number provided appears to be invalid.");
                    }
                    // Check heuristics: No sequential sequences like 1234567
                    if (/1234567|2345678|3456789|9876543|8765432|7654321/.test(rawNumber)) {
                        errors.push("The phone number provided appears to be invalid.");
                    }
                }
            }

            // 3. Address Validation
            const addressValue = document.getElementById('property_addresses').value.trim().toLowerCase();
            if (addressValue) {
                if (addressValue.length < 10) {
                    errors.push("Please provide a complete property address.");
                }
                
                const hasLetters = /[a-z]/i.test(addressValue);
                const hasNumbers = /[0-9]/.test(addressValue);
                if (!hasLetters || !hasNumbers) {
                    errors.push("A valid property address must contain both numbers and letters.");
                }

                const junkAddresses = ["123 main street", "123 main st", "test", "n/a", "na", "none", "asdf", "1234 main st"];
                if (junkAddresses.includes(addressValue)) {
                    errors.push("Please enter a valid, real property address.");
                }
            }

            if (errors.length > 0) {
                e.preventDefault(); // Stop form submission
                
                // Display errors
                errors.forEach(err => {
                    const p = document.createElement('p');
                    p.textContent = err;
                    formErrors.appendChild(p);
                });
                formErrors.style.display = 'block';
                
                // Scroll to errors
                formErrors.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
});

// Scroll to top functionality
const scrollToTopBtn = document.getElementById("scroll-to-top");

window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add("visible");
    } else {
        scrollToTopBtn.classList.remove("visible");
    }
});

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

// Add animation to cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
        }
    });
}, observerOptions);

// Observe review cards
document.querySelectorAll(".card-hover").forEach((card) => {
    observer.observe(card);
});

// Add hover effect to social media icons in the carousel
const socialIcons = document.querySelectorAll(".social-carousel i");
socialIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", () => {
        icon.style.transform = "scale(1.2)";
        icon.style.transition = "transform 0.3s ease";
    });

    icon.addEventListener("mouseleave", () => {
        icon.style.transform = "scale(1)";
    });
});

// Simulate loading animation
document.addEventListener("DOMContentLoaded", () => {
    // Add a small delay to ensure all elements are loaded
    setTimeout(() => {
        document.querySelectorAll(".fade-in").forEach((el) => {
            el.style.animation = "fadeIn 0.8s ease-out";
        });
    }, 100);
});
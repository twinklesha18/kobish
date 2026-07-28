const body = document.body;
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = [...document.querySelectorAll(".nav-link[href^='#']")];
const themeToggle = document.getElementById("theme-toggle");
const scrollProgress = document.getElementById("scroll-progress");
const scrollTopButton = document.getElementById("scroll-top");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function closeMenu() {
    navMenu.classList.remove("open");
    body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    navToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
}

navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
        closeMenu();
        return;
    }

    navMenu.classList.add("open");
    body.classList.add("menu-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation menu");
    navToggle.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("open")) {
        closeMenu();
        navToggle.focus();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeMenu();
});

function updateScrollUI() {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;
    scrollProgress.style.width = `${Math.min(Math.max(percentage, 0), 100)}%`;
    scrollTopButton.classList.toggle("visible", window.scrollY > 650);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});

const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
}, {
    rootMargin: "-30% 0px -58% 0px",
    threshold: [0, 0.1, 0.25]
});

sections.forEach((section) => sectionObserver.observe(section));

const typedRole = document.getElementById("typed-role");
const roles = ["Graphic Designer", "UI Designer", "Web Developer", "Creative Freelancer"];

if (!prefersReducedMotion) {
    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = true;

    function typeRole() {
        const word = roles[roleIndex];
        typedRole.textContent = word.slice(0, Math.max(characterIndex, 0));

        if (deleting) {
            characterIndex -= 1;

            if (characterIndex < 0) {
                roleIndex = (roleIndex + 1) % roles.length;
                deleting = false;
                characterIndex = 0;
                window.setTimeout(typeRole, 400);
                return;
            }
        } else {
            characterIndex += 1;

            if (characterIndex > roles[roleIndex].length) {
                deleting = true;
                characterIndex = roles[roleIndex].length;
                window.setTimeout(typeRole, 1500);
                return;
            }
        }

        window.setTimeout(typeRole, deleting ? 48 : 88);
    }

    window.setTimeout(typeRole, 1900);
}

const readMoreButton = document.getElementById("read-more");
const aboutDescription = document.getElementById("about-description");

readMoreButton.addEventListener("click", () => {
    const expanded = readMoreButton.getAttribute("aria-expanded") === "true";
    aboutDescription.classList.toggle("expanded", !expanded);
    readMoreButton.setAttribute("aria-expanded", String(!expanded));
    readMoreButton.textContent = expanded ? "Read more" : "Show less";
});

const filterButtons = [...document.querySelectorAll(".filter-btn")];
const skillCards = [...document.querySelectorAll(".skill-card")];

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.toggle("active", item === button));

        skillCards.forEach((card) => {
            const visible = filter === "all" || card.dataset.category === filter;
            card.classList.toggle("hidden", !visible);

            if (visible && !prefersReducedMotion) {
                card.animate(
                    [
                        { opacity: 0, transform: "translateY(12px) scale(.98)" },
                        { opacity: 1, transform: "translateY(0) scale(1)" }
                    ],
                    { duration: 280, easing: "ease-out" }
                );
            }
        });
    });
});

const revealElements = [
    ...document.querySelectorAll(
        ".section-header, .about-left, .journey-card, .skill-card, .project-card, " +
        ".experience-group-heading, .experience-card, .contact-info, .contact-form"
    )
];

if (!prefersReducedMotion) {
    revealElements.forEach((element) => {
        element.classList.add("reveal");
        const siblings = [...element.parentElement.children];
        element.style.setProperty("--delay", `${Math.min(siblings.indexOf(element) * 75, 225)}ms`);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -7% 0px"
    });

    revealElements.forEach((element) => revealObserver.observe(element));
}

function applyTheme(theme) {
    const dark = theme === "dark";
    body.classList.toggle("dark-theme", dark);
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.querySelector("i").className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    document.querySelector('meta[name="theme-color"]').setAttribute("content", dark ? "#061112" : "#f2f8f8");
}

const savedTheme = localStorage.getItem("kobisha-theme-v2");
applyTheme(savedTheme || "dark");

themeToggle.addEventListener("click", () => {
    const nextTheme = body.classList.contains("dark-theme") ? "light" : "dark";
    localStorage.setItem("kobisha-theme-v2", nextTheme);
    applyTheme(nextTheme);
});

const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");
    const emailSubject = encodeURIComponent(`${subject} — portfolio enquiry from ${name}`);
    const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    window.location.href = `mailto:kobish2003@gmail.com?subject=${emailSubject}&body=${emailBody}`;
});

document.getElementById("year").textContent = new Date().getFullYear();

const canvas = document.getElementById("canvas-bg");
const context = canvas.getContext("2d");
let particles = [];
let animationFrame;

function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(65, Math.max(28, Math.floor(window.innerWidth / 24)));
    particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24
    }));
}

function drawCanvas() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = body.classList.contains("dark-theme")
        ? "rgba(72, 207, 203, 0.58)"
        : "rgba(45, 126, 128, 0.46)";

    particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -5) particle.x = window.innerWidth + 5;
        if (particle.x > window.innerWidth + 5) particle.x = -5;
        if (particle.y < -5) particle.y = window.innerHeight + 5;
        if (particle.y > window.innerHeight + 5) particle.y = -5;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
    });

    for (let first = 0; first < particles.length; first += 1) {
        for (let second = first + 1; second < particles.length; second += 1) {
            const dx = particles[first].x - particles[second].x;
            const dy = particles[first].y - particles[second].y;
            const distance = Math.hypot(dx, dy);

            if (distance >= 140) continue;

            const opacity = (1 - distance / 140) * (body.classList.contains("dark-theme") ? 0.28 : 0.2);
            context.strokeStyle = `rgba(77, 166, 168, ${opacity})`;
            context.lineWidth = 0.7;
            context.beginPath();
            context.moveTo(particles[first].x, particles[first].y);
            context.lineTo(particles[second].x, particles[second].y);
            context.stroke();
        }
    }

    animationFrame = window.requestAnimationFrame(drawCanvas);
}

resizeCanvas();

if (!prefersReducedMotion) {
    drawCanvas();
} else {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

let resizeTimer;
window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resizeCanvas, 160);
}, { passive: true });

window.addEventListener("beforeunload", () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
});

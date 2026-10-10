/* =========================================
   JAPOLIC — MAIN JAVASCRIPT
========================================= */

"use strict";


/* =========================================
   1. SELECT ELEMENTS
========================================= */

const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const dashboardNodes = document.querySelectorAll(".hero-visual .node");


/* =========================================
   2. HEADER SCROLL EFFECT
========================================= */

function updateHeader() {
    if (!siteHeader) return;

    siteHeader.classList.toggle(
        "scrolled",
        window.scrollY > 20
    );
}

/* Set correct header state on initial load */
updateHeader();

/* Update header while scrolling */
window.addEventListener("scroll", updateHeader, {
    passive: true
});


/* =========================================
   3. MOBILE NAVIGATION
========================================= */

function closeMobileMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("mobile-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );
}

function openMobileMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.add("mobile-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute(
        "aria-label",
        "Close navigation menu"
    );
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    /* Close menu when a navigation link is selected */
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    /* Close menu when Escape is pressed */
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    /* Close menu when clicking outside the navigation */
    document.addEventListener("click", (event) => {
        const clickedInsideMenu =
            navLinks.contains(event.target);

        const clickedToggle =
            menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMobileMenu();
        }
    });

    /* Reset menu when returning to desktop layout */
    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMobileMenu();
        }
    });
}


/* =========================================
   4. DASHBOARD NODE ANIMATION
========================================= */

const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

function animateDashboardNodes() {
    if (reducedMotionQuery.matches) return;

    if (typeof Element.prototype.animate !== "function") {
        return;
    }

    dashboardNodes.forEach((node, index) => {
        /*
         * The core node is horizontally centered in CSS.
         * Preserve that positioning while animating vertically.
         */
        const isCoreNode = node.classList.contains("node-core");

        const startTransform = isCoreNode
            ? "translate(-50%, 0)"
            : "translateY(0)";

        const middleTransform = isCoreNode
            ? "translate(-50%, -5px)"
            : "translateY(-5px)";

        node.animate(
            [
                { transform: startTransform },
                { transform: middleTransform },
                { transform: startTransform }
            ],
            {
                duration: 2800 + index * 350,
                iterations: Infinity,
                easing: "ease-in-out"
            }
        );
    });
}

animateDashboardNodes();


/* =========================================
   5. HANDLE REDUCED-MOTION CHANGES
========================================= */

function handleMotionPreferenceChange(event) {
    if (event.matches) {
        /*
         * Stop running animations if the visitor
         * enables reduced motion in their system settings.
         */
        dashboardNodes.forEach((node) => {
            node.getAnimations().forEach((animation) => {
                animation.cancel();
            });
        });
    } else {
        /*
         * Restart animations when reduced motion is disabled.
         */
        dashboardNodes.forEach((node) => {
            node.getAnimations().forEach((animation) => {
                animation.cancel();
            });
        });

        animateDashboardNodes();
    }
}

if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener(
        "change",
        handleMotionPreferenceChange
    );
}
const menuToggle = document.querySelector(".mobile-menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const siteHeader = document.querySelector(".site-header");
const sectionNavs = [...document.querySelectorAll(".section-nav")];

const syncHeaderState = () => {
    if (!siteHeader) {
        return;
    }

    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
};

const syncLayoutMetrics = () => {
    const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
    const sectionNavHeight = sectionNavs.reduce(
        (maxHeight, nav) => Math.max(maxHeight, nav.offsetHeight),
        0
    );

    document.documentElement.style.setProperty("--site-header-height", `${headerHeight}px`);
    document.documentElement.style.setProperty("--section-nav-height", `${sectionNavHeight}px`);
};

const syncChromeState = () => {
    syncHeaderState();
    syncLayoutMetrics();
};

syncChromeState();
window.addEventListener("scroll", syncHeaderState, { passive: true });
window.addEventListener("resize", syncChromeState);
window.addEventListener("load", syncLayoutMetrics);

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncLayoutMetrics);
}

if (menuToggle && navMenu) {
    const closeMenu = () => {
        navMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 860) {
            closeMenu();
        }
    });
}

const revealTargets = [
    ...document.querySelectorAll(
        ".hero-image, .info-card, .news-item, .pub-item, .grouped-list"
    ),
];

revealTargets.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => {
        element.classList.add("is-visible");
    });
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.01,
            rootMargin: "0px 0px -6% 0px",
        }
    );

    revealTargets.forEach((element) => {
        revealObserver.observe(element);
    });
}

const setActiveSectionLink = (links, activeLink) => {
    links.forEach((link) => {
        const isActive = link === activeLink;
        link.classList.toggle("is-active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
            return;
        }

        link.removeAttribute("aria-current");
    });
};

const sectionNavItems = sectionNavs
    .map((nav) => {
        const links = [...nav.querySelectorAll('a[href^="#"]')];
        const items = links
            .map((link) => {
                const target = document.querySelector(link.getAttribute("href"));
                return target ? { link, target } : null;
            })
            .filter(Boolean);

        return items.length > 0 ? { links, items } : null;
    })
    .filter(Boolean);

const syncSectionNavState = () => {
    if (sectionNavItems.length === 0) {
        return;
    }

    const headerOffset = siteHeader ? siteHeader.offsetHeight : 0;
    const sectionNavOffset = sectionNavs.reduce(
        (maxHeight, nav) => Math.max(maxHeight, nav.offsetHeight),
        0
    );
    const threshold = headerOffset + sectionNavOffset + 28;

    sectionNavItems.forEach(({ links, items }) => {
        let activeLink = items[0].link;

        items.forEach(({ link, target }) => {
            if (target.getBoundingClientRect().top <= threshold) {
                activeLink = link;
            }
        });

        setActiveSectionLink(links, activeLink);
    });
};

if (sectionNavItems.length > 0) {
    syncSectionNavState();
    window.addEventListener("scroll", syncSectionNavState, { passive: true });
    window.addEventListener("resize", syncSectionNavState);

    sectionNavItems.forEach(({ links }) => {
        links.forEach((link) => {
            link.addEventListener("click", () => {
                setActiveSectionLink(links, link);
            });
        });
    });
}

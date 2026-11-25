if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => console.log("SW registrato:", reg))
      .catch((err) => console.error("SW fallito:", err));
  });
}

// stesso breakpoint usato nel CSS per la versione mobile
const MOBILE_MQ = window.matchMedia("(max-width: 768px)");

const SKILL_CATEGORIES = [
  { key: "web-backend", title: "Core Web & Backend", short: "Web & Backend" },
  { key: "iot-embedded", title: "IoT, Embedded & Robotics", short: "IoT & Robotics" },
  { key: "mobile-game", title: "Mobile & Game Dev", short: "Mobile & Games" },
  { key: "systems-tools", title: "Systems, Tools & Workflow", short: "Tools" },
];

fetch("skills.json")
  .then((res) => res.json())
  .then((skills) => {
    const container = document.getElementById("skills-grid");

    // tab per le categorie (visibili solo su mobile)
    const tabs = document.createElement("div");
    tabs.classList.add("skills-tabs");
    tabs.setAttribute("role", "tablist");

    const renderTag = (skill) => `
      <div class="skill-tag" title="${skill.description}">
        <span class="skill-tag-icon">${skill.svg}</span>
        <span class="skill-tag-name">${skill.name}</span>
      </div>
    `;

    const setActiveCategory = (key) => {
      container.querySelectorAll(".skills-group").forEach((g) =>
        g.classList.toggle("is-active", g.dataset.key === key)
      );
      tabs.querySelectorAll(".skills-tab").forEach((t) => {
        const active = t.dataset.key === key;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active);
      });
    };

    let firstKey = null;

    SKILL_CATEGORIES.forEach((category) => {
      const items = skills.filter((s) => s.category === category.key);
      if (!items.length) return;
      if (!firstKey) firstKey = category.key;

      const group = document.createElement("div");
      group.classList.add("skills-group");
      group.dataset.key = category.key;
      group.innerHTML = `
        <h4 class="skills-group-title">${category.title}</h4>
        <div class="skills-tags">
          ${items.map(renderTag).join("")}
        </div>
      `;
      container.appendChild(group);

      const tab = document.createElement("button");
      tab.type = "button";
      tab.classList.add("skills-tab");
      tab.dataset.key = category.key;
      tab.setAttribute("role", "tab");
      tab.innerHTML = `${category.short}<span class="skills-tab-count">${items.length}</span>`;
      tab.addEventListener("click", () => {
        setActiveCategory(category.key);
        tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });
      tabs.appendChild(tab);
    });

    container.before(tabs);
    if (firstKey) setActiveCategory(firstKey);
  })
  .catch((err) => console.error("Err caricamento skills:", err));


fetch("projects.json")
  .then((res) => res.json())
  .then((projects) => {
    const container = document.getElementById("projects-grid");
    const dotsContainer = document.getElementById("projects-dots");
    const seeMoreBtn = document.querySelector(".see-more-btn");

    const INITIAL_COUNT = 4; // quanti progetti sono mostrati all'inizio (desktop)
    const LOAD_STEP = 4;     // quanti caricarne ogni click
    let currentIndex = INITIAL_COUNT;
    let dotsObserver = null;

    const renderTechnologies = (technologies = []) =>
      `<div class="project-tech">
        ${technologies.map((t) => `<span class="tech-badge">${t}</span>`).join("")}
      </div>`;

    const renderProject = (project, index) => {
      const content = `
        <h4 class="project-title">
          ${project.name}
          ${project.state === "new" ? '<span class="project-badge">NEW</span>' : ""}
        </h4>
        <p class="project-desc">${project.description}</p>
        ${renderTechnologies(project.technologies)}
      `;
      // progetti senza repository pubblico: card non cliccabile
      return project.repository
        ? `<a href="${project.repository}" target="_blank" class="project-link">${content}</a>`
        : `<div class="project-link is-static">${content}</div>`;
    };

    const createCard = (project, index, ...classes) => {
      const card = document.createElement("div");
      card.classList.add("project-card", ...classes);
      card.innerHTML = renderProject(project, index);
      return card;
    };

    /* ===== CONTENITORE PER I PROGETTI EXTRA (desktop) ===== */

    const extraContainer = document.createElement("div");
    extraContainer.classList.add("projects-extra");
    container.after(extraContainer);

    const resetLayout = () => {
      if (dotsObserver) dotsObserver.disconnect();
      dotsObserver = null;
      container.innerHTML = "";
      extraContainer.innerHTML = "";
      dotsContainer.innerHTML = "";
      container.classList.remove("is-carousel");
      container.scrollLeft = 0;
    };

    /* ===== DESKTOP: layout a griglia ===== */

    const renderDesktop = () => {
      resetLayout();

      if (projects[0]) container.appendChild(createCard(projects[0], 0, "project1"));
      if (projects[1]) container.appendChild(createCard(projects[1], 1, "project2"));

      const subgrid = document.createElement("div");
      subgrid.classList.add("project-subgrid");
      projects
        .slice(2, INITIAL_COUNT)
        .forEach((project, i) => subgrid.appendChild(createCard(project, i + 2)));
      container.appendChild(subgrid);

      currentIndex = INITIAL_COUNT;
      seeMoreBtn.style.display = projects.length > INITIAL_COUNT ? "" : "none";
    };

    /* ===== MOBILE: carosello orizzontale ===== */

    const renderMobile = () => {
      resetLayout();
      container.classList.add("is-carousel");

      const cards = projects.map((project, i) => {
        const card = createCard(project, i);
        container.appendChild(card);

        const dot = document.createElement("button");
        dot.type = "button";
        dot.tabIndex = -1;
        dot.classList.add("projects-dot");
        dot.addEventListener("click", () => {
          container.scrollTo({
            left: card.offsetLeft - container.offsetLeft - parseFloat(getComputedStyle(container).paddingLeft),
            behavior: "smooth",
          });
        });
        dotsContainer.appendChild(dot);
        return card;
      });

      const dots = [...dotsContainer.children];
      if (dots[0]) dots[0].classList.add("is-active");

      if ("IntersectionObserver" in window) {
        dotsObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const idx = cards.indexOf(entry.target);
              dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
            });
          },
          { root: container, threshold: 0.6 }
        );
        cards.forEach((card) => dotsObserver.observe(card));
      }
    };

    const renderLayout = () => (MOBILE_MQ.matches ? renderMobile() : renderDesktop());
    renderLayout();
    MOBILE_MQ.addEventListener("change", renderLayout);

    /* ===== SEE MORE (desktop) ===== */

    seeMoreBtn.addEventListener("click", () => {
      projects
        .slice(currentIndex, currentIndex + LOAD_STEP)
        .forEach((project, i) =>
          extraContainer.appendChild(createCard(project, currentIndex + i))
        );

      currentIndex += LOAD_STEP;

      // se non ci sono più progetti, nascondi il bottone
      if (currentIndex >= projects.length) {
        seeMoreBtn.style.display = "none";
      }
    });
  })
  .catch((err) => console.error("Err caricamento projects:", err));


/* ===== NAV MOBILE ===== */

const mobileNav = document.querySelector(".mobile-nav");

if (mobileNav) {
  const toggleNav = () =>
    mobileNav.classList.toggle("is-visible", window.scrollY > 240);
  toggleNav();
  window.addEventListener("scroll", toggleNav, { passive: true });
}

if ("IntersectionObserver" in window) {
  // evidenzia la sezione corrente nella nav
  const navLinks = mobileNav ? [...mobileNav.querySelectorAll("a")] : [];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${entry.target.id}`
          )
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) sectionObserver.observe(section);
  });
}


const copyBtn = document.getElementById('copy-email');
const emailText = document.getElementById('email-text');

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(emailText.textContent).then(() => {
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy", 1500);
  });
});

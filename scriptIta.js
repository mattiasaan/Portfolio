if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => console.log("SW registrato:", reg))
      .catch((err) => console.error("SW fallito:", err));
  });
}


const SKILL_CATEGORIES = [
  { key: "web-backend", title: "Core Web & Backend" },
  { key: "iot-embedded", title: "IoT, Embedded & Robotics" },
  { key: "mobile-game", title: "Mobile & Game Dev" },
  { key: "systems-tools", title: "Systems, Tool & Workflow" },
];


fetch("skillsIta.json")
  .then((res) => res.json())
  .then((skills) => {
    const container = document.getElementById("skills-grid");

    const renderTag = (skill) => `
      <div class="skill-tag" title="${skill.description}">
        <span class="skill-tag-icon">${skill.svg}</span>
        <span class="skill-tag-name">${skill.name}</span>
      </div>
    `;

    SKILL_CATEGORIES.forEach((category) => {
      const items = skills.filter((s) => s.category === category.key);
      if (!items.length) return;

      const group = document.createElement("div");
      group.classList.add("skills-group");
      group.innerHTML = `
        <h4 class="skills-group-title">${category.title}</h4>
        <div class="skills-tags">
          ${items.map(renderTag).join("")}
        </div>
      `;

      container.appendChild(group);
    });
  })
  .catch((err) => console.error("Err caricamento skills:", err));

fetch("projectsIta.json")
  .then((res) => res.json())
  .then((projects) => {
    const container = document.getElementById("projects-grid");
    const seeMoreBtn = document.querySelector(".see-more-btn");

    let currentIndex = 4; // quanti progetti sono già mostrati
    const LOAD_STEP = 4;  // quanti caricarne ogni click

    const renderTechnologies = (technologies = []) =>
      `<div class="project-tech">
        ${technologies.map((t) => `<span class="tech-badge">${t}</span>`).join("")}
      </div>`;

    const renderProject = (project) => `
      <a href="${project.repository}" target="_blank" class="project-link">
        <h4 class="project-title">
          ${project.name}
          ${project.state === "new" ? '<span class="project-badge">NEW</span>' : ""}
        </h4>
        <p class="project-desc">${project.description}</p>
        ${renderTechnologies(project.technologies)}
      </a>
    `;

    /* ===== PRIMI PROGETTI (layout speciale) ===== */

    if (projects[0]) {
      const project1 = document.createElement("div");
      project1.classList.add("project1", "project-card");
      project1.innerHTML = renderProject(projects[0]);
      container.appendChild(project1);
    }

    if (projects[1]) {
      const project2 = document.createElement("div");
      project2.classList.add("project2", "project-card");
      project2.innerHTML = renderProject(projects[1]);
      container.appendChild(project2);
    }

    const subgrid = document.createElement("div");
    subgrid.classList.add("project-subgrid");

    projects.slice(2, 4).forEach((project) => {
      const card = document.createElement("div");
      card.classList.add("project-card");
      card.innerHTML = renderProject(project);
      subgrid.appendChild(card);
    });

    container.appendChild(subgrid);

    /* ===== CONTENITORE PER I PROGETTI EXTRA ===== */

    const extraContainer = document.createElement("div");
    extraContainer.classList.add("projects-extra");
    container.after(extraContainer);

    /* ===== SEE MORE ===== */

    seeMoreBtn.addEventListener("click", () => {
      const nextProjects = projects.slice(
        currentIndex,
        currentIndex + LOAD_STEP
      );

      nextProjects.forEach((project) => {
        const card = document.createElement("div");
        card.classList.add("project-card");
        card.innerHTML = renderProject(project);
        extraContainer.appendChild(card);
      });

      currentIndex += LOAD_STEP;

      // se non ci sono più progetti, nascondi il bottone
      if (currentIndex >= projects.length) {
        seeMoreBtn.style.display = "none";
      }
    });
  })
  .catch((err) => console.error("Err caricamento projects:", err));






  const copyBtn = document.getElementById('copy-email');
  const emailText = document.getElementById('email-text');

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailText.textContent).then(() => {
      copyBtn.textContent = "Copiato!";
      setTimeout(() => copyBtn.textContent = "Copy", 1500);
    });
  });

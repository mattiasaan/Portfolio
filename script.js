if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("SW registrato:", reg))
      .catch((err) => console.error("SW fallito:", err));
  });
}


fetch("skills.json")
  .then((res) => res.json())
  .then((skills) => {
    const container = document.getElementById("skills-grid");
    skills.forEach((skill) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
          <div class="card-icon">${skill.svg}</div>
          <div class="card-content">
            <h4>${skill.name}</h4>
            <p>${skill.description}</p>
          </div>
        `;
      container.appendChild(card);
    });
  })
  .catch((err) => console.error("Err caricamento skills:", err));


fetch("projects.json")
  .then((res) => res.json())
  .then((projects) => {
    const container = document.getElementById("projects-grid");

    // funzione helper per generare badge tecnologie
    const renderTechnologies = (technologies = []) =>
      `<div class="project-tech">
        ${technologies.map((t) => `<span class="tech-badge">${t}</span>`).join("")}
      </div>`;

    // funzione helper per renderizzare un progetto
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

    //1
    if (projects[0]) {
      const project1 = document.createElement("div");
      project1.classList.add("project1", "project-card");
      project1.innerHTML = renderProject(projects[0]);
      container.appendChild(project1);
    }

    //2
    if (projects[1]) {
      const project2 = document.createElement("div");
      project2.classList.add("project2", "project-card");
      project2.innerHTML = renderProject(projects[1]);
      container.appendChild(project2);
    }

    //3-4 in subgrid
    const subgrid = document.createElement("div");
    subgrid.classList.add("project-subgrid");

    projects.slice(2).forEach((project) => {
      const card = document.createElement("div");
      card.classList.add("project-card");
      card.innerHTML = renderProject(project);
      subgrid.appendChild(card);
    });

    container.appendChild(subgrid);
  })
  .catch((err) => console.error("Err caricamento projects:", err));





  const copyBtn = document.getElementById('copy-email');
  const emailText = document.getElementById('email-text');

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailText.textContent).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => copyBtn.textContent = "Copy", 1500);
    });
  });

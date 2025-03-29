document.addEventListener("DOMContentLoaded", () => {
const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

if (!projectId) {
    document.body.innerHTML = "<h1>Progetto non trovato</h1>";
    return;
}

fetch("projects.json")
    .then(response => {
        if (!response.ok) throw new Error("Errore nel caricamento dei dati");
        return response.json();
    })
    .then(data => {
        const project = data.find(p => p.id === projectId);
        if (project) {
            document.getElementById("project-id").textContent = project.id;
            document.getElementById("project-title").textContent = project.title;
            document.getElementById("project-description").innerHTML = project.description;
            document.getElementById("project-image").src = project.image;
            document.getElementById("project-github").href = project.github;
            document.getElementById("project-download").href = project.download;
            
        } else {
            document.body.innerHTML = "<h1>Progetto non trovato</h1>";
        }
    })
    .catch(error => console.error("Errore nel caricamento dei dettagli del progetto:", error));
});

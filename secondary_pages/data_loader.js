document.addEventListener("DOMContentLoaded", () => {
const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

if (!projectId) {
    document.body.innerHTML = "<h1>Project not found</h1>";
    return;
}

fetch("projects.json")
    .then(response => {
        if (!response.ok) throw new Error("Error during data loading");
        return response.json();
    })
    .then(data => {
        const project = data.find(p => p.id === projectId);
        if (project) {
            document.getElementById("project-id").textContent = project.id;
            document.getElementById("project-title").textContent = project.title;
            document.getElementById("project-description").innerHTML = project.description;
            document.getElementById("project-image").src = project.image;
            document.getElementById("project-github").addEventListener("click", () => {
                window.open(project.github, "_blank");
            });
            document.getElementById("project-download").addEventListener("click", () => {
                window.open(project.download, "_blank");
            });
            
        } else {
            document.body.innerHTML = "<h1>Project not found</h1>";
        }
    })
    .catch(error => console.error("Error loading project details:", error));
});

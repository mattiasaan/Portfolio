const links = document.querySelectorAll(".works");
const hoverCard = document.getElementById("hoverCard");
const cardTitle = document.getElementById("cardTitle");
const cardDescription = document.getElementById("cardDescription");
const worksContainer = document.querySelector(".works-container");

let mouseX = 0,
  mouseY = 0;
let cardX = 0,
  cardY = 0;
const delay = 0.08; // ritardo
const offsetX = 185,
  offsetY = 75; // Offset orizzontale verticale

function getClosestElement(x, y) {
  let closest = null;
  let minDistance = Infinity;

  links.forEach((link) => {
    const rect = link.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

    if (distance < minDistance) {
      minDistance = distance;
      closest = link;
    }
  });

  return closest;
}

function changeText(newTitle, newDescription) {
  if (
    cardTitle.textContent !== newTitle ||
    cardDescription.textContent !== newDescription
  ) {
    cardTitle.style.opacity = "0";
    cardDescription.style.opacity = "0";

    setTimeout(() => {
      cardTitle.textContent = newTitle;
      cardDescription.textContent = newDescription;

      cardTitle.style.opacity = "1";
      cardDescription.style.opacity = "1";
    }, 200); // Tempo dissolvenza
  }
}

function animate() {
  cardX += (mouseX - cardX) * delay;
  cardY += (mouseY - cardY) * delay;

  // Limiti card
  const cardWidth = 200;
  const cardHeight = 200;

  const maxX = window.innerWidth - cardWidth;
  const maxY = window.innerHeight - cardHeight;

  cardX = Math.max(0, Math.min(cardX, maxX));
  cardY = Math.max(0, Math.min(cardY, maxY));

  hoverCard.style.left = `${cardX}px`;
  hoverCard.style.top = `${cardY}px`;

  requestAnimationFrame(animate);
}

animate();

// Gestione movimento
worksContainer.addEventListener("mousemove", (event) => {
  mouseX = event.clientX + offsetX;
  mouseY = event.clientY + offsetY;

  const closest = getClosestElement(event.clientX, event.clientY);

  if (closest) {
    changeText(
      closest.getAttribute("data-title"),
      closest.getAttribute("data-description")
    );
    hoverCard.classList.add("show");
  }
});

// uscita dall' area
worksContainer.addEventListener("mouseleave", () => {
  hoverCard.classList.remove("show");
});




function copyEmail() {
  let email = "your.email@example.com";
  let tempInput = document.createElement("input");
  document.body.appendChild(tempInput);
  tempInput.value = email;
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  showPopup();
}

function showPopup() {
  let popup = document.getElementById("popup");
  popup.style.display = "block";
}

function closePopup() {
  let popup = document.getElementById("popup");
  popup.style.display = "none";
}

function openGmail() {
  window.open("https://mail.google.com/mail/?view=cm&fs=1&to=mattiasan0408@gmail.com", "_blank");
  closePopup();
}


//per works
document.addEventListener("DOMContentLoaded", () => {
  const projectLinks = document.querySelectorAll(".works");

  projectLinks.forEach(link => {
      const projectId = link.dataset.id;
      if (projectId) {
          link.href = `secondary_pages/works.html?id=${projectId}`;
      }
  });
});


//render skills
const skills = [
  { name: "HTML 5 - CSS", img: "Images/HTML 5 -CSS logo.png", alt: "html-css" },
  { name: "Javascript", img: "Images/javascript logo.png", alt: "js" },
  { name: "React native", img: "Images/react native logo.png", alt: "Rn" },
  { name: "Figma design", img: "Images/figma_logo.png", alt: "Figma" },
  { name: "Algorithms", img: "Images/algoritmo.png", alt: "alg" },
  { name: "C++", img: "Images/cpp_logo.png", alt: "cpp" },
  { name: "Unreal engine", img: "Images/unreal-engine-logo.png", alt: "unreal-engine" },
  { name: "Python", img: "Images/python logo.png", alt: "py" },
  { name: "SQL database", img: "Images/SQL_logo.png", alt: "sql" },
  { name: "Git bash", img: "Images/git-logo.png", alt: "git" }
];

function renderSkills(skills) {
  const container = document.getElementById("skills-container");
  skills.forEach(skill => {
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("card");
    cardWrapper.innerHTML = `
      <div class="card-front">
        <img src="${skill.img}" alt="${skill.alt}" class="img-card">
      </div>
      <div class="card-back">
        <h3>${skill.name}</h3>
      </div>
    `;
    container.appendChild(cardWrapper);
  });
}

renderSkills(skills)
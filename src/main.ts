import type { CourseInfo } from './models/Course';
import './scss/main.scss';

// hämta data från localStorage
let courses: CourseInfo[] = JSON.parse(localStorage.getItem("courses") || "[]");

const courseForm = document.querySelector("#course-form") as HTMLFormElement;
const courseTable = document.querySelector("#course-tbody") as HTMLTableSectionElement;


// funktion för att spara
function saveToStorage(): void {
  localStorage.setItem("courses", JSON.stringify(courses));
  displayCourses();
}

// funktion för att visa kurser
function displayCourses(): void {

  courseTable.innerHTML = "";

  courses.forEach((course, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
  <td>${course.code}</td>
  <td>${course.name}</td>
  <td><span class="progression">${course.progression}</span></td>
  <td><a href="${course.syllabus}" target="_blank" class="link-btn" title="Visa kursplan">Kursplan</a></td>
  <td>
  <button class="delete-btn" data-index="${index}" title="Radera kurs">🗑️</button>
  </td>
  `;

    courseTable.appendChild(row);
  });

  setupDeleteListeners();

}

function setupDeleteListeners(): void {
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const index = parseInt(target.getAttribute("data-index") || "0");
      deleteCourse(index);
    });
  });
}


// funktion för att lägga till
function addCourse(code: string, name: string, progression: string, syllabus: string): void {
  //validering
  if (courses.some(c => c.code === code)) {
    alert("Kurskoden måste vara unik!");
    return;
  }

  const newCourse: CourseInfo = {
    code,
    name,
    progression: progression as 'A' | 'B' | 'C',
    syllabus
  };

  courses.push(newCourse);
  saveToStorage();
}

function deleteCourse(index: number): void {
  const confirmDelete = confirm("Är du säker på att du vill radera kursen?");

  if (confirmDelete) {
  courses.splice(index, 1);
  saveToStorage();
  }
}

// eventlyssnare för formulär
courseForm.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  const code = (document.querySelector("#code") as HTMLInputElement).value;
  const name = (document.querySelector("#name") as HTMLInputElement).value;
  const progression = (document.querySelector("#progression") as HTMLSelectElement).value;
  const syllabus = (document.querySelector("#syllabus") as HTMLInputElement).value;

  if (code && name && progression && syllabus) {
    addCourse(code, name, progression, syllabus);
    courseForm.reset();
  }
});

// starta
displayCourses();

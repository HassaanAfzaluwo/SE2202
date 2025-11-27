// ======== Course class ========

class Course {
  constructor(raw, index) {
    this.id = raw.id;
    this.title = raw.title;
    this.department = raw.department;
    this.level = raw.level;
    this.credits = raw.credits;
    this.instructor = raw.instructor ?? "TBA";
    this.description = raw.description;
    this.semester = raw.semester; // "Fall 2026"
    this.originalIndex = index;   // used for "None" sorting
  }

  getSemesterKey() {
    const parts = String(this.semester).split(" ");
    const season = parts[0];
    const year = Number(parts[1]) || 0;
    const order = { Winter: 1, Spring: 2, Summer: 3, Fall: 4 };
    return year * 10 + (order[season] || 0);
  }
}

// ======== State ========

let allCourses = [];
let filteredCourses = [];

const filters = {
  department: "",
  level: "",
  credits: "",
  instructor: ""
};

let sortMode = "none";

// ======== DOM ========

const fileInput = document.getElementById("file-input");
const errorBox = document.getElementById("error-box");

const deptSelect = document.getElementById("filter-department");
const levelSelect = document.getElementById("filter-level");
const creditsSelect = document.getElementById("filter-credits");
const instrSelect = document.getElementById("filter-instructor");
const sortSelect = document.getElementById("sort-by");

const listEl = document.getElementById("course-list");
const detailsEl = document.getElementById("course-details");

// ======== Helpers ========

function showError(msg) {
  errorBox.textContent = msg;
}

function clearError() {
  errorBox.textContent = "";
}

// Build options using Set
function fillOptions(selectEl, values) {
  while (selectEl.options.length > 1) {
    selectEl.remove(1);
  }
  const set = new Set(values.filter(v => v !== null && v !== undefined));
  for (const val of set) {
    const opt = document.createElement("option");
    opt.value = String(val);
    opt.textContent = String(val);
    selectEl.appendChild(opt);
  }
}

function updateFilterOptions() {
  fillOptions(deptSelect, allCourses.map(c => c.department));
  fillOptions(levelSelect, allCourses.map(c => c.level));
  fillOptions(creditsSelect, allCourses.map(c => c.credits));
  fillOptions(instrSelect, allCourses.map(c => c.instructor));
}

// Apply all filters with Array.filter (required)
function applyFilters() {
  filteredCourses = allCourses.filter(c => {
    const matchDept =
      !filters.department || c.department === filters.department;
    const matchLevel =
      !filters.level || String(c.level) === filters.level;
    const matchCredits =
      !filters.credits || String(c.credits) === filters.credits;
    const matchInstr =
      !filters.instructor || c.instructor === filters.instructor;
    return matchDept && matchLevel && matchCredits && matchInstr;
  });
}

// Apply sort with Array.sort
function applySort() {
  const mode = sortMode;

  filteredCourses.sort((a, b) => {
    if (mode === "none") {
      return a.originalIndex - b.originalIndex;
    }

    if (mode === "id-asc") {
      return a.id.localeCompare(b.id);
    }
    if (mode === "id-desc") {
      return b.id.localeCompare(a.id);
    }
    if (mode === "title-asc") {
      return a.title.localeCompare(b.title);
    }
    if (mode === "title-desc") {
      return b.title.localeCompare(a.title);
    }
    if (mode === "semester-asc") {
      return a.getSemesterKey() - b.getSemesterKey();
    }
    if (mode === "semester-desc") {
      return b.getSemesterKey() - a.getSemesterKey();
    }
    return 0;
  });
}

function renderList() {
  listEl.innerHTML = "";

  if (filteredCourses.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No courses match the selected filters.";
    listEl.appendChild(li);
    return;
  }

  filteredCourses.forEach(course => {
    const li = document.createElement("li");
    li.className = "course-item";

    const span = document.createElement("span");
    span.className = "course-id";
    span.textContent = course.id;

    li.appendChild(span);

    li.addEventListener("click", () => {
      renderDetails(course);
    });

    listEl.appendChild(li);
  });
}

function renderDetails(course) {
  detailsEl.innerHTML = "";

  const h3 = document.createElement("h3");
  h3.textContent = course.id;
  detailsEl.appendChild(h3);

  const rows = [
    ["Title", course.title],
    ["Department", course.department],
    ["Level", course.level],
    ["Credits", course.credits],
    ["Instructor", course.instructor],
    ["Semester", course.semester]
  ];

  rows.forEach(([label, value]) => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${label}:</strong> ${value}`;
    detailsEl.appendChild(p);
  });

  const descP = document.createElement("p");
  descP.textContent = course.description;
  detailsEl.appendChild(descP);
}

// ======== Event handlers ========

// File loading with FileReader
fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  // basic extension check, to show "Invalid JSON file format." like screenshot
  if (!file.name.toLowerCase().endsWith(".json")) {
    showError("Invalid JSON file format.");
    allCourses = [];
    filteredCourses = [];
    listEl.innerHTML = "";
    detailsEl.innerHTML = "<p>Select a course to see details.</p>";
    return;
  }

  const reader = new FileReader();

  reader.onload = evt => {
    try {
      const text = evt.target.result;
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error("not array");
      }

      clearError();
      allCourses = data.map((obj, index) => new Course(obj, index));
      filters.department = filters.level = filters.credits = filters.instructor = "";
      deptSelect.value = "";
      levelSelect.value = "";
      creditsSelect.value = "";
      instrSelect.value = "";
      sortMode = "none";
      sortSelect.value = "none";

      updateFilterOptions();
      applyFilters();
      applySort();
      renderList();
      detailsEl.innerHTML = "<p>Select a course to see details.</p>";
    } catch (err) {
      console.error(err);
      showError("Invalid JSON file format.");
      allCourses = [];
      filteredCourses = [];
      listEl.innerHTML = "";
      detailsEl.innerHTML = "<p>Select a course to see details.</p>";
    }
  };

  reader.onerror = () => {
    showError("Could not read file.");
  };

  reader.readAsText(file);
});

// Filter changes
deptSelect.addEventListener("change", () => {
  filters.department = deptSelect.value;
  applyFilters();
  applySort();
  renderList();
});

levelSelect.addEventListener("change", () => {
  filters.level = levelSelect.value;
  applyFilters();
  applySort();
  renderList();
});

creditsSelect.addEventListener("change", () => {
  filters.credits = creditsSelect.value;
  applyFilters();
  applySort();
  renderList();
});

instrSelect.addEventListener("change", () => {
  filters.instructor = instrSelect.value;
  applyFilters();
  applySort();
  renderList();
});

// Sort change
sortSelect.addEventListener("change", () => {
  sortMode = sortSelect.value;
  applySort();
  renderList();
});

// ===== Кітаптар тізімі (уақытша деректер, кейін дерекқордан алынады) =====
const books = [
  { id: 1, title: "Абай жолы", author: "Мұхтар Әуезов", category: "Қазақ әдебиеті", year: 1942, rating: 4.9, color: "#2f5d50" },
  { id: 2, title: "Көшпенділер", author: "Ілияс Есенберлин", category: "Тарихи роман", year: 1976, rating: 4.8, color: "#8e5a2b" },
  { id: 3, title: "Қан мен тер", author: "Әбдіжәміл Нұрпейісов", category: "Қазақ әдебиеті", year: 1970, rating: 4.6, color: "#6a3d5a" },
  { id: 4, title: "Ақ кеме", author: "Шыңғыс Айтматов", category: "Әлем әдебиеті", year: 1970, rating: 4.7, color: "#3b6ea5" },
  { id: 5, title: "Сөнген жұлдыздар", author: "Мағжан Жұмабаев", category: "Поэзия", year: 1923, rating: 4.5, color: "#4b4b7a" },
  { id: 6, title: "Кішкентай ханзада", author: "Антуан де Сент-Экзюпери", category: "Әлем әдебиеті", year: 1943, rating: 4.9, color: "#c98d42" },
  { id: 7, title: "Атомдық әдеттер", author: "Джеймс Клир", category: "Өзін-өзі дамыту", year: 2018, rating: 4.7, color: "#2e8b57" },
  { id: 8, title: "Алхимик", author: "Пауло Коэльо", category: "Әлем әдебиеті", year: 1988, rating: 4.4, color: "#a0522d" },
  { id: 9, title: "Қара сөздер", author: "Абай Құнанбайұлы", category: "Қазақ әдебиеті", year: 1890, rating: 4.9, color: "#2b4c3f" },
  { id: 10, title: "Таза код", author: "Роберт Мартин", category: "Бағдарламалау", year: 2008, rating: 4.6, color: "#34495e" },
  { id: 11, title: "Бай әке, кедей әке", author: "Роберт Кийосаки", category: "Өзін-өзі дамыту", year: 1997, rating: 4.3, color: "#7a6a2b" },
  { id: 12, title: "Махаббат қызық мол жылдар", author: "Әзілхан Нұршайықов", category: "Қазақ әдебиеті", year: 1970, rating: 4.5, color: "#a03c5a" }
];

// ===== Таңдаулылар (браузер жадында сақталады) =====
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch (e) {
    return [];
  }
}

function toggleFavorite(id) {
  let favs = getFavorites();
  favs = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
  try {
    localStorage.setItem("favorites", JSON.stringify(favs));
  } catch (e) {}
  return favs.includes(id);
}

// ===== Кітап карточкасын жасау =====
function createBookCard(book) {
  const isFav = getFavorites().includes(book.id);
  const card = document.createElement("article");
  card.className = "book-card";
  card.innerHTML = `
    <div class="book-cover" style="background:${book.color}">${book.title}</div>
    <div class="book-info">
      <span class="tag">${book.category}</span>
      <h3>${book.title}</h3>
      <p class="book-author">${book.author}, ${book.year}</p>
      <div class="book-meta">
        <span class="rating">★ ${book.rating}</span>
        <button class="fav-btn" title="Таңдаулыларға қосу">${isFav ? "❤️" : "🤍"}</button>
      </div>
    </div>`;
  card.querySelector(".fav-btn").addEventListener("click", (e) => {
    e.target.textContent = toggleFavorite(book.id) ? "❤️" : "🤍";
  });
  return card;
}

function renderBooks(list, container) {
  container.innerHTML = "";
  list.forEach((book) => container.appendChild(createBookCard(book)));
}

// ===== Мобильді мәзір =====
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
if (burger && nav) {
  burger.addEventListener("click", () => nav.classList.toggle("open"));
}

// ===== Басты бет: танымал кітаптар =====
const popularBooks = document.getElementById("popular-books");
if (popularBooks) {
  const top = [...books].sort((a, b) => b.rating - a.rating).slice(0, 4);
  renderBooks(top, popularBooks);
}

// ===== Каталог: іздеу, сүзгі, сұрыптау =====
const catalogBooks = document.getElementById("catalog-books");
if (catalogBooks) {
  const searchInput = document.getElementById("search");
  const categorySelect = document.getElementById("category");
  const sortSelect = document.getElementById("sort");
  const resultCount = document.getElementById("result-count");
  const emptyText = document.getElementById("empty");

  // Санаттар тізімін толтыру
  [...new Set(books.map((b) => b.category))].forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  // Басты беттен келген іздеу сөзі
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) searchInput.value = params.get("q");
  if (params.get("category")) categorySelect.value = params.get("category");

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;

    let result = books.filter((b) => {
      const matchText = b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
      const matchCategory = category === "all" || b.category === category;
      return matchText && matchCategory;
    });

    if (sortSelect.value === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sortSelect.value === "title") result.sort((a, b) => a.title.localeCompare(b.title, "kk"));
    if (sortSelect.value === "year") result.sort((a, b) => b.year - a.year);

    renderBooks(result, catalogBooks);
    resultCount.textContent = `Табылды: ${result.length} кітап`;
    emptyText.style.display = result.length ? "none" : "block";
  }

  searchInput.addEventListener("input", applyFilters);
  categorySelect.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);
  applyFilters();
}

// ===== Форманы тексеру =====
function showError(input, text) {
  input.classList.toggle("invalid", Boolean(text));
  input.parentElement.querySelector(".error-text").textContent = text;
  return !text;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Кіру формасы
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const { email, password } = loginForm.elements;
    const message = document.getElementById("form-message");

    const ok = [
      showError(email, isValidEmail(email.value) ? "" : "Дұрыс email енгізіңіз"),
      showError(password, password.value.length >= 6 ? "" : "Құпиясөз кемінде 6 таңбадан тұруы керек")
    ].every(Boolean);

    message.className = "message " + (ok ? "success" : "error");
    message.textContent = ok ? "Сіз жүйеге сәтті кірдіңіз!" : "Қателерді түзетіңіз";
  });
}

// Тіркелу формасы
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const { name, email, password, confirm } = registerForm.elements;
    const message = document.getElementById("form-message");

    const ok = [
      showError(name, name.value.trim().length >= 2 ? "" : "Атыңызды енгізіңіз"),
      showError(email, isValidEmail(email.value) ? "" : "Дұрыс email енгізіңіз"),
      showError(password, password.value.length >= 6 ? "" : "Құпиясөз кемінде 6 таңбадан тұруы керек"),
      showError(confirm, confirm.value === password.value && confirm.value ? "" : "Құпиясөздер сәйкес келмейді")
    ].every(Boolean);

    message.className = "message " + (ok ? "success" : "error");
    message.textContent = ok ? `Құттықтаймыз, ${name.value}! Тіркелу сәтті өтті.` : "Қателерді түзетіңіз";
    if (ok) registerForm.reset();
  });
}

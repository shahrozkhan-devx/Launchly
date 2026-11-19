const cards = [...document.querySelectorAll(".product-card")];
const searchInput = document.querySelector("#searchInput");
const emptyState = document.querySelector("#emptyState");
const resultCount = document.querySelector("#resultCount");
const filterTabs = [...document.querySelectorAll(".filter-tab")];
const categoryFilter = document.querySelector("#categoryFilter");
const modal = document.querySelector("#submitModal");
const toast = document.querySelector("#toast");

const categories = ["All categories", "AI", "Design", "Developer", "Productivity", "Finance", "Marketing", "Education", "Wellness"];
let activeCategory = "All categories";
let activePeriod = "today";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  cards.forEach(card => {
    const matchesSearch = card.dataset.name.toLowerCase().includes(query);
    const matchesCategory = activeCategory === "All categories" || card.dataset.category === activeCategory;
    const cardPeriod = card.dataset.period;
    const matchesPeriod =
      (activePeriod === "today" && cardPeriod === "today") ||
      (activePeriod === "week" && ["today", "week"].includes(cardPeriod)) ||
      (activePeriod === "month" && ["today", "week", "month"].includes(cardPeriod));

    const show = matchesSearch && matchesCategory && matchesPeriod;
    card.hidden = !show;
    if (show) visible++;
  });

  resultCount.textContent = `${visible} ${visible === 1 ? "product" : "products"}`;
  emptyState.classList.toggle("visible", visible === 0);
}

searchInput.addEventListener("input", applyFilters);
document.querySelector("#searchForm").addEventListener("submit", event => event.preventDefault());

document.addEventListener("keydown", event => {
  if (event.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape") searchInput.blur();
});

filterTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    filterTabs.forEach(item => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    activePeriod = tab.dataset.filter === "all" ? "today" : tab.dataset.filter;
    applyFilters();
  });
});

categoryFilter.addEventListener("click", () => {
  const index = categories.indexOf(activeCategory);
  activeCategory = categories[(index + 1) % categories.length];
  categoryFilter.innerHTML = `${activeCategory} <span>⌄</span>`;
  applyFilters();
});

document.querySelectorAll(".vote-btn").forEach(button => {
  button.addEventListener("click", () => {
    const count = button.querySelector("b");
    const voted = button.classList.toggle("voted");
    count.textContent = String(Number(count.textContent) + (voted ? 1 : -1));
    showToast(voted ? "Vote added" : "Vote removed");
  });
});

document.querySelector("#openModal").addEventListener("click", () => modal.showModal());
document.querySelector("#submissionForm").addEventListener("submit", event => {
  event.preventDefault();
  modal.close();
  event.currentTarget.reset();
  showToast("Launch submitted for review");
});

document.querySelector("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  showToast(document.body.classList.contains("dark") ? "Dark mode on" : "Light mode on");
});

document.querySelector("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.querySelector("#emailInput");
  document.querySelector("#newsletterStatus").textContent = `You're in — updates will be sent to ${email.value}`;
  email.value = "";
  showToast("Welcome to The Launchly Edit");
});

const date = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date()).toUpperCase();
document.querySelector("#todayDate").textContent = date;
applyFilters();

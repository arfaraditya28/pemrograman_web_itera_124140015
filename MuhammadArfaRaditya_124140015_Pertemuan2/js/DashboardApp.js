// DashboardApp — mengatur state, CRUD tugas, localStorage, dan data cuaca
import { TaskItem } from "./models/TaskItem.js";

const STORAGE_KEY = "personalDashboardTasks";
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FJakarta";

// Kode cuaca WMO -> deskripsi bahasa Indonesia
const WMO_MAP = {
  0: "Cerah", 1: "Cerah Berawan", 2: "Berawan", 3: "Mendung",
  45: "Berkabut", 48: "Berkabut", 51: "Gerimis", 53: "Gerimis",
  55: "Gerimis Lebat", 61: "Hujan Ringan", 63: "Hujan",
  65: "Hujan Lebat", 80: "Hujan Ringan", 81: "Hujan", 82: "Hujan Lebat",
  95: "Badai Petir", 96: "Badai Petir", 99: "Badai Petir",
};

export class DashboardApp {
  constructor() {
    this.tasks = [];
    this.filter = "all";
    this.sortBy = "deadline";
    this.editingId = null;
    this.el = {};
  }

  init() {
    const ids = ["currentDate", "currentTime", "taskForm", "taskTitle", "taskCourse", "taskDesc", "taskDeadline", "taskPriority", "taskSort", "taskList", "emptyState", "formError", "formTitle", "submitBtn", "cancelEditBtn", "toast", "statTotal", "statDone", "statActive", "weatherLoading", "weatherError", "weatherErrorMsg", "weatherContent", "weatherTemp", "weatherDesc", "weatherFeels", "weatherHumidity", "weatherWind", "weatherPrecip", "weatherUpdated", "refreshWeatherBtn", "retryWeatherBtn"];
    ids.forEach((id) => {
      this.el[id] = document.getElementById(id);
    });
    this.el.filterChips = document.querySelectorAll("[data-filter]");

    this.loadTasks();
    this.render();
    this.startClock();
    this.fetchWeather();
    setInterval(() => {
      this.fetchWeather(true);
    }, 10 * 60 * 1000);
    this.bindEvents();
  }

  bindEvents() {
    this.el.taskForm.addEventListener("submit", (e) => {
      this.handleSubmit(e);
    });
    this.el.cancelEditBtn.addEventListener("click", () => {
      this.cancelEdit();
    });
    this.el.taskSort.addEventListener("change", (e) => {
      this.sortBy = e.target.value;
      this.render();
    });
    this.el.filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        this.filter = chip.dataset.filter;
        this.el.filterChips.forEach((c) => {
          c.classList.toggle("active", c === chip);
        });
        this.render();
      });
    });
    this.el.taskList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      if (btn.dataset.action === "edit") this.startEdit(btn.dataset.id);
      if (btn.dataset.action === "delete") this.deleteTask(btn.dataset.id);
    });
    this.el.taskList.addEventListener("change", (e) => {
      const box = e.target.closest('input[data-action="toggle"]');
      if (box) this.toggleTask(box.dataset.id);
    });
    this.el.refreshWeatherBtn.addEventListener("click", () => {
      this.fetchWeather(true);
    });
    this.el.retryWeatherBtn.addEventListener("click", () => {
      this.fetchWeather(true);
    });
  }

  startClock() {
    const tick = () => {
      const now = new Date();
      this.el.currentDate.textContent = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      this.el.currentTime.textContent = now.toLocaleTimeString("id-ID", { hour12: false });
    };
    tick();
    setInterval(tick, 1000);
  }

  async fetchWeather(silent = false) {
    if (!silent) this.showWeatherState("loading");
    try {
      const res = await fetch(WEATHER_URL);
      if (!res.ok) throw new Error("Gagal mengambil data cuaca.");
      const data = await res.json();
      const current = data.current || {};
      const temperature = current.temperature_2m;
      const weatherCode = current.weather_code;
      if (temperature === undefined || weatherCode === undefined) {
        throw new Error("Data cuaca tidak lengkap.");
      }
      const { relative_humidity_2m: humidity, apparent_temperature: feels, precipitation, wind_speed_10m: wind, is_day: isDay } = current;
      this.renderWeather({ temperature, weatherCode, humidity, feels, precipitation, wind, isDay, time: current.time });
    } catch (err) {
      this.showWeatherState("error", "Tidak dapat memuat cuaca. Periksa koneksi internet lalu coba lagi.");
    }
  }

  renderWeather({ temperature, weatherCode, humidity, feels, precipitation, wind, isDay, time }) {
    let desc = WMO_MAP[weatherCode] || "Tidak diketahui";
    if (isDay === 0 && (weatherCode === 0 || weatherCode === 1 || weatherCode === 2)) {
      desc = desc + " (malam hari)";
    }
    this.el.weatherTemp.textContent = Math.round(temperature);
    this.el.weatherDesc.textContent = desc;
    this.el.weatherFeels.textContent = feels !== undefined ? Math.round(feels) + " °C" : "-";
    this.el.weatherHumidity.textContent = humidity !== undefined ? Math.round(humidity) + " %" : "-";
    this.el.weatherWind.textContent = wind !== undefined ? Math.round(wind) + " km/jam" : "-";
    this.el.weatherPrecip.textContent = precipitation !== undefined ? precipitation + " mm" : "-";
    this.el.weatherUpdated.textContent = "Diperbarui: " + new Date(time).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + " WIB";
    this.showWeatherState("content");
  }

  showWeatherState(state, msg) {
    if (msg === undefined) msg = "";
    this.el.weatherLoading.classList.toggle("hidden", state !== "loading");
    this.el.weatherError.classList.toggle("hidden", state !== "error");
    this.el.weatherContent.classList.toggle("hidden", state !== "content");
    if (state === "error") this.el.weatherErrorMsg.textContent = msg;
  }

  loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.tasks = [];
        return;
      }
      const parsed = JSON.parse(raw);
      this.tasks = parsed.map((item) => TaskItem.fromJSON(item));
    } catch (err) {
      this.tasks = [];
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  saveTasks() {
    const plain = this.tasks.map((t) => t.toJSON());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
  }

  handleSubmit(e) {
    e.preventDefault();
    const payload = {
      title: this.el.taskTitle.value,
      course: this.el.taskCourse.value,
      description: this.el.taskDesc.value,
      deadline: this.el.taskDeadline.value,
      priority: this.el.taskPriority.value,
    };
    const errors = TaskItem.validate(payload);
    if (errors.length > 0) {
      this.showFormError(errors.join(" "));
      return;
    }
    this.hideFormError();
    if (this.editingId) {
      this.tasks = this.tasks.map((t) => {
        if (t.id === this.editingId) t.update({ ...payload });
        return t;
      });
      this.showToast("Tugas berhasil diperbarui.");
      this.cancelEdit(true);
    } else {
      const task = new TaskItem({ ...payload });
      this.tasks = [...this.tasks, task];
      this.showToast("Tugas berhasil ditambahkan.");
      this.el.taskForm.reset();
    }
    this.saveTasks();
    this.render();
  }

  startEdit(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    const { title, course, description, deadline, priority } = task;
    this.editingId = id;
    this.el.taskTitle.value = title;
    this.el.taskCourse.value = course;
    this.el.taskDesc.value = description;
    this.el.taskDeadline.value = deadline;
    this.el.taskPriority.value = priority;
    this.el.formTitle.textContent = "Edit Tugas";
    this.el.submitBtn.textContent = "Simpan Perubahan";
    this.el.cancelEditBtn.classList.remove("hidden");
    this.el.taskTitle.focus();
  }

  cancelEdit(silent) {
    if (silent === undefined) silent = false;
    this.editingId = null;
    if (!silent) this.el.taskForm.reset();
    this.el.formTitle.textContent = "Tambah Tugas";
    this.el.submitBtn.textContent = "Simpan Tugas";
    this.el.cancelEditBtn.classList.add("hidden");
    this.hideFormError();
  }

  deleteTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    const yakin = confirm('Hapus tugas "' + task.title + '"?');
    if (!yakin) return;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    if (this.editingId === id) this.cancelEdit();
    this.saveTasks();
    this.render();
    this.showToast("Tugas berhasil dihapus.");
  }

  toggleTask(id) {
    this.tasks.forEach((t) => {
      if (t.id === id) t.toggleStatus();
    });
    this.saveTasks();
    this.render();
  }

  getVisibleTasks() {
    let filtered = this.tasks;
    if (this.filter === "active") filtered = this.tasks.filter((t) => !t.isDone);
    if (this.filter === "done") filtered = this.tasks.filter((t) => t.isDone);
    const sorted = [...filtered];
    if (this.sortBy === "priority") {
      const rank = { tinggi: 0, sedang: 1, rendah: 2 };
      sorted.sort((a, b) => rank[a.priority] - rank[b.priority]);
    } else if (this.sortBy === "newest") {
      sorted.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      sorted.sort((a, b) => {
        const x = a.deadline || "9999";
        const y = b.deadline || "9999";
        if (x < y) return -1;
        return 1;
      });
    }
    return sorted;
  }

  render() {
    const visible = this.getVisibleTasks();
    const today = new Date().toISOString().slice(0, 10);

    const total = this.tasks.length;
    const done = this.tasks.reduce((n, t) => {
      if (t.isDone) return n + 1;
      return n;
    }, 0);
    this.el.statTotal.textContent = total;
    this.el.statDone.textContent = done;
    this.el.statActive.textContent = total - done;

    if (visible.length === 0) {
      this.el.taskList.innerHTML = "";
      this.el.emptyState.style.display = "block";
      return;
    }
    this.el.emptyState.style.display = "none";
    const html = visible.map((t) => {
      const { id, title, course, description, deadline, priority, status } = t;
      const checked = status === "done" ? "checked" : "";
      const doneClass = status === "done" ? "done" : "";
      let dateText = "-";
      if (deadline) {
        dateText = new Date(deadline + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      }
      let overdueText = "";
      if (t.isOverdue(today)) overdueText = " · Terlambat";
      let descHtml = "";
      if (description) descHtml = `<p class="task-desc">${this.escape(description)}</p>`;
      return `
        <article class="task-item ${doneClass}">
          <div class="task-top">
            <span class="task-course">${this.escape(course)}</span>
          </div>
          <h3 class="task-title">${this.escape(title)}</h3>
          ${descHtml}
          <p class="task-meta">Deadline: ${dateText}${overdueText}<br />Prioritas: <span class="task-priority">${priority}</span></p>
          <div class="task-actions">
            <label class="task-check"><input type="checkbox" data-action="toggle" data-id="${id}" ${checked} /> Selesai</label>
            <button class="btn btn-edit" data-action="edit" data-id="${id}" type="button">Edit</button>
            <button class="btn btn-danger" data-action="delete" data-id="${id}" type="button">Hapus</button>
          </div>
        </article>`;
    });
    this.el.taskList.innerHTML = html.join("");
  }

  escape(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  showToast(msg) {
    this.el.toast.textContent = msg;
    this.el.toast.classList.remove("hidden");
    setTimeout(() => {
      this.el.toast.classList.add("hidden");
    }, 3000);
  }

  showFormError(msg) {
    this.el.formError.textContent = msg;
    this.el.formError.classList.remove("hidden");
  }

  hideFormError() {
    this.el.formError.textContent = "";
    this.el.formError.classList.add("hidden");
  }
}

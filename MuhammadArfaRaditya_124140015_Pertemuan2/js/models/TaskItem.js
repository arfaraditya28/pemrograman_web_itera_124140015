// js/models/TaskItem.js — Model data & perilaku sebuah tugas (ES6 class + export)
export class TaskItem {
  constructor({ id, title, course, description = "", deadline, priority = "sedang", status = "active", createdAt = Date.now() }) {
    this.id = id ?? crypto.randomUUID();
    this.title = title?.trim() ?? "";
    this.course = course?.trim() ?? "";
    this.description = description?.trim() ?? "";
    this.deadline = deadline ?? "";
    this.priority = priority;
    this.status = status; // "active" | "done"
    this.createdAt = createdAt;
  }

  // Toggle selesai <-> aktif (dipakai DashboardApp)
  toggleStatus() {
    this.status = this.status === "done" ? "active" : "done";
    return this.status;
  }

  get isDone() {
    return this.status === "done";
  }

  // Update immutable-friendly: kembalikan data baru memakai spread
  update(patch = {}) {
    const { title, course, description, deadline, priority, status } = patch;
    if (title !== undefined) this.title = String(title).trim();
    if (course !== undefined) this.course = String(course).trim();
    if (description !== undefined) this.description = String(description).trim();
    if (deadline !== undefined) this.deadline = deadline;
    if (priority !== undefined) this.priority = priority;
    if (status !== undefined) this.status = status;
    return this;
  }

  // True jika tenggat lewat & belum selesai
  isOverdue(today = new Date().toISOString().slice(0, 10)) {
    return !this.isDone && this.deadline && this.deadline < today;
  }

  toJSON() {
    const { id, title, course, description, deadline, priority, status, createdAt } = this;
    return { id, title, course, description, deadline, priority, status, createdAt };
  }

  static fromJSON(obj = {}) {
    return new TaskItem({ ...obj });
  }

  static validate({ title, course, deadline }) {
    const errors = [];
    if (!title?.trim()) errors.push("Judul tugas wajib diisi.");
    if (!course?.trim()) errors.push("Mata kuliah wajib diisi.");
    if (!deadline) errors.push("Tenggat waktu wajib diisi.");
    return errors;
  }
}

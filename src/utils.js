export const emptyTenant = { name: "", phone: "", email: "" };

export function cloneDemo(demoState) {
  return JSON.parse(JSON.stringify(demoState));
}

export function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export function dateLabel(value) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function daysUntil(dateString) {
  if (!dateString) return 9999;
  const now = new Date();
  const target = new Date(`${dateString}T00:00:00`);
  return Math.ceil((target - now) / 86400000);
}

export function agreementStatus(endDate) {
  const days = daysUntil(endDate);
  if (days < 0) return "Expired";
  if (days <= 30) return "Expiring Soon";
  return "Active";
}

export function monthLabel(date = new Date()) {
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export function classForStatus(status) {
  if (status === "Active" || status === "Paid") return "status status-green";
  if (status === "Expiring Soon" || status === "Pending") return "status status-yellow";
  return "status status-red";
}

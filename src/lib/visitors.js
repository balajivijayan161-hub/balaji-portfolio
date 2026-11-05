const IST = "Asia/Kolkata";

export function formatIst(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export function visitorInitials(name, email) {
  const source = String(name || email || "").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

/** Drop ASCII control characters before a name from auth metadata is shown. */
export function displayText(value) {
  const text = String(value ?? "");
  let out = "";
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    if (code >= 32 && code !== 127) out += text[index];
  }
  return out;
}

export function visitorLabel(user) {
  if (!user) return "";
  const meta = user.user_metadata || {};
  return displayText(meta.full_name || meta.name || user.email || "Signed in");
}

export function visitorAvatar(user) {
  if (!user) return "";
  const meta = user.user_metadata || {};
  return meta.avatar_url || meta.picture || "";
}

function csvCell(value) {
  let text = String(value ?? "");
  // Spreadsheets treat a leading = + - @ tab or CR as a formula.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

export function visitorsToCsv(rows) {
  const header = ["name", "email", "provider", "last_seen_ist", "first_seen_ist", "login_count"];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(
      [
        displayText(row.name),
        row.email,
        row.provider,
        formatIst(row.last_seen),
        formatIst(row.first_seen),
        row.login_count,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  return lines.join("\n");
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

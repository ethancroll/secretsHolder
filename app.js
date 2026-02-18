const fileInput = document.getElementById("env-file");
const list = document.getElementById("env-list");
const emptyState = document.getElementById("empty-state");
const emptyPanel = document.getElementById("empty-panel");
const count = document.getElementById("count");
const status = document.getElementById("status");

const envEntries = [];

function render() {
  const total = envEntries.length;
  count.textContent = `${total} variable${total === 1 ? "" : "s"}`;
  emptyState.classList.toggle("hidden", total > 0);
  emptyPanel.classList.toggle("hidden", total > 0);
  list.innerHTML = "";

  envEntries.forEach(({ key }, index) => {
    const row = document.createElement("li");
    row.className = "flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3";

    const name = document.createElement("span");
    name.className = "truncate font-medium";
    name.textContent = key;

    const button = document.createElement("button");
    button.className = "rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-100";
    button.dataset.copy = String(index);
    button.textContent = "Copy";

    row.append(name, button);

    list.appendChild(row);
  });
}

function parseEnvText(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => (line.startsWith("export ") ? line.slice(7).trim() : line))
    .map((line) => {
      const equal = line.indexOf("=");
      if (equal < 1) {
        return null;
      }

      const key = line.slice(0, equal).trim();
      let value = line.slice(equal + 1).trim();
      if (
        value.length >= 2 &&
        ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
      ) {
        value = value.slice(1, -1);
      }
      return key ? { key, value } : null;
    })
    .filter(Boolean);
}

async function loadFile() {
  const file = fileInput.files?.[0];
  if (!file) {
    status.textContent = "Please choose a .env file first.";
    return;
  }

  envEntries.length = 0;
  envEntries.push(...parseEnvText(await file.text()));
  render();

  status.textContent = envEntries.length
    ? `Loaded ${envEntries.length} variable${envEntries.length === 1 ? "" : "s"} from ${file.name}.`
    : `No valid variables found in ${file.name}.`;
}

fileInput.addEventListener("change", () => {
  loadFile().catch(() => {
    status.textContent = "Could not read file.";
  });
});

list.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const copyIndex = target.dataset.copy;
  if (copyIndex) {
    const index = Number(copyIndex);
    const entry = envEntries[index];
    if (!entry) {
      return;
    }

    try {
      await navigator.clipboard.writeText(entry.value);
      target.textContent = "Copied";
      setTimeout(() => {
        target.textContent = "Copy";
      }, 800);
    } catch {
      target.textContent = "Failed";
      setTimeout(() => {
        target.textContent = "Copy";
      }, 800);
    }
  }
});

render();

const fileInput = document.getElementById("env-file");
const dropZone = document.getElementById("drop-zone");
const dropMessage = document.getElementById("drop-message");
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
    row.className = "flex items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-[#0a0a0a] p-3";

    const name = document.createElement("span");
    name.className = "truncate text-sm font-medium text-neutral-200";
    name.textContent = key;

    const button = document.createElement("button");
    button.className =
      "rounded-md border border-neutral-700 bg-[#121212] px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:border-neutral-500 hover:bg-[#1a1a1a]";
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

  if (dropMessage) {
    dropMessage.textContent = file.name;
  }

  status.textContent = envEntries.length
    ? `Loaded ${envEntries.length} variable${envEntries.length === 1 ? "" : "s"} from ${file.name}.`
    : `No valid variables found in ${file.name}.`;
}

fileInput.addEventListener("change", () => {
  loadFile().catch(() => {
    status.textContent = "Could not read file.";
  });
});

if (dropZone) {
  dropZone.addEventListener("click", () => {
    fileInput.click();
  });

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("border-neutral-400");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("border-neutral-400");
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("border-neutral-400");

    const file = event.dataTransfer?.files?.[0];
    if (!file) {
      return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);
    fileInput.files = transfer.files;
    fileInput.dispatchEvent(new Event("change"));
  });
}

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
      target.classList.add("border-neutral-300", "text-white");
      setTimeout(() => {
        target.textContent = "Copy";
        target.classList.remove("border-neutral-300", "text-white");
      }, 800);
    } catch {
      target.textContent = "Failed";
      target.classList.add("border-neutral-300", "text-white");
      setTimeout(() => {
        target.textContent = "Copy";
        target.classList.remove("border-neutral-300", "text-white");
      }, 800);
    }
  }
});

render();

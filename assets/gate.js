// Simple client-side gate. Deters casual visitors and keeps the
// site out of search results, but is NOT real security — anyone
// determined can view source and see the hash. Don't put anything
// truly sensitive (confirmation numbers, IDs, payment info) on this
// site.

const GATE_HASH = "340333fdb48fcb4543ca72e0edbe6c3726e79bedf1b7e41f5054f35a1fed036b";
const GATE_KEY = "gm-ca-trip-unlocked";

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function unlock() {
  document.body.classList.remove("locked");
}

if (localStorage.getItem(GATE_KEY) === "1") {
  unlock();
} else {
  document.body.classList.add("locked");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("gate-form");
  const input = document.getElementById("gate-input");
  const error = document.getElementById("gate-error");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const hash = await sha256(input.value);
    if (hash === GATE_HASH) {
      localStorage.setItem(GATE_KEY, "1");
      unlock();
      error.textContent = "";
    } else {
      error.textContent = "Wrong password — try again.";
      input.value = "";
      input.focus();
    }
  });
});

/* Applying a waiting service-worker update, without ever getting stuck.
 *
 * `updateServiceWorker(true)` from vite-plugin-pwa messages the worker *its*
 * Workbox instance saw waiting, then reloads on the "controlling" event. That
 * event never fired in a few real cases, leaving the prompt on "Updating…":
 *
 * - the hourly poll found an even newer build, so the referenced worker went
 *   redundant and the message went nowhere;
 * - the Settings page registers a second Workbox instance with its own, stale
 *   view of the registration;
 * - another tab already activated the worker, so there was nothing to wait for.
 *
 * This reads the live registration at click time, tells whatever is waiting
 * *now* to take over, reloads on `controllerchange`, and reloads anyway after a
 * short timeout. Worst case the visitor gets a plain reload: the new worker is
 * already installed, so that reload is fast and lands on the new build or the
 * old one, never a broken mix.
 */

const FALLBACK_RELOAD_MS = 4000;

let reloading = false;

function reloadOnce() {
  if (reloading) return;
  reloading = true;
  window.location.reload();
}

export async function applyPwaUpdate(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    reloadOnce();
    return;
  }

  navigator.serviceWorker.addEventListener("controllerchange", reloadOnce, {
    once: true,
  });
  window.setTimeout(reloadOnce, FALLBACK_RELOAD_MS);

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    const waiting = registration?.waiting;

    if (!waiting) {
      // Nothing waiting: another tab already activated it, or it was replaced.
      // A reload picks up whichever worker is now in control.
      reloadOnce();
      return;
    }

    // The generated worker listens for exactly this message in "prompt" mode.
    waiting.postMessage({ type: "SKIP_WAITING" });
  } catch {
    reloadOnce();
  }
}

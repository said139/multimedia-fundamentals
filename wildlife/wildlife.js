/**
 * Save Our Wildlife — wildlife.js
 *
 * Handles the toggle button:
 *  - If video is hidden  → show it and play
 *  - If video is playing → pause and hide it
 *  - Updates button label and ARIA attributes for accessibility
 */

(function () {
  'use strict';

  // Wait for the DOM to be fully parsed
  document.addEventListener('DOMContentLoaded', function () {

    const btn         = document.getElementById('toggleBtn');
    const videoWrapper = document.getElementById('videoWrapper');
    const video       = document.getElementById('wildlifeVideo');
    const statusText  = document.getElementById('statusText');

    // Guard: if any element is missing, do nothing
    if (!btn || !videoWrapper || !video || !statusText) return;

    /**
     * updateUI — keeps button label, icon, and ARIA state in sync
     * @param {boolean} visible - whether the video wrapper is visible
     * @param {boolean} playing - whether the video is currently playing
     */
    function updateUI(visible, playing) {
      if (!visible) {
        btn.innerHTML       = '<span class="icon" aria-hidden="true">▶</span> Show & Play Video';
        btn.setAttribute('aria-label', 'Show and play the wildlife video');
        btn.setAttribute('aria-pressed', 'false');
        statusText.textContent = 'Video hidden';
      } else if (playing) {
        btn.innerHTML       = '<span class="icon" aria-hidden="true">⏸</span> Pause & Hide Video';
        btn.setAttribute('aria-label', 'Pause and hide the wildlife video');
        btn.setAttribute('aria-pressed', 'true');
        statusText.textContent = 'Now playing…';
      } else {
        // Visible but paused (e.g. user used native controls)
        btn.innerHTML       = '<span class="icon" aria-hidden="true">▶</span> Play Video';
        btn.setAttribute('aria-label', 'Play the wildlife video');
        btn.setAttribute('aria-pressed', 'false');
        statusText.textContent = 'Paused';
      }
    }

    // ── Main toggle handler ─────────────────────────────────────
    btn.addEventListener('click', function () {
      const isHidden = videoWrapper.classList.contains('is-hidden');

      if (isHidden) {
        // Show and play
        videoWrapper.classList.remove('is-hidden');
        video.play().catch(function (err) {
          // Autoplay may be blocked by the browser — that is fine
          console.warn('Autoplay prevented:', err);
          updateUI(true, false);
        });
        updateUI(true, true);
      } else {
        // Pause and hide
        video.pause();
        videoWrapper.classList.add('is-hidden');
        updateUI(false, false);
      }
    });

    // ── Sync UI when native controls pause/play the video ───────
    video.addEventListener('play',  function () { updateUI(true, true);  });
    video.addEventListener('pause', function () { updateUI(true, false); });
    video.addEventListener('ended', function () {
      videoWrapper.classList.add('is-hidden');
      updateUI(false, false);
    });

    // ── Keyboard shortcut: Space bar toggles when btn is focused ─
    btn.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        btn.click();
      }
    });

    // Initialise UI state (video starts visible, paused)
    updateUI(true, false);

  });

}());

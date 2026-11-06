(() => {
  "use strict";

  const overlay = document.querySelector("[data-intro-overlay]");
  const video = document.querySelector("[data-intro-video]");
  const skipButton = document.querySelector("[data-intro-skip]");
  const progressBar = document.querySelector("[data-intro-progress]");

  if (!overlay || !video) return;

  const MAX_DURATION = 6.30;
  let dismissed = false;

  function dismissIntro() {
    if (dismissed) return;
    dismissed = true;

    try {
      video.pause();
    } catch (e) {}

    document.body.classList.remove("intro-is-playing");
    overlay.classList.add("is-dismissed");

    setTimeout(() => {
      overlay.style.display = "none";
      overlay.remove();
    }, 800);
  }

  function initialize() {
    document.body.classList.add("intro-is-playing");

    const config = window.PERFECT_MENS_CONFIG || {};
    const isMobile = window.innerWidth <= 768;

    let videoPath = "";
    if (
      isMobile &&
      typeof config.storefrontVideoMobileUrl === "string" &&
      config.storefrontVideoMobileUrl.trim()
    ) {
      videoPath = config.storefrontVideoMobileUrl.trim();
    } else if (
      typeof config.storefrontVideoUrl === "string" &&
      config.storefrontVideoUrl.trim()
    ) {
      videoPath = config.storefrontVideoUrl.trim();
    }

    if (!videoPath) {
      videoPath = isMobile
        ? "assets/storefront-mobile-v2.mp4"
        : "assets/storefront-entrance-v2.mp4";
    }

    const posterPath = isMobile
      ? "assets/storefront-mobile-poster.webp"
      : "assets/storefront-entrance-poster.webp";

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.autoplay = true;

    video.src = videoPath + "?v=14";
    video.poster = posterPath + "?v=14";

    // Attempt autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If autoplay blocked by battery saver, clicking anywhere starts it
        const startOnTap = () => {
          video.play();
          window.removeEventListener("click", startOnTap);
          window.removeEventListener("touchstart", startOnTap);
        };
        window.addEventListener("click", startOnTap, { once: true });
        window.addEventListener("touchstart", startOnTap, { once: true });
      });
    }

    // Monitor video playback timeline
    video.addEventListener("timeupdate", () => {
      if (progressBar && video.duration) {
        const effectiveDuration = Math.min(MAX_DURATION, video.duration);
        const percent = Math.min(100, (video.currentTime / effectiveDuration) * 100);
        progressBar.style.width = percent + "%";
      }

      // Hard stop and fade out as soon as the camera enters the shop (6.3s)
      if (video.currentTime >= MAX_DURATION) {
        dismissIntro();
      }
    });

    video.addEventListener("ended", dismissIntro);

    video.addEventListener("error", () => {
      console.warn("Intro video could not load, bypassing intro.");
      dismissIntro();
    });

    if (skipButton) {
      skipButton.addEventListener("click", (e) => {
        e.stopPropagation();
        dismissIntro();
      });
    }

    // Safety timeout: If video takes longer than 8 seconds, reveal store
    setTimeout(() => {
      if (!dismissed) dismissIntro();
    }, 8500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();

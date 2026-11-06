(() => {
  "use strict";

  const track = document.querySelector("[data-cinematic-track]");
  const scene = document.querySelector("[data-cinematic-intro]");
  const video = document.querySelector("[data-cinematic-video]");
  const skipButton = document.querySelector("[data-cinematic-skip]");
  const enterButton = document.querySelector("[data-cinematic-cue]");
  const brand = document.querySelector("[data-cinematic-brand]");
  const openingCopy = document.querySelector("[data-cinematic-opening]");
  const divider = document.querySelector("[data-cinematic-divider]");

  if (!track || !scene || !video) return;

  // If already viewed in this browser session, skip immediately without flash
  try {
    if (sessionStorage.getItem("pmw_intro_seen") === "true") {
      track.style.display = "none";
      track.setAttribute("hidden", "hidden");
      return;
    }
  } catch (e) {}

  let isDismissed = false;

  function dismissIntro() {
    if (isDismissed) return;
    isDismissed = true;

    try {
      sessionStorage.setItem("pmw_intro_seen", "true");
    } catch (e) {}

    // Animate out cleanly
    track.classList.add("is-dismissed");
    track.style.pointerEvents = "none";

    try {
      video.pause();
    } catch (e) {}

    // Cleanup listeners
    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("scroll", handleWindowScroll);

    setTimeout(() => {
      track.style.display = "none";
      track.setAttribute("hidden", "hidden");
      track.classList.remove("is-dismissed");
    }, 400);
  }

  // Wheel interaction (user scrolling down)
  function handleWheel(e) {
    if (e.deltaY > 8) {
      dismissIntro();
    }
  }

  // Touch gesture interaction (user swiping up to scroll down)
  let touchStartY = 0;
  function handleTouchStart(e) {
    if (e.touches && e.touches[0]) {
      touchStartY = e.touches[0].clientY;
    }
  }

  function handleTouchMove(e) {
    if (e.touches && e.touches[0]) {
      const delta = touchStartY - e.touches[0].clientY;
      if (delta > 16) {
        dismissIntro();
      }
    }
  }

  // Native window scroll check
  function handleWindowScroll() {
    if ((window.scrollY || window.pageYOffset || 0) > 18) {
      dismissIntro();
    }
  }

  function init() {
    track.removeAttribute("aria-hidden");
    track.removeAttribute("hidden");
    scene.removeAttribute("aria-hidden");
    track.style.display = "block";
    track.style.opacity = "1";
    track.style.visibility = "visible";

    const config = window.PERFECT_MENS_CONFIG || {};
    let videoPath = typeof config.storefrontVideoUrl === "string" ? config.storefrontVideoUrl.trim() : "";
    if (window.innerWidth <= 768 && typeof config.storefrontVideoMobileUrl === "string" && config.storefrontVideoMobileUrl.trim()) {
      videoPath = config.storefrontVideoMobileUrl.trim();
    }
    if (!videoPath) videoPath = "assets/storefront-intro.mp4";

    try {
      video.src = new URL(videoPath, window.location.href).href;
      const posterPath = typeof config.storefrontImageUrl === "string" ? config.storefrontImageUrl.trim() : "";
      if (posterPath) video.poster = new URL(posterPath, window.location.href).href;
    } catch (e) {
      video.src = videoPath;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";

    // Auto-advance entrance: video is 4.62s trimmed strictly to storefront entrance
    // As the doors open (~4.4s), transition smoothly into the store
    video.addEventListener("timeupdate", () => {
      if (video.currentTime >= 4.4) {
        dismissIntro();
      }
    });

    video.addEventListener("ended", dismissIntro);

    // Gently fade brand motto in after opening glide (0.8s)
    setTimeout(() => {
      if (!isDismissed && brand) {
        brand.style.opacity = "1";
        brand.style.transform = "scale(1)";
        if (divider) divider.style.transform = "scaleX(1)";
      }
    }, 750);

    // Click / touch buttons
    if (skipButton) skipButton.addEventListener("click", dismissIntro);
    if (enterButton) enterButton.addEventListener("click", dismissIntro);

    // User gesture listeners
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    // Begin native playback
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If mobile browser blocks unmuted/autonomous play, tap anywhere to kickstart
        scene.addEventListener("click", () => {
          if (!isDismissed) video.play().catch(() => {});
        }, { once: true });
      });
    }
  }

  // Allow replaying entrance if requested
  window.pmwReplayIntro = function() {
    try {
      sessionStorage.removeItem("pmw_intro_seen");
    } catch (e) {}
    isDismissed = false;
    init();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

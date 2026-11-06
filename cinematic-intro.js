(() => {
  "use strict";

  const track = document.querySelector(
    "[data-intro-track], [data-cinematic-track]"
  );

  const video = document.querySelector(
    "[data-intro-video], [data-cinematic-video]"
  );

  const skipButton = document.querySelector(
    "[data-intro-skip], [data-cinematic-skip]"
  );

  const enterButton = document.querySelector(
    "[data-intro-cue], [data-cinematic-cue]"
  );

  const brand = document.querySelector(
    "[data-intro-brand], [data-cinematic-brand]"
  );

  const openingCopy = document.querySelector(
    "[data-intro-opening], [data-cinematic-opening]"
  );

  if (!track || !video) return;

  const MAX_VIDEO_SECONDS = 6.33;

  let duration = MAX_VIDEO_SECONDS;
  let targetProgress = 0;
  let rafId = null;
  let isSeeking = false;
  let videoReady = false;

  const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, value));

  function getTrackStart() {
    return track.getBoundingClientRect().top + window.scrollY;
  }

  function getScrollProgress() {
    const scrollDistance = track.offsetHeight - window.innerHeight;

    if (scrollDistance <= 0) return 0;

    const progress =
      (window.scrollY - getTrackStart()) / scrollDistance;

    return clamp(progress, 0, 1);
  }

  function scheduleRender() {
    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  }

  function updateVideo() {
    if (!videoReady || isSeeking) return;

    const targetTime = targetProgress * duration;

    if (Math.abs(video.currentTime - targetTime) < 0.035) {
      return;
    }

    try {
      isSeeking = true;
      video.currentTime = targetTime;
    } catch (error) {
      isSeeking = false;
    }
  }

  function updateOverlays() {
    const p = targetProgress;

    // Opening text
    if (openingCopy) {
      const alpha = clamp(1 - p / 0.20, 0, 1);

      openingCopy.style.opacity = String(alpha);
      openingCopy.style.transform =
        `translateY(${-p * 75}px)`;
    }

    // Scroll cue
    if (enterButton) {
      const alpha = clamp(1 - p / 0.10, 0, 1);

      enterButton.style.opacity = String(alpha);
      enterButton.style.pointerEvents =
        p < 0.10 ? "auto" : "none";
    }

    // Brand reveal
    if (brand) {
      let alpha = 0;

      if (p >= 0.22 && p <= 0.72) {
        if (p < 0.38) {
          alpha = (p - 0.22) / 0.16;
        } else if (p > 0.58) {
          alpha = (0.72 - p) / 0.14;
        } else {
          alpha = 1;
        }
      }

      alpha = clamp(alpha, 0, 1);

      brand.style.opacity = String(alpha);
      brand.style.transform =
        `translateY(${16 * (1 - alpha)}px)`;
    }

    // Skip button
    if (skipButton) {
      const visible = p < 0.85;

      skipButton.style.opacity = visible ? "1" : "0";
      skipButton.style.pointerEvents =
        visible ? "auto" : "none";
    }
  }

  function render() {
    rafId = null;

    updateVideo();
    updateOverlays();
  }

  function onScroll() {
    targetProgress = getScrollProgress();
    scheduleRender();
  }

  function getEndPosition() {
    return getTrackStart() +
      track.offsetHeight -
      window.innerHeight +
      2;
  }

  // SCROLL TO ENTER:
  // Smoothly travels through the entire video timeline.
  function enterWebsite() {
    window.scrollTo({
      top: getEndPosition(),
      behavior: "smooth"
    });
  }

  // SKIP INTRO:
  // Immediately jumps to the website.
  function skipIntro() {
    const previousBehavior =
      document.documentElement.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = "auto";

    window.scrollTo({
      top: getEndPosition(),
      behavior: "auto"
    });

    document.documentElement.style.scrollBehavior =
      previousBehavior;

    onScroll();
  }

  function initializeVideo() {
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

    video.pause();
    video.removeAttribute("src");
    video.src = videoPath + "?v=13";
    video.poster = posterPath + "?v=13";

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";

    video.load();

    video.addEventListener("loadedmetadata", () => {
      duration = Number.isFinite(video.duration)
        ? Math.min(MAX_VIDEO_SECONDS, video.duration)
        : MAX_VIDEO_SECONDS;

      videoReady = true;
      video.currentTime = 0;

      targetProgress = getScrollProgress();
      scheduleRender();
    }, { once: true });

    video.addEventListener("seeked", () => {
      isSeeking = false;

      const latestTarget = targetProgress * duration;

      if (Math.abs(video.currentTime - latestTarget) > 0.05) {
        scheduleRender();
      }
    });

    video.addEventListener("error", () => {
      videoReady = false;
      console.error("Cinematic intro video failed to load:", video.error);
    });
  }

  function init() {
    if (!window.location.hash) {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    initializeVideo();

    window.addEventListener("scroll", onScroll, {
      passive: true
    });

    window.addEventListener("resize", onScroll, {
      passive: true
    });

    if (skipButton) {
      skipButton.addEventListener("click", skipIntro);
    }

    if (enterButton) {
      enterButton.addEventListener("click", enterWebsite);
    }

    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();

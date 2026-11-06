(() => {
  "use strict";

  const track = document.querySelector("[data-intro-track], [data-cinematic-track]");
  const video = document.querySelector("[data-intro-video], [data-cinematic-video]");
  const skipButton = document.querySelector("[data-intro-skip], [data-cinematic-skip]");
  const enterButton = document.querySelector("[data-intro-cue], [data-cinematic-cue]");
  const brand = document.querySelector("[data-intro-brand], [data-cinematic-brand]");
  const openingCopy = document.querySelector("[data-intro-opening], [data-cinematic-opening]");

  if (!track || !video) return;

  let isSeeking = false;
  let targetProgress = 0;
  let currentProgress = 0;
  let rafId = null;

  function getScrollProgress() {
    const scrollDistance = track.offsetHeight - window.innerHeight;
    if (scrollDistance <= 0) return 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const progress = (scrollY - track.offsetTop) / scrollDistance;
    return Math.min(1, Math.max(0, progress));
  }

  function applyScrub() {
    rafId = null;

    // Hard ceiling: the entrance video stops strictly at 6.30s (inside store doors)
    const rawDuration = video.duration && !isNaN(video.duration) ? video.duration : 6.30;
    const maxDuration = Math.min(6.30, rawDuration);
    const targetTime = Math.min(maxDuration, Math.max(0, targetProgress * maxDuration));

    // Direct frame seeking with GOP=2 intra-frames for 0ms seek latency
    if (!isSeeking && Math.abs(video.currentTime - targetTime) > 0.03) {
      isSeeking = true;
      if ("fastSeek" in video) {
        try {
          video.fastSeek(targetTime);
        } catch (e) {
          video.currentTime = targetTime;
        }
      } else {
        video.currentTime = targetTime;
      }
    }

    // Dynamic typography reveals tied to scroll progress
    if (openingCopy) {
      if (targetProgress < 0.20) {
        openingCopy.style.opacity = String(1 - targetProgress / 0.20);
        openingCopy.style.transform = `translateY(${-targetProgress * 15}px)`;
      } else {
        openingCopy.style.opacity = "0";
      }
    }

    // Scroll cue ("SCROLL TO ENTER ↓") fades out immediately once scrolling starts
    if (enterButton) {
      if (targetProgress < 0.10) {
        enterButton.style.opacity = String(1 - targetProgress / 0.10);
        enterButton.style.pointerEvents = "auto";
      } else {
        enterButton.style.opacity = "0";
        enterButton.style.pointerEvents = "none";
      }
    }

    // Skip button fades out before website header arrives so it NEVER hovers over the navbar
    if (skipButton) {
      if (targetProgress >= 0.85) {
        skipButton.style.opacity = "0";
        skipButton.style.pointerEvents = "none";
      } else {
        skipButton.style.opacity = "1";
        skipButton.style.pointerEvents = "auto";
      }
    }

    // Brand heritage overlay ("PERFECT MENSWEAR / EST. 1998")
    if (brand) {
      if (targetProgress >= 0.22 && targetProgress <= 0.72) {
        let alpha = 1;
        if (targetProgress < 0.38) {
          alpha = (targetProgress - 0.22) / 0.16;
        } else if (targetProgress > 0.58) {
          alpha = (0.72 - targetProgress) / 0.14;
        }
        brand.style.opacity = String(Math.max(0, Math.min(1, alpha)));
      } else {
        brand.style.opacity = "0";
      }
    }
  }

  function onScroll() {
    targetProgress = getScrollProgress();
    if (!rafId) {
      rafId = requestAnimationFrame(applyScrub);
    }
  }

  function skipToWebsite() {
    const scrollDistance = track.offsetHeight - window.innerHeight;
    const targetY = track.offsetTop + Math.max(0, scrollDistance) + 4;
    window.scrollTo({
      top: targetY,
      behavior: "smooth"
    });
  }

  function init() {
    const config = window.PERFECT_MENS_CONFIG || {};
    const isMobile = window.innerWidth <= 768;
    let videoPath = "";
    if (isMobile && typeof config.storefrontVideoMobileUrl === "string" && config.storefrontVideoMobileUrl.trim()) {
      videoPath = config.storefrontVideoMobileUrl.trim();
    } else if (typeof config.storefrontVideoUrl === "string" && config.storefrontVideoUrl.trim()) {
      videoPath = config.storefrontVideoUrl.trim();
    }
    if (!videoPath) videoPath = isMobile ? "assets/storefront-mobile-v2.mp4" : "assets/storefront-entrance-v2.mp4";

    const posterPath = isMobile ? "assets/storefront-mobile-poster.webp" : "assets/storefront-entrance-poster.webp";

    video.src = videoPath + "?v=11";
    video.poster = posterPath + "?v=11";
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";

    video.addEventListener("seeked", () => {
      isSeeking = false;
      const rawDuration = video.duration && !isNaN(video.duration) ? video.duration : 6.30;
      const maxDuration = Math.min(6.30, rawDuration);
      const currentTarget = Math.min(maxDuration, Math.max(0, targetProgress * maxDuration));
      if (Math.abs(video.currentTime - currentTarget) > 0.05) {
        applyScrub();
      }
    });

    const onMeta = () => {
      try {
        video.currentTime = 0.001;
      } catch (e) {}
      onScroll();
    };

    if (video.readyState >= 1) {
      onMeta();
    } else {
      video.addEventListener("loadedmetadata", onMeta, { once: true });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Explicit exit controls only
    if (skipButton) skipButton.addEventListener("click", skipToWebsite);
    if (enterButton) enterButton.addEventListener("click", skipToWebsite);

    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

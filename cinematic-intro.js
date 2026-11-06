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
    const duration = video.duration && !isNaN(video.duration) ? video.duration : 6.33;
    const targetTime = targetProgress * duration;

    // Direct frame seeking (ultra-smooth thanks to GOP=2 intra-frames)
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

    // Dynamic typography reveals tied to scroll
    if (openingCopy) {
      if (targetProgress < 0.22) {
        openingCopy.style.opacity = String(1 - targetProgress / 0.22);
      } else {
        openingCopy.style.opacity = "0";
      }
    }

    if (enterButton) {
      if (targetProgress < 0.12) {
        enterButton.style.opacity = String(1 - targetProgress / 0.12);
        enterButton.style.pointerEvents = "auto";
      } else {
        enterButton.style.opacity = "0";
        enterButton.style.pointerEvents = "none";
      }
    }

    if (brand) {
      if (targetProgress >= 0.22 && targetProgress <= 0.72) {
        let a = 1;
        if (targetProgress < 0.38) {
          a = (targetProgress - 0.22) / 0.16;
        } else if (targetProgress > 0.58) {
          a = (0.72 - targetProgress) / 0.14;
        }
        brand.style.opacity = String(Math.max(0, Math.min(1, a)));
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
    if (!videoPath) videoPath = isMobile ? "assets/storefront-intro-mobile.mp4" : "assets/storefront-intro.mp4";

    video.src = videoPath;
    video.poster = isMobile ? "assets/storefront-mobile.webp" : "assets/storefront.webp";
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";

    video.addEventListener("seeked", () => {
      isSeeking = false;
      const duration = video.duration && !isNaN(video.duration) ? video.duration : 6.33;
      const currentTarget = targetProgress * duration;
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

    // Explicit exit controls
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

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

  if (!track || !scene || !video || !skipButton || !enterButton || !brand) return;

  let targetTime = 0;
  let isTicking = false;
  // The first 5.5 seconds contain the camera moving into the store
  const maxCameraZoomSeconds = 5.5;

  function getScrollProgress() {
    const trackRect = track.getBoundingClientRect();
    const scrollableDistance = track.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return 0;
    const progress = -trackRect.top / scrollableDistance;
    return Math.max(0, Math.min(1, progress));
  }

  function applyFrame() {
    // Keep video currentTime in sync with scroll position
    if (Math.abs(video.currentTime - targetTime) > 0.04) {
      try {
        if ("fastSeek" in video) {
          video.fastSeek(targetTime);
        } else {
          video.currentTime = targetTime;
        }
      } catch (e) {
        // Fallback for browsers that throw during rapid seeks
        video.currentTime = targetTime;
      }
    }
    isTicking = false;
  }

  function requestFrameUpdate() {
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(applyFrame);
    }
  }

  function handleScroll() {
    const progress = getScrollProgress();

    // 1. Visibly zoom the camera forward through the doors into the store (1.0x -> 1.55x zoom)
    const zoomScale = 1 + progress * 0.55;
    video.style.transform = `scale(${zoomScale.toFixed(3)}) translateZ(0)`;

    // 2. Scrub video through the active camera entrance (0.0s -> 5.5s)
    const videoProgress = Math.min(1, progress / 0.72);
    targetTime = videoProgress * maxCameraZoomSeconds;
    requestFrameUpdate();

    // 3. Opening copy ("PERFECT MENS WEAR", "पुरंदर, पुणे")
    // Fades out as the camera moves toward the entrance
    if (openingCopy) {
      if (progress < 0.22) {
        const p = progress / 0.22;
        openingCopy.style.opacity = String(1 - p);
        openingCopy.style.transform = `translateY(${-p * 28}px)`;
      } else {
        openingCopy.style.opacity = "0";
      }
    }

    // 4. Scroll cue button ("SCROLL TO ENTER ↓")
    if (enterButton) {
      if (progress < 0.08) {
        enterButton.style.opacity = String(1 - progress / 0.08);
        enterButton.style.pointerEvents = "auto";
      } else {
        enterButton.style.opacity = "0";
        enterButton.style.pointerEvents = "none";
      }
    }

    // 5. Brand heritage reveal ("PERFECT MENSWEAR", "EST. 1998", "STYLE • QUALITY • ELEGANCE")
    // Appears after entering the store (0.35 -> 0.78)
    if (brand) {
      if (progress >= 0.32 && progress <= 0.82) {
        let alpha = 1;
        if (progress < 0.48) {
          alpha = (progress - 0.32) / 0.16; // 0 -> 1
        } else if (progress > 0.70) {
          alpha = (0.82 - progress) / 0.12; // 1 -> 0
        }
        brand.style.opacity = String(Math.max(0, Math.min(1, alpha)));
        const scale = 0.94 + 0.06 * Math.min(1, (progress - 0.32) / 0.16);
        brand.style.transform = `scale(${scale})`;
        brand.style.pointerEvents = alpha > 0.5 ? "auto" : "none";

        if (divider) {
          const divScale = Math.max(0, Math.min(1, (progress - 0.36) / 0.16));
          divider.style.transform = `scaleX(${divScale})`;
        }
      } else {
        brand.style.opacity = "0";
        brand.style.pointerEvents = "none";
        if (divider) divider.style.transform = "scaleX(0)";
      }
    }

    // 6. Seamless dissolve into the site header and hero section
    if (progress >= 0.80) {
      const exitProgress = (progress - 0.80) / 0.20;
      scene.style.opacity = String(Math.max(0, 1 - exitProgress));
      scene.style.pointerEvents = exitProgress > 0.85 ? "none" : "auto";
    } else {
      scene.style.opacity = "1";
      scene.style.pointerEvents = "auto";
    }
  }

  function skipIntro() {
    const targetY = track.offsetTop + track.offsetHeight;
    window.scrollTo({
      top: targetY,
      behavior: "smooth"
    });
  }

  function init() {
    track.removeAttribute("aria-hidden");
    scene.removeAttribute("aria-hidden");
    scene.style.visibility = "visible";
    scene.style.opacity = "1";

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
      console.warn("Could not set video source URL", e);
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.pause();

    const onMeta = () => {
      video.currentTime = 0;
      handleScroll();
    };

    if (video.readyState >= 1) {
      onMeta();
    } else {
      video.addEventListener("loadedmetadata", onMeta, { once: true });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    skipButton.addEventListener("click", skipIntro);
    enterButton.addEventListener("click", skipIntro);

    handleScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

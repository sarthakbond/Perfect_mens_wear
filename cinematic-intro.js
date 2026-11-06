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

  function getScrollProgress() {
    const scrollableDistance = track.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return 1;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const progress = (scrollY - track.offsetTop) / scrollableDistance;
    return Math.max(0, Math.min(1, progress));
  }

  function handleScroll() {
    const progress = getScrollProgress();
    const isMobile = window.innerWidth <= 768;

    // 1. Smooth hardware-accelerated zoom into store entrance
    // Mobile uses a gentle 1.18x zoom to preserve full storefront framing & text
    // Desktop uses 1.28x zoom
    const maxZoom = isMobile ? 0.18 : 0.28;
    const zoomScale = 1 + progress * maxZoom;
    video.style.transform = `scale(${zoomScale.toFixed(3)}) translateZ(0)`;

    // 2. Playback speed acceleration on scroll (lag-free, zero seek stalls)
    if (!video.paused) {
      video.playbackRate = Math.min(2.5, 1 + progress * 1.5);
    }

    // 3. Opening copy ("PERFECT MENS WEAR", "पुरंदर, पुणे")
    if (openingCopy) {
      if (progress < 0.25) {
        const p = progress / 0.25;
        openingCopy.style.opacity = String(1 - p);
        openingCopy.style.transform = `translateY(${-p * 20}px)`;
      } else {
        openingCopy.style.opacity = "0";
      }
    }

    // 4. Scroll cue button ("SCROLL TO ENTER ↓")
    if (enterButton) {
      if (progress < 0.12) {
        enterButton.style.opacity = String(1 - progress / 0.12);
        enterButton.style.pointerEvents = "auto";
      } else {
        enterButton.style.opacity = "0";
        enterButton.style.pointerEvents = "none";
      }
    }

    // 5. Brand heritage reveal ("EST. 1998", "STYLE • QUALITY • ELEGANCE")
    if (brand) {
      if (progress >= 0.25 && progress <= 0.70) {
        let alpha = 1;
        if (progress < 0.40) {
          alpha = (progress - 0.25) / 0.15;
        } else if (progress > 0.58) {
          alpha = (0.70 - progress) / 0.12;
        }
        brand.style.opacity = String(Math.max(0, Math.min(1, alpha)));
        const scale = 0.95 + 0.05 * Math.min(1, (progress - 0.25) / 0.15);
        brand.style.transform = `scale(${scale})`;
        brand.style.pointerEvents = alpha > 0.5 ? "auto" : "none";

        if (divider) {
          const divScale = Math.max(0, Math.min(1, (progress - 0.28) / 0.15));
          divider.style.transform = `scaleX(${divScale})`;
        }
      } else {
        brand.style.opacity = "0";
        brand.style.pointerEvents = "none";
        if (divider) divider.style.transform = "scaleX(0)";
      }
    }

    // 6. Seamless dissolve into the site header and hero section
    if (progress >= 0.50) {
      const exitProgress = (progress - 0.50) / 0.50;
      scene.style.opacity = String(Math.max(0, 1 - exitProgress));
      scene.style.pointerEvents = exitProgress > 0.8 ? "none" : "auto";
    } else {
      scene.style.opacity = "1";
      scene.style.pointerEvents = "auto";
    }

    // 7. Visibility and resource conservation at end of scroll
    if (progress >= 0.98) {
      scene.style.visibility = "hidden";
      scene.style.pointerEvents = "none";
      if (!video.paused) {
        video.pause();
      }
    } else {
      scene.style.visibility = "visible";
      if (video.paused && progress < 0.5) {
        video.play().catch(() => {});
      }
    }
  }

  function skipIntro() {
    const scrollableDistance = track.offsetHeight - window.innerHeight;
    const targetY = track.offsetTop + Math.max(1, scrollableDistance);
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
    video.autoplay = true;

    // Start playback immediately for silky-smooth 60fps streaming
    const startPlay = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          // Fallback if browser requires interaction
        });
      }
    };

    if (video.readyState >= 1) {
      startPlay();
      handleScroll();
    } else {
      video.addEventListener("loadedmetadata", () => {
        startPlay();
        handleScroll();
      }, { once: true });
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

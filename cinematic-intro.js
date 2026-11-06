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

  let targetProgress = 0;
  let currentProgress = 0;
  let rafId = null;
  let userHasScrolled = false;

  function getScrollProgress() {
    const scrollableDistance = track.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return 1;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const progress = (scrollY - track.offsetTop) / scrollableDistance;
    return Math.max(0, Math.min(1, progress));
  }

  function updateVideoFrame() {
    // Smooth lerp towards targetProgress for responsive feel without jumping
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.001) {
      currentProgress += diff * 0.28;
    } else {
      currentProgress = targetProgress;
    }

    // Video duration is strictly the entrance (4.62s)
    const maxDuration = video.duration && !isNaN(video.duration) ? video.duration : 4.62;
    const targetTime = Math.min(maxDuration, Math.max(0, currentProgress * maxDuration));

    if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.04) {
      try {
        if ("fastSeek" in video) {
          video.fastSeek(targetTime);
        } else {
          video.currentTime = targetTime;
        }
      } catch (e) {
        video.currentTime = targetTime;
      }
    }

    // Camera zoom into store doors
    const isMobile = window.innerWidth <= 768;
    const maxZoom = isMobile ? 0.15 : 0.24;
    const zoomScale = 1 + currentProgress * maxZoom;
    video.style.transform = `scale(${zoomScale.toFixed(3)}) translateZ(0)`;

    // Dissolve into website only as the video actually finishes approaching the entrance
    // Tied to currentProgress so medium/fast scrolling does NOT cause the video to vanish prematurely!
    if (currentProgress >= 0.72) {
      const exitProgress = (currentProgress - 0.72) / 0.28;
      scene.style.opacity = String(Math.max(0, 1 - exitProgress));
      scene.style.pointerEvents = exitProgress > 0.85 ? "none" : "auto";
    } else {
      scene.style.opacity = "1";
      scene.style.pointerEvents = "auto";
    }

    // Hide completely when scrolled down past intro
    if (currentProgress >= 0.98 || targetProgress >= 0.99) {
      scene.style.visibility = "hidden";
      scene.style.pointerEvents = "none";
      if (!video.paused) {
        video.pause();
      }
    } else {
      scene.style.visibility = "visible";
    }

    if (Math.abs(targetProgress - currentProgress) > 0.002) {
      rafId = requestAnimationFrame(updateVideoFrame);
    } else {
      rafId = null;
    }
  }

  function handleScroll() {
    userHasScrolled = true;
    const progress = getScrollProgress();
    targetProgress = progress;

    // 1. Opening copy ("PERFECT MENS WEAR", "पुरंदर, पुणे")
    if (openingCopy) {
      if (progress < 0.20) {
        const p = progress / 0.20;
        openingCopy.style.opacity = String(1 - p);
        openingCopy.style.transform = `translateY(${-p * 20}px)`;
      } else {
        openingCopy.style.opacity = "0";
      }
    }

    // 2. Scroll cue button ("SCROLL TO ENTER ↓")
    if (enterButton) {
      if (progress < 0.08) {
        enterButton.style.opacity = String(1 - progress / 0.08);
        enterButton.style.pointerEvents = "auto";
      } else {
        enterButton.style.opacity = "0";
        enterButton.style.pointerEvents = "none";
      }
    }

    // 3. Brand heritage reveal ("EST. 1998", "STYLE • QUALITY • ELEGANCE")
    if (brand) {
      if (progress >= 0.25 && progress <= 0.72) {
        let alpha = 1;
        if (progress < 0.40) {
          alpha = (progress - 0.25) / 0.15;
        } else if (progress > 0.60) {
          alpha = (0.72 - progress) / 0.12;
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

    if (!rafId) {
      rafId = requestAnimationFrame(updateVideoFrame);
    }
  }

  function playInitialMotion() {
    if (userHasScrolled || window.scrollY > 20) return;
    video.muted = true;
    video.playsInline = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        const checkTime = () => {
          if (userHasScrolled || window.scrollY > 20) {
            video.pause();
            return;
          }
          // Play smoothly for the first 1.2s so the opening is active cinema, never a static photo
          if (video.currentTime >= 1.2) {
            video.pause();
            const maxDuration = video.duration || 4.62;
            currentProgress = 1.2 / maxDuration;
            targetProgress = getScrollProgress();
          } else {
            requestAnimationFrame(checkTime);
          }
        };
        requestAnimationFrame(checkTime);
      }).catch(() => {});
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

    const onMeta = () => {
      handleScroll();
      playInitialMotion();
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

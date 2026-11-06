(() => {
  "use strict";

  const completionKey = "perfect-mens-wear-intro-complete-v1";
  const track = document.querySelector("[data-cinematic-track]");
  const scene = document.querySelector("[data-cinematic-intro]");
  const video = document.querySelector("[data-cinematic-video]");
  const skipButton = document.querySelector("[data-cinematic-skip]");
  const enterButton = document.querySelector("[data-cinematic-cue]");
  const playButton = document.querySelector("[data-cinematic-play]");
  const brand = document.querySelector("[data-cinematic-brand]");
  if (!track || !scene || !video || !skipButton || !enterButton || !playButton || !brand) return;

  let disposed = false;
  let metadataTimeout = 0;
  let brandTimeout = 0;
  let revealTimeline;

  function recordCompletion() {
    try {
      sessionStorage.setItem(completionKey, "true");
    } catch (error) {
      console.warn("The intro completion state could not be saved for this session.", error);
    }
  }

  function cleanup() {
    if (metadataTimeout) window.clearTimeout(metadataTimeout);
    metadataTimeout = 0;
    if (brandTimeout) window.clearTimeout(brandTimeout);
    brandTimeout = 0;
    revealTimeline?.kill();
    revealTimeline = undefined;
    video.pause();
    video.removeEventListener("ended", revealBrand);
    video.removeEventListener("error", handleVideoError);
    playButton.removeEventListener("click", playIntro);
    enterButton.removeEventListener("click", finishIntro);
    skipButton.removeEventListener("click", finishIntro);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("wheel", handleScrollToEnter);
    window.removeEventListener("touchmove", handleScrollToEnter);
    window.removeEventListener("pagehide", handlePageHide);
    window.removeEventListener("pageshow", handlePageShow);
  }

  function finishIntro(resetPosition = true) {
    if (disposed) return;
    recordCompletion();
    disposed = true;
    cleanup();
    track.remove();
    if (resetPosition) window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelector("#site-header a, #main-content")?.focus({ preventScroll: true });
  }

  function handleScrollToEnter() {
    finishIntro(false);
  }

  function handleVideoError() {
    if (!disposed) {
      console.warn("The storefront intro video could not be played. Showing the existing homepage.");
      finishIntro();
    }
  }

  function handlePageHide(event) {
    if (event.persisted) {
      video.pause();
      return;
    }
    cleanup();
  }

  function handlePageShow() {
    if (!disposed && video.paused && video.currentTime < video.duration && brand.getAttribute("aria-hidden") !== "false") {
      playIntro();
    }
  }

  function handleVisibilityChange() {
    if (disposed) return;
    if (document.visibilityState === "hidden") {
      video.pause();
    } else if (video.paused && video.currentTime < video.duration && brand.getAttribute("aria-hidden") !== "false") {
      playIntro();
    }
  }

  function playIntro() {
    if (disposed) return;
    video.muted = true;
    const playRequest = video.play();
    if (!playRequest || typeof playRequest.then !== "function") return;
    playRequest.then(() => {
      playButton.hidden = true;
    }).catch((error) => {
      if (error.name === "AbortError" || disposed) return;
      console.info("Browser playback needs a user gesture to start the intro video.", error);
      playButton.hidden = false;
    });
  }

  function revealBrand() {
    if (disposed || !window.gsap) {
      if (!disposed) finishIntro();
      return;
    }
    brand.setAttribute("aria-hidden", "false");
    revealTimeline = gsap.timeline({
      onComplete: () => {
        brandTimeout = window.setTimeout(finishIntro, 900);
      }
    })
      .set(brand, { autoAlpha: 0, y: 18 })
      .to(".cinematic-grade", { autoAlpha: 0.88, duration: 0.5, ease: "power1.out" })
      .to(brand, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out" })
      .fromTo(".cinematic-brand-name", { letterSpacing: "0.2em" }, {
        letterSpacing: "0.09em",
        duration: 0.9,
        ease: "power2.out"
      }, "<")
      .to("[data-cinematic-divider]", { scaleX: 1, duration: 0.55, ease: "power2.out" }, "-=0.35");
  }

  function startPlayback() {
    track.removeAttribute("aria-hidden");
    scene.removeAttribute("aria-hidden");
    gsap.set(scene, { autoAlpha: 1 });
    gsap.set(brand, { autoAlpha: 0, y: 22 });
    gsap.set("[data-cinematic-divider]", { scaleX: 0, transformOrigin: "center center" });
    video.addEventListener("ended", revealBrand, { once: true });
    video.addEventListener("error", handleVideoError, { once: true });
    enterButton.addEventListener("click", finishIntro);
    skipButton.addEventListener("click", finishIntro);
    playButton.addEventListener("click", playIntro);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("wheel", handleScrollToEnter, { once: true, passive: true });
    window.addEventListener("touchmove", handleScrollToEnter, { once: true, passive: true });
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);

    video.pause();
    video.currentTime = 0;
    playIntro();
  }

  function init() {
    let alreadyComplete = false;
    try {
      alreadyComplete = sessionStorage.getItem(completionKey) === "true";
    } catch (error) {
      console.warn("The intro completion state could not be read for this session.", error);
    }
    if (alreadyComplete) {
      track.remove();
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = navigator.connection;
    const lowPerformance = connection?.saveData === true
      || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2)
      || (navigator.deviceMemory > 0 && navigator.deviceMemory <= 2);
    if (reducedMotion || lowPerformance) {
      track.remove();
      return;
    }

    const config = window.PERFECT_MENS_CONFIG || {};
    const videoPath = typeof config.storefrontVideoUrl === "string" ? config.storefrontVideoUrl.trim() : "";
    if (!videoPath) {
      console.info("Cinematic video intro skipped: configure storefrontVideoUrl in site-config.js.");
      track.remove();
      return;
    }

    try {
      video.src = new URL(videoPath, window.location.href).href;
      const posterPath = typeof config.storefrontImageUrl === "string" ? config.storefrontImageUrl.trim() : "";
      if (posterPath) video.poster = new URL(posterPath, window.location.href).href;
    } catch (error) {
      console.warn("A configured cinematic media URL is invalid.", error);
      track.remove();
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.addEventListener("loadeddata", () => {
      if (metadataTimeout) window.clearTimeout(metadataTimeout);
      metadataTimeout = 0;
      startPlayback();
    }, { once: true });
    video.addEventListener("error", handleVideoError, { once: true });
    metadataTimeout = window.setTimeout(() => {
      console.info("Cinematic video intro skipped because video data did not load in time.");
      disposed = true;
      cleanup();
      track.remove();
    }, 15000);
    video.load();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

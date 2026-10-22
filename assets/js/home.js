// ── home.js ──
// Home intro: the logo animation follows the scroll. Progress through the
// intro section (0..1) is exposed to CSS as --p and drives the video time.

document.addEventListener('DOMContentLoaded', () => {
    const intro = document.querySelector('.intro');
    const video = intro && intro.querySelector('.intro-video');
    if (!video) return;

    // The animation finishes before the end of the intro, so the full logo
    // stays on screen for the last stretch of scroll.
    const VIDEO_SHARE = 0.75;
    // Skip the first black frames: the stamp is already falling at the top.
    const START_SECONDS = 1.4;
    const EASE = 0.12;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showLastFrame = () => {
        if (video.duration) video.currentTime = video.duration;
    };

    if (reducedMotion) {
        video.addEventListener('loadedmetadata', showLastFrame);
        showLastFrame();
        return;
    }

    // iOS only decodes frames after a play() call.
    video.play().then(() => video.pause()).catch(() => {});

    let target = 0;
    let current = 0;

    const progress = () => {
        const rect = intro.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        if (travel <= 0) return 1;
        return Math.min(1, Math.max(0, -rect.top / travel));
    };

    const onScroll = () => {
        const p = progress();
        intro.style.setProperty('--p', p.toFixed(3));
        target = Math.min(1, p / VIDEO_SHARE);
    };

    const render = () => {
        current += (target - current) * EASE;
        if (video.readyState >= 2 && video.duration) {
            const start = Math.min(START_SECONDS, video.duration);
            const time = start + current * (video.duration - 0.05 - start);
            if (Math.abs(video.currentTime - time) > 0.02) video.currentTime = time;
        }
        requestAnimationFrame(render);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    requestAnimationFrame(render);
});

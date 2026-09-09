document.addEventListener("DOMContentLoaded", () => {
    const langLink = document.querySelector('a[hreflang="fa"], a[hreflang="en"]');
    if (!langLink) return;
    const currentPath = window.location.pathname;
    const base = "/BPB-Worker-Panel";

    let newPath;
    if (currentPath.startsWith(`${base}/fa/`)) {
        newPath = currentPath.replace(`${base}/fa`, base);
    } else {
        newPath = currentPath.replace(base, `${base}/fa`);
    }

    langLink.setAttribute("href", newPath);
});

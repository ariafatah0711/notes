const disableZoom = () => {
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (!viewportMeta) {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.head.appendChild(meta);
  } else {
    viewportMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
  }
};

const enableZoom = () => {
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.content = "width=device-width, initial-scale=1.0, user-scalable=yes";
  }
};

const checkZoomStatus = () => {
  //   const isPreviewActive = document.querySelector(".fullscreen-popup") !== null;
  const isPreviewActive = document.getElementById("preview-teks") !== null;
  if (isPreviewActive) {
    enableZoom();
  } else {
    disableZoom();
  }
};

// Cek secara berkala atau saat DOM berubah
const observer = new MutationObserver(checkZoomStatus);
observer.observe(document.body, { childList: true, subtree: true });

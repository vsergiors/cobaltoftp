(() => {
  const link = document.getElementById("download");
  const status = document.getElementById("dl-status");
  const copyButton = document.getElementById("copy-hash");
  const hashValue = document.getElementById("hash-value");

  const params = new URLSearchParams(window.location.search);
  const autoDownload = params.get("auto") !== "0";

  let started = false;

  function markStarted() {
    if (!status) return;
    status.dataset.state = "started";
    status.textContent =
      "Descarga iniciada. Busca CobaltoFTP.exe en Descargas; si el navegador pide permiso, acéptalo.";
  }

  function startDownload() {
    if (!link || started) return;
    started = true;
    markStarted();
    link.click();
  }

  if (link) {
    link.addEventListener("click", markStarted);
  }

  window.addEventListener("load", () => {
    if (!autoDownload) {
      if (status) status.textContent = "Pulsa el botón para descargar CobaltoFTP.exe.";
      return;
    }

    window.setTimeout(startDownload, 1000);
  });

  if (copyButton && hashValue) {
    copyButton.addEventListener("click", async () => {
      const value = hashValue.textContent.trim();
      let copied = false;

      try {
        await navigator.clipboard.writeText(value);
        copied = true;
      } catch {
        const field = document.createElement("textarea");
        field.value = value;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        try {
          copied = document.execCommand("copy");
        } catch {
          copied = false;
        }
        field.remove();
      }

      const original = copyButton.textContent;
      copyButton.textContent = copied ? "Copiado" : "No copiado";
      window.setTimeout(() => {
        copyButton.textContent = original;
      }, 1800);
    });
  }
})();

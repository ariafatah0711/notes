import GlobalSwal from "../utils/GlobalSwal";
const Swal = GlobalSwal;

const styles = `
/* CSS untuk mengubah ukuran SweetAlert agar mengisi layar penuh */
.swal2-popup.fullscreen-popup {
  width: 95vw !important;
  height: 95vh !important;
  max-width: 100% !important;
  max-height: 95% !important;
  border-radius: 8px;
  padding-right: 14px !important;
}

.swal2-container {
  overflow: hidden !important;
}

.swal2-html-container {
  min-height: 65vh !important;
  max-height: 90vh;
  overflow-y: auto;
  padding: 0 !important;
  margin-top: 10px;
}

@media (max-height: 600px) {
  .swal2-html-container {
    min-height: 45vh !important;
  }
}

@media (max-height: 400px) {
  .swal2-html-container {
    min-height: 30vh !important;
  }
}

.swal2-html-container pre {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 1rem;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.swal2-title {
  max-height: 80px;
  font-size: 1.2rem !important;
}

.fullscreen-popup {
  display: grid;
  grid-template-rows: auto 1fr;
  align-content: center !important;
}

.swal2-cancel,
.swal2-confirm,
.swal2-deny {
  font-size: 1rem !important;
  padding: 10px 20px !important;
}

@media (max-width: 640px) {
  #font_size_prev {
    font-size: 14px !important; /* ⬅️ default font size diperbesar */
  }
}
`;

const adjustFontSize = (type) => {
  const preElement = document.getElementById("font_size_prev");
  const currentSize = parseFloat(window.getComputedStyle(preElement).fontSize);
  const newSize = type === "increase" ? Math.min(currentSize + 2, 26) : Math.max(currentSize - 2, 5);
  preElement.style.fontSize = `${newSize}px`;
};

export const handlePreview = async (fileContent = null, fileName = null, currentGist) => {
  try {
    if (!fileContent && fileName) {
      const file = currentGist?.files?.[fileName];

      if (!file?.raw_url) {
        return Swal.fire("Error", "File tidak ditemukan atau tidak tersedia.", "error");
      }

      const response = await fetch(file.raw_url);
      if (!response.ok) {
        console.error("Fetch failed:", response.status, response.statusText);
        throw new Error("Gagal mengambil file dari Gist");
      }

      fileContent = await response.text();
      fileContent = fileContent.trim() === "_" ? "" : fileContent;
    }

    if (!fileContent.trim()) {
      return Swal.fire("Info", "File ini kosong!", "info");
    }

    const escapeHtml = (str) => {
      return str.replace(/[&<>"'/]/g, (match) => {
        const escapeMap = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
          "/": "&#x2F;",
        };
        return escapeMap[match];
      });
    };

    const escapedContent = escapeHtml(fileContent);

    Swal.fire({
      title: "preview",
      html: `
      <style>${styles}</style>
      <div id="preview-teks" class="h-full bg-[#f8f8f8] overflow-auto text-left p-2 sm:p-3 md:p-4 border-gray-300 rounded-md shadow-md mx-2 sm:mx-3 md:mx-4 box-border">
        <pre id="font_size_prev" class="h-full m-0 text-[14px] sm:text-base md:text-lg font-mono whitespace-pre-wrap break-words border-none">${escapedContent}</pre>
      </div>
    `,
      width: "100vw",
      heightAuto: true,
      showCloseButton: false,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "+",
      denyButtonText: "-",
      cancelButtonText: "Tutup",
      allowEscapeKey: true,
      customClass: {
        popup: "fullscreen-popup",
      },
      didRender: () => {
        const copyButton = document.createElement("button");
        copyButton.innerText = "Salin";
        copyButton.className = "swal2-confirm swal2-styled";
        copyButton.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(fileContent);
            Swal.fire("Info", "Isi file telah disalin ke clipboard!", "success");
          } catch (err) {
            Swal.fire("Error", "Gagal menyalin isi file!", "error");
          }
        });
        document.querySelector(".swal2-actions").appendChild(copyButton);
      },
      preConfirm: () => (adjustFontSize("increase"), false),
      preDeny: () => (adjustFontSize("decrease"), false),
    });
  } catch (error) {
    console.error(error);
    Swal.fire("Error", error.message || "Gagal memuat file dari Gist.", "error");
  }
};

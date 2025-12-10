// script.js
// Logika tes level stres + popup + latihan napas 4-4-4

document.addEventListener("DOMContentLoaded", () => {
  /* ================== TES LEVEL STRES ================== */

  /* Toggle visual + dark mode */
  const toggleTracks = document.querySelectorAll(".toggle-track");
  const bodyEl = document.body;

  const THEME_STORAGE_KEY = "kemengez-theme";

  const getSavedTheme = () => localStorage.getItem(THEME_STORAGE_KEY);
  const saveTheme = (isDark) =>
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");

  const applyTheme = (isDark) => {
    bodyEl.classList.toggle("dark-mode", isDark);
    toggleTracks.forEach((track) => track.classList.toggle("is-on", isDark));
  };

  const setTheme = (isDark, persist = true) => {
    applyTheme(isDark);
    if (persist) {
      saveTheme(isDark);
    }
  };

  const savedTheme = getSavedTheme();
  const mediaQuery = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

  const initialIsDark = savedTheme
    ? savedTheme === "dark"
    : Boolean(mediaQuery?.matches);

  setTheme(initialIsDark, Boolean(savedTheme));

  if (!savedTheme && mediaQuery) {
    const handleSystemChange = (e) => {
      if (!getSavedTheme()) {
        setTheme(e.matches, false);
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemChange);
    }
  }

  if (toggleTracks.length) {
    toggleTracks.forEach((track) =>
      track.addEventListener("click", () => {
        const next = !bodyEl.classList.contains("dark-mode");
        setTheme(next, true);
      })
    );
  }

  /* Mobile nav */
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  const toggleMobileMenu = (open) => {
    if (!mobileMenuBackdrop) return;
    mobileMenuBackdrop.classList.toggle("is-open", open);
    mobileMenuBackdrop.setAttribute("aria-hidden", open ? "false" : "true");
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => toggleMobileMenu(true));
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", () => toggleMobileMenu(false));
  }

  if (mobileMenuBackdrop) {
    mobileMenuBackdrop.addEventListener("click", (e) => {
      if (e.target === mobileMenuBackdrop) toggleMobileMenu(false);
    });
  }

  if (mobileNavLinks.length) {
    mobileNavLinks.forEach((link) =>
      link.addEventListener("click", () => toggleMobileMenu(false))
    );
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleMobileMenu(false);
    }
  });

  const questionCards = document.querySelectorAll(".question-card");
  const resultBtn = document.getElementById("seeResultBtn");

  const levelEl = document.getElementById("stressResultLevel");
  const textEl = document.getElementById("stressResultText");
  const disclaimerEl = document.getElementById("stressResultDisclaimer");

  // Modal tes stres
  const modalIncomplete = document.getElementById("modalIncomplete");
  const modalIncompleteOk = document.getElementById("modalIncompleteOk");

  const modalConfirm = document.getElementById("modalConfirm");
  const modalConfirmYes = document.getElementById("modalConfirmYes");
  const modalConfirmNo = document.getElementById("modalConfirmNo");

  const resultCard = document.getElementById("stressResultCard");

  // Hasil yang menunggu konfirmasi
  let pendingResult = null;

  function openModal(modal) {
    modal.style.display = "flex";
  }

  function closeModal(modal) {
    modal.style.display = "none";
  }

  const stressElementsReady =
    resultBtn &&
    modalIncomplete &&
    modalIncompleteOk &&
    modalConfirm &&
    modalConfirmYes &&
    modalConfirmNo &&
    levelEl &&
    textEl &&
    disclaimerEl &&
    resultCard;

  if (stressElementsReady) {
    // Klik opsi, jadikan active hanya di pertanyaan itu
    questionCards.forEach((card) => {
      const options = card.querySelectorAll(".option");
      options.forEach((opt) => {
        opt.addEventListener("click", () => {
          options.forEach((o) => o.classList.remove("option--active"));
          opt.classList.add("option--active");
        });
      });
    });

    // Hitung skor
    function calculateResult() {
      let totalScore = 0;
      let answered = 0;

      questionCards.forEach((card) => {
        const active = card.querySelector(".option--active");
        if (active) {
          answered++;
          totalScore += parseInt(active.dataset.score, 10);
        }
      });

      const totalQuestions = questionCards.length;

      if (answered < totalQuestions) {
        return { complete: false };
      }

      // Skor 0-10 (5 soal, masing 0-2)
      let level = "";
      let message = "";

      if (totalScore <= 3) {
        level = "Level Stres Rendah";
        message =
          "Saat ini level stresmu cenderung rendah. Pertahankan kebiasaan baikmu, seperti istirahat cukup, bercerita ke orang yang kamu percaya, dan mengelola waktu dengan seimbang.";
      } else if (totalScore <= 7) {
        level = "Level Stres Sedang";
        message =
          "Kamu mungkin sedang merasa agak tertekan. Coba luangkan waktu untuk 'me time', kurangi beban yang tidak terlalu penting, dan jangan ragu cerita ke sahabat atau orang dewasa yang kamu percaya.";
      } else {
        level = "Level Stres Tinggi";
        message =
          "Tanda-tanda stresmu cukup tinggi. Coba cari dukungan lebih serius: ngobrol dengan orang tua, guru BK, atau profesional. Kamu nggak perlu hadapi semuanya sendirian.";
      }

      return {
        complete: true,
        level,
        message,
      };
    }

    // Klik tombol "Lihat Hasil Level Stres"
    resultBtn.addEventListener("click", () => {
      const result = calculateResult();

      if (!result.complete) {
        openModal(modalIncomplete);
        pendingResult = null;
        return;
      }

      // simpan dulu lalu tunggu konfirmasi
      pendingResult = result;
      openModal(modalConfirm);
    });

    // Modal incomplete
    modalIncompleteOk.addEventListener("click", () => {
      closeModal(modalIncomplete);
    });

    // Modal konfirmasi
    modalConfirmNo.addEventListener("click", () => {
      closeModal(modalConfirm);
      pendingResult = null;
    });

    modalConfirmYes.addEventListener("click", () => {
      if (!pendingResult) {
        closeModal(modalConfirm);
        return;
      }

      levelEl.textContent = pendingResult.level;
      textEl.textContent = pendingResult.message;
      disclaimerEl.textContent =
        "Disclaimer: Tes singkat ini hanya gambaran umum dan tidak bisa menggantikan penilaian tenaga profesional. Jika kamu merasa sangat tertekan, cobalah bicara dengan orang dewasa yang kamu percaya atau tenaga kesehatan jiwa.";

      if (resultCard) {
        resultCard.classList.remove("is-hidden");
      }

      closeModal(modalConfirm);
      pendingResult = null;
    });
  }

  /* ================== ARTICLE SEARCH (EDUKASI) ================== */
  const articleCards = Array.from(document.querySelectorAll(".article-card"));
  const featuredCard = document.querySelector(".featured-card");
  const searchForm = document.getElementById("articleSearchForm");
  const searchInput = document.getElementById("articleSearchInput");
  const searchBtn = document.getElementById("articleSearchBtn");
  const popup = document.getElementById("articleSearchPopup");
  const popupClose = document.getElementById("articleSearchClose");
  const popupForm = document.getElementById("articleSearchFormPopup");
  const popupInput = document.getElementById("articleSearchInputPopup");
  const resultsGrid = document.getElementById("searchResultsGrid");
  const emptyState = document.getElementById("searchEmptyState");

  const articleData = articleCards.map((card) => {
    const titleEl = card.querySelector(".article-title");
    const imgEl = card.querySelector(".article-thumb");
    const content = card.getAttribute("data-content") || "";
    const link = card.getAttribute("data-link") || "#";

    return {
      title: (titleEl?.textContent || "").replace(/\s+/g, " ").trim(),
      titleHTML: titleEl?.innerHTML || "",
      image: imgEl?.getAttribute("src") || "",
      alt: imgEl?.getAttribute("alt") || "Artikel edukasi",
      desc: "", // Regular cards have no desc
      content: content.toLowerCase(), // Store searchable content
      link
    };
  });

  if (featuredCard) {
    const titleEl = featuredCard.querySelector(".featured-title");
    const imgEl = featuredCard.querySelector(".featured-image");
    const link = featuredCard.getAttribute("data-link") || "#";
    // Get all paragraphs of text for content search
    const textEls = featuredCard.querySelectorAll(".featured-text");
    const fullContent = Array.from(textEls).map(el => el.textContent.trim()).join(" ");
    const descEl = featuredCard.querySelector(".featured-text");

    articleData.unshift({
      title: (titleEl?.textContent || "").replace(/\s+/g, " ").trim(),
      titleHTML: titleEl?.innerHTML || "",
      image: imgEl?.getAttribute("src") || "",
      alt: imgEl?.getAttribute("alt") || "Artikel edukasi",
      desc: descEl ? descEl.textContent.trim().substring(0, 150) + "..." : "",
      content: fullContent.toLowerCase(),
      link
    });
  }

  const toggleSearchPopup = (show) => {
    if (!popup) return;
    popup.setAttribute("aria-hidden", show ? "false" : "true");
    popup.classList.toggle("is-visible", show);
  };

  const renderSearchResults = (query) => {
    if (!resultsGrid || !emptyState || !articleData.length) return;

    const normalized = query.trim().toLowerCase();
    const matches = normalized
      ? articleData.filter((item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.content.includes(normalized)
      )
      : articleData;

    resultsGrid.innerHTML = "";
    emptyState.classList.remove("is-active");

    if (!matches.length) {
      emptyState.textContent = `Artikel dengan kata kunci "${query}" tidak ditemukan.`;
      emptyState.classList.add("is-active");
      return;
    }

    matches.forEach((item) => {
      const card = document.createElement("div");
      card.className = "article-card article-card--compact";

      const descHtml = item.desc ? `<p class="article-desc" style="margin-bottom: 1rem; color: #666; font-size: 14px;">${item.desc}</p>` : "";

      card.innerHTML = `
        <div class="article-thumb-wrap">
          <img src="${item.image}" alt="${item.alt}" class="article-thumb" />
        </div>
        <div class="article-body">
          <h3 class="article-title">${item.titleHTML}</h3>
          ${descHtml}
          <a href="${item.link || "#"}" class="btn edu-card-btn">Baca Artikel Edukasi Ini</a>
        </div>
      `;
      resultsGrid.appendChild(card);
    });
  };

  const handleSearchSubmit = (evt, sourceInput) => {
    if (evt) evt.preventDefault();
    if (!sourceInput) return;

    const query = sourceInput.value || "";
    if (popupInput && sourceInput !== popupInput) {
      popupInput.value = query;
    }

    renderSearchResults(query);
    toggleSearchPopup(true);
  };

  // Open popup when clicking the search input or search button
  const openSearchPopup = () => {
    if (searchInput && popupInput) {
      popupInput.value = searchInput.value || "";
    }
    renderSearchResults(searchInput?.value || "");
    toggleSearchPopup(true);
    // Focus on popup input after opening
    setTimeout(() => {
      if (popupInput) popupInput.focus();
    }, 100);
  };

  if (searchInput) {
    // Open popup when clicking the search input
    searchInput.addEventListener("click", (e) => {
      e.preventDefault();
      openSearchPopup();
    });

    // Also open popup when focusing the input
    searchInput.addEventListener("focus", (e) => {
      e.preventDefault();
      openSearchPopup();
    });
  }

  if (searchBtn) {
    // Open popup when clicking the search button
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openSearchPopup();
    });
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      openSearchPopup();
    });
  }

  if (popupForm && popupInput) {
    popupForm.addEventListener("submit", (e) => handleSearchSubmit(e, popupInput));

    // Live search as user types in popup
    popupInput.addEventListener("input", (e) => {
      renderSearchResults(e.target.value);
    });
  }

  if (popupClose) {
    popupClose.addEventListener("click", () => toggleSearchPopup(false));
  }

  if (popup) {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        toggleSearchPopup(false);
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleSearchPopup(false);
    }
  });

  /* ================== LATIHAN NAPAS 4-4-4 ================== */

  const openBreathingBtn = document.getElementById("openBreathingBtn");
  const modalBreathIntro = document.getElementById("modalBreathIntro");
  const breathStartBtn = document.getElementById("breathStartBtn");
  const breathIntroCloseBtn = document.getElementById("breathIntroCloseBtn");

  const modalBreathGuide = document.getElementById("modalBreathGuide");
  const breathPhaseTitle = document.getElementById("breathPhaseTitle");
  const breathCounterChip = document.getElementById("breathCounterChip");
  const breathStopBtn = document.getElementById("breathStopBtn");
  const breathCloseBtn = document.getElementById("breathCloseBtn");

  const breathingPhases = ["Tarik Napas Pelan Pelan", "Tahan Napas", "Hembuskan Perlahan"];
  const finishedText = "Selesai Latihan\nIngin Ulang Lagi?";

  let breathPhaseIndex = 0;
  let breathInterval = null;
  let isFinished = false;

  const breathingReady =
    openBreathingBtn &&
    modalBreathIntro &&
    breathStartBtn &&
    breathIntroCloseBtn &&
    modalBreathGuide &&
    breathPhaseTitle &&
    breathCounterChip &&
    breathStopBtn &&
    breathCloseBtn;

  if (breathingReady) {
    function openModalBreathIntro() {
      modalBreathIntro.style.display = "flex";
    }

    function closeModalBreathIntro() {
      modalBreathIntro.style.display = "none";
    }

    function openModalBreathGuide() {
      modalBreathGuide.style.display = "flex";
    }

    function closeModalBreathGuide() {
      modalBreathGuide.style.display = "none";
    }

    function stopBreathingTimer() {
      if (breathInterval) {
        clearInterval(breathInterval);
        breathInterval = null;
      }
    }

    function resetBreathingUI() {
      isFinished = false;
      breathStopBtn.textContent = "Hentikan Latihan";
      breathCounterChip.textContent = "4 Detik";
    }

    function setFinishedUI() {
      isFinished = true;
      breathPhaseTitle.textContent = finishedText;
      breathCounterChip.textContent = "Selesai";
      breathStopBtn.textContent = "Ulang Latihan";
    }

    function startBreathingPhase() {
      const phaseName = breathingPhases[breathPhaseIndex];
      breathPhaseTitle.textContent = phaseName;

      let seconds = 4;
      breathCounterChip.textContent = `${seconds} Detik`;

      stopBreathingTimer();

      breathInterval = setInterval(() => {
        seconds -= 1;

        if (seconds >= 0) {
          breathCounterChip.textContent = `${seconds} Detik`;
        }

        if (seconds <= 0) {
          stopBreathingTimer();

          breathPhaseIndex += 1;
          if (breathPhaseIndex >= breathingPhases.length) {
            setFinishedUI();
            return;
          }

          setTimeout(startBreathingPhase, 400);
        }
      }, 1000);
    }

    function startBreathingSession() {
      resetBreathingUI();
      breathPhaseIndex = 0;
      openModalBreathGuide();
      startBreathingPhase();
    }

    // Event handler latihan napas
    openBreathingBtn.addEventListener("click", () => {
      openModalBreathIntro();
    });

    breathIntroCloseBtn.addEventListener("click", () => {
      closeModalBreathIntro();
    });

    breathStartBtn.addEventListener("click", () => {
      closeModalBreathIntro();
      startBreathingSession();
    });

    breathStopBtn.addEventListener("click", () => {
      stopBreathingTimer();
      resetBreathingUI();
      closeModalBreathGuide();
      openModalBreathIntro();
    });

    breathCloseBtn.addEventListener("click", () => {
      stopBreathingTimer();
      resetBreathingUI();
      closeModalBreathGuide();
    });
  }
});

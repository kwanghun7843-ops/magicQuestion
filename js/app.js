(() => {
  "use strict";

  const STORAGE_KEY = "magicSchoolInquiryStateV1";

  const BG = {
    title: "./assets/images/title.png",
    intro: "./assets/images/title.png",
    room1: "./assets/images/room1-question.png",
    room2: "./assets/images/room2-greenhouse.png",
    room3: "./assets/images/room3-mailroom.png",
    room4: "./assets/images/room4-stairs.png",
    room5: "./assets/images/room5-tower.png",
    good: "./assets/images/ending-good.png",
    retry: "./assets/images/ending-retry.png"
  };

  const FRAGMENTS = {
    room1: "./assets/images/fragment-blue.png",
    room2: "./assets/images/fragment-green.png",
    room3: "./assets/images/fragment-yellow.png",
    room4: "./assets/images/fragment-pink.png",
    room5: "./assets/images/fragment-violet.png"
  };

  const ROOMS = [
    { id: "room1", label: "질문", short: "1" },
    { id: "room2", label: "비교", short: "2" },
    { id: "room3", label: "순서", short: "3" },
    { id: "room4", label: "규칙", short: "4" },
    { id: "room5", label: "성찰", short: "5" }
  ];

  const QUESTIONS = {
    cause: {
      icon: "✦",
      title: "왜 학교의 마법이 멈췄을까?",
      predictionPrompt: "처음에는 무엇 때문이라고 생각하나요?",
      predictions: [
        "별씨앗에 문제가 생겼을 것 같아요.",
        "학교 친구들이 마법을 잊었을 것 같아요.",
        "어딘가에서 마법을 막고 있을 것 같아요."
      ],
      evidences: {
        room2: "빛을 잃은 약초는 중앙탑과 연결된 순서대로 어두워졌어요.",
        room3: "빗자루 우편은 중앙탑에서 시작해 차례로 멈췄어요.",
        room4: "음악 계단의 끊긴 박자는 별씨앗이 어두워진 순간과 같았어요."
      },
      answers: [
        { id: "star-seed", text: "중앙탑의 별씨앗이 갈라져 마법의 연결이 끊어졌기 때문이에요." },
        { id: "sleep", text: "초상화 속 사람들이 잠들었기 때문이에요." },
        { id: "weather", text: "학교 밖에 구름이 많았기 때문이에요." }
      ],
      correct: "star-seed"
    },
    trail: {
      icon: "〰",
      title: "사라진 별빛은 어디로 이동했을까?",
      predictionPrompt: "별빛이 어디에 있을 것 같나요?",
      predictions: [
        "학교의 가장 높은 중앙탑에 모였을 것 같아요.",
        "마법 약초의 뿌리 아래에 숨었을 것 같아요.",
        "학교 밖 구름으로 날아갔을 것 같아요."
      ],
      evidences: {
        room2: "약초 꽃가루의 푸른 흔적이 위쪽 환기구와 중앙탑을 향했어요.",
        room3: "별가루는 초상화 회랑에서 우편실을 지나 음악 계단으로 이어졌어요.",
        room4: "마지막 별빛 울림은 계단 위 중앙탑 방향에서 가장 강했어요."
      },
      answers: [
        { id: "tower-route", text: "회랑과 우편실, 음악 계단을 지나 중앙탑으로 이동했어요." },
        { id: "cloud", text: "학교 밖의 구름 속으로 완전히 사라졌어요." },
        { id: "roots", text: "온실의 가장 깊은 뿌리 아래에 모였어요." }
      ],
      correct: "tower-route"
    },
    restore: {
      icon: "✧",
      title: "학교의 마법을 어떻게 되살릴 수 있을까?",
      predictionPrompt: "어떤 방법으로 마법을 되살릴 수 있을까요?",
      predictions: [
        "흩어진 조각을 올바른 순서로 연결해요.",
        "질문 나침반을 아주 세게 흔들어요.",
        "모든 방문과 창문을 닫고 기다려요."
      ],
      evidences: {
        room2: "서로 다른 빛의 약초를 바르게 묶자 작은 별빛이 다시 켜졌어요.",
        room3: "조각, 나침반, 포탈의 순서를 맞추자 빗자루가 다시 움직였어요.",
        room4: "반복되는 빛의 규칙을 맞추자 음악 계단의 마법이 돌아왔어요."
      },
      answers: [
        { id: "connect-order", text: "다섯 조각을 단서가 알려 준 순서와 규칙에 맞게 연결해요." },
        { id: "shake", text: "질문 나침반을 계속 흔들어 빛을 만들어요." },
        { id: "wait", text: "아무것도 하지 않고 별빛이 돌아올 때까지 기다려요." }
      ],
      correct: "connect-order"
    }
  };

  const defaultState = () => ({
    version: 1,
    screen: "title",
    resumeScreen: "intro",
    introPage: 0,
    questionId: null,
    prediction: null,
    completedRooms: [],
    evidence: {},
    finalAnswer: null,
    selectedEvidence: [],
    reflectionChange: "",
    reflectionClue: "",
    retryReason: "",
    sound: true
  });

  const runtime = {
    room2Observed: new Set(),
    room2Note: "식물을 눌러 빛의 색과 밝기를 관찰해 보세요.",
    room3Sequence: [],
    toastTimer: null
  };

  const els = {
    scene: document.querySelector("#scene"),
    content: document.querySelector("#content"),
    topBar: document.querySelector("#topBar"),
    progressNav: document.querySelector("#progressNav"),
    actorLayer: document.querySelector("#actorLayer"),
    heroSprite: document.querySelector("#heroSprite"),
    soundButton: document.querySelector("#soundButton"),
    homeButton: document.querySelector("#homeButton"),
    evidenceButton: document.querySelector("#evidenceButton"),
    toast: document.querySelector("#toast"),
    portalDialog: document.querySelector("#portalDialog"),
    portalFragment: document.querySelector("#portalFragment"),
    portalTitle: document.querySelector("#portalTitle"),
    portalText: document.querySelector("#portalText"),
    portalNextButton: document.querySelector("#portalNextButton"),
    evidenceDialog: document.querySelector("#evidenceDialog"),
    closeEvidenceButton: document.querySelector("#closeEvidenceButton"),
    evidenceList: document.querySelector("#evidenceList"),
    selectedQuestionLabel: document.querySelector("#selectedQuestionLabel"),
    resetDialog: document.querySelector("#resetDialog"),
    cancelResetButton: document.querySelector("#cancelResetButton"),
    confirmResetButton: document.querySelector("#confirmResetButton")
  };

  let state = loadState();

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved && saved.version === 1 ? { ...defaultState(), ...saved } : defaultState();
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function resetState(startNow = true) {
    const keepSound = state.sound;
    state = defaultState();
    state.sound = keepSound;
    state.screen = startNow ? "intro" : "title";
    state.resumeScreen = "intro";
    runtime.room2Observed.clear();
    runtime.room3Sequence = [];
    runtime.room2Note = "식물을 눌러 빛의 색과 밝기를 관찰해 보세요.";
    saveState();
    render();
  }

  function go(screen) {
    state.screen = screen;
    if (screen !== "title" && screen !== "good" && screen !== "retry") {
      state.resumeScreen = screen;
    }
    saveState();
    render();
  }

  function currentQuestion() {
    return state.questionId ? QUESTIONS[state.questionId] : null;
  }

  function setBackground(key) {
    els.scene.style.backgroundImage = `url("${BG[key]}")`;
  }

  function showActors(show, mode = "idle") {
    els.actorLayer.classList.toggle("hidden", !show);
    els.heroSprite.classList.toggle("hero-walk", show && mode === "walk");
    els.heroSprite.classList.toggle("hero-idle", !show || mode !== "walk");
  }

  function hasProgress() {
    return Boolean(state.questionId || state.completedRooms.length || state.screen !== "title");
  }

  function highestUnlockedRoomIndex() {
    let unlocked = 0;
    for (let index = 0; index < ROOMS.length - 1; index += 1) {
      if (state.completedRooms.includes(ROOMS[index].id)) unlocked = index + 1;
    }
    return unlocked;
  }

  function renderProgress() {
    const currentIndex = ROOMS.findIndex(room => room.id === state.screen);
    const unlockedIndex = highestUnlockedRoomIndex();
    els.progressNav.innerHTML = ROOMS.map((room, index) => {
      const complete = state.completedRooms.includes(room.id);
      const current = index === currentIndex;
      const unlocked = index <= unlockedIndex;
      const classes = ["progress-step"];
      if (complete) classes.push("complete");
      if (current) classes.push("current");
      if (unlocked) classes.push("unlocked");
      return `<button class="${classes.join(" ")}" data-room="${room.id}" type="button"
        aria-label="${room.label} 방" title="${room.label} 방" ${unlocked ? "" : "disabled"}>${complete ? "✓" : room.short}</button>`;
    }).join("");

    els.progressNav.querySelectorAll("[data-room]").forEach(button => {
      button.addEventListener("click", () => go(button.dataset.room));
    });
  }

  function renderChrome() {
    const showTop = !["title", "intro", "good", "retry"].includes(state.screen);
    els.topBar.classList.toggle("hidden", !showTop);
    els.soundButton.textContent = state.sound ? "🔊" : "🔇";
    if (showTop) renderProgress();

    const actors = ["room2", "room3", "room4", "room5"].includes(state.screen);
    showActors(actors, state.screen === "room3" ? "walk" : "idle");
  }

  function render() {
    renderChrome();
    els.content.className = "scene-content";

    const renderer = {
      title: renderTitle,
      intro: renderIntro,
      room1: renderRoom1,
      room2: renderRoom2,
      room3: renderRoom3,
      room4: renderRoom4,
      room5: renderRoom5,
      good: renderGoodEnding,
      retry: renderRetryEnding
    }[state.screen] || renderTitle;

    renderer();
  }

  function renderTitle() {
    setBackground("title");
    els.content.classList.add("center-layout");
    const resumable = state.questionId || state.completedRooms.length;

    els.content.innerHTML = `
      <section class="title-card">
        <p class="eyebrow">질문 · 탐구 · 성찰 모험</p>
        <h1>마법학교 질문탐험대<small>사라진 빛의 별</small></h1>
        <p class="lead">질문 하나를 선택하고 다섯 개의 방에서 단서를 모아 별빛 마법을 되살려 주세요.</p>
        <div class="button-row">
          ${resumable ? '<button id="continueButton" class="primary-button" type="button">이어서 탐험하기</button>' : ""}
          <button id="startButton" class="${resumable ? "secondary-button" : "primary-button"}" type="button">${resumable ? "새로 시작하기" : "탐험 시작"}</button>
        </div>
      </section>`;

    document.querySelector("#continueButton")?.addEventListener("click", () => go(state.resumeScreen || "room1"));
    document.querySelector("#startButton").addEventListener("click", () => {
      if (resumable) {
        els.resetDialog.showModal();
      } else {
        resetState(true);
      }
    });
  }

  function renderIntro() {
    setBackground("intro");
    els.content.classList.add("center-layout");
    const pages = [
      {
        tag: "오프닝 1/3",
        title: "별빛이 멈춘 날",
        body: "어느 날, 마법학교의 중심인 별씨앗이 다섯 조각으로 갈라졌어요. 초상화도, 약초도, 빗자루도 모두 움직임을 멈췄답니다."
      },
      {
        tag: "오프닝 2/3",
        title: "루미의 부탁",
        body: "구름새 루미가 질문 나침반을 건넸어요. “좋은 질문을 하나 고르고, 여러 방의 단서를 연결해야 별씨앗을 되살릴 수 있어!”"
      },
      {
        tag: "오프닝 3/3",
        title: "다섯 개의 방",
        body: "각 방에서 관찰하고, 비교하고, 규칙을 찾으세요. 미션을 해결하면 다음 방으로 가는 마법 포탈이 열립니다."
      }
    ];
    const page = pages[state.introPage] || pages[0];
    els.content.innerHTML = `
      <section class="story-card">
        <p class="eyebrow">${page.tag}</p>
        <h2>${page.title}</h2>
        <p class="lead">${page.body}</p>
        <div class="button-row">
          ${state.introPage > 0 ? '<button id="introPrev" class="secondary-button" type="button">이전</button>' : ""}
          <button id="introNext" class="primary-button" type="button">${state.introPage === pages.length - 1 ? "첫 번째 방으로" : "다음 이야기"}</button>
        </div>
      </section>`;

    document.querySelector("#introPrev")?.addEventListener("click", () => {
      state.introPage -= 1;
      saveState();
      renderIntro();
    });
    document.querySelector("#introNext").addEventListener("click", () => {
      playTone(620, 0.08);
      if (state.introPage < pages.length - 1) {
        state.introPage += 1;
        saveState();
        renderIntro();
      } else {
        go("room1");
      }
    });
  }

  function renderRoom1() {
    setBackground("room1");
    els.content.innerHTML = state.completedRooms.includes("room1")
      ? completedRoomMarkup("첫 질문을 선택했어요.", "질문 나침반이 파란 관찰 조각을 밝혔습니다.", "room2")
      : room1MissionMarkup();

    if (state.completedRooms.includes("room1")) {
      bindReopenPortal("room2", "room1", "관찰 조각과 함께 약초 온실로 이동해요.");
      return;
    }

    if (!state.questionId) {
      document.querySelectorAll("[data-question]").forEach(button => {
        button.addEventListener("click", () => {
          state.questionId = button.dataset.question;
          state.prediction = null;
          saveState();
          playTone(540, 0.08);
          renderRoom1();
        });
      });
      return;
    }

    document.querySelectorAll("[data-prediction]").forEach(button => {
      button.addEventListener("click", () => {
        state.prediction = Number(button.dataset.prediction);
        saveState();
        renderRoom1();
      });
    });

    document.querySelector("#changeQuestion")?.addEventListener("click", () => {
      state.questionId = null;
      state.prediction = null;
      saveState();
      renderRoom1();
    });

    document.querySelector("#confirmQuestion")?.addEventListener("click", () => {
      if (state.prediction === null) {
        showToast("먼저 처음 생각과 가장 가까운 답을 골라 주세요.");
        return;
      }
      state.evidence.room1 = `나의 첫 생각: ${currentQuestion().predictions[state.prediction]}`;
      completeRoom("room1", "room2", "파란 관찰 조각을 얻었어요!", "질문을 들고 약초 온실로 이동합니다.");
    });
  }

  function room1MissionMarkup() {
    if (!state.questionId) {
      return `
        <section class="mission-card">
          <span class="mission-badge">1번째 방 · 질문</span>
          <h2>잠든 초상화의 회랑</h2>
          <p class="lead">세 질문 중 하나를 선택하세요. 선택한 질문은 마지막 방까지 이어집니다.</p>
          <div class="question-grid">
            ${Object.entries(QUESTIONS).map(([id, q]) => `
              <button class="question-card" data-question="${id}" type="button">
                <span class="question-icon">${q.icon}</span>
                <strong>${q.title}</strong>
              </button>`).join("")}
          </div>
        </section>`;
    }

    const q = currentQuestion();
    return `
      <section class="mission-card">
        <span class="mission-badge">1번째 방 · 질문</span>
        <h2>${q.title}</h2>
        <p class="lead">${q.predictionPrompt}</p>
        <div class="choice-list">
          ${q.predictions.map((text, index) => `
            <button class="choice-button ${state.prediction === index ? "selected" : ""}" data-prediction="${index}" type="button">${text}</button>
          `).join("")}
        </div>
        <div class="button-row">
          <button id="changeQuestion" class="secondary-button" type="button">질문 다시 고르기</button>
          <button id="confirmQuestion" class="primary-button" type="button" ${state.prediction === null ? "disabled" : ""}>이 질문으로 출발</button>
        </div>
      </section>`;
  }

  function renderRoom2() {
    setBackground("room2");
    const complete = state.completedRooms.includes("room2");
    if (complete) {
      els.content.innerHTML = completedRoomMarkup("약초의 특징을 비교했어요.", state.evidence.room2, "room3");
      bindReopenPortal("room3", "room2", "초록 비교 조각과 함께 우편실로 이동해요.");
      return;
    }

    const specimens = [
      { id: "moonleaf", icon: "🌿", name: "달잎풀", note: "푸른빛이 약하고 잎이 아래로 처졌어요." },
      { id: "dewflower", icon: "🪻", name: "이슬꽃", note: "푸른빛이 약하고 꽃잎이 닫혀 있어요." },
      { id: "sunvine", icon: "🌻", name: "햇빛덩굴", note: "금빛이 밝고 줄기가 중앙탑 쪽을 향해요." }
    ];
    const observedAll = runtime.room2Observed.size === specimens.length;

    els.content.innerHTML = `
      <section class="mission-card">
        <span class="mission-badge">2번째 방 · 비교와 분류</span>
        <h2>뒤섞인 마법 약초 온실</h2>
        <p>세 식물을 모두 관찰한 뒤, 특징이 다른 하나를 찾아보세요.</p>
        <div class="specimen-grid">
          ${specimens.map(item => `
            <button class="specimen ${runtime.room2Observed.has(item.id) ? "observed" : ""}" data-specimen="${item.id}" type="button">
              <span>${item.icon}</span><strong>${item.name}</strong>
            </button>`).join("")}
        </div>
        <p class="mission-progress">관찰 ${runtime.room2Observed.size} / 3</p>
        <div class="observation-note">${runtime.room2Note}</div>
        ${observedAll ? `
          <h3>어떤 식물의 특징이 다른가요?</h3>
          <div class="button-row">
            ${specimens.map(item => `<button class="secondary-button" data-odd="${item.id}" type="button">${item.name}</button>`).join("")}
          </div>` : ""}
      </section>`;

    document.querySelectorAll("[data-specimen]").forEach(button => {
      button.addEventListener("click", () => {
        const item = specimens.find(specimen => specimen.id === button.dataset.specimen);
        runtime.room2Observed.add(item.id);
        runtime.room2Note = `<strong>${item.name}</strong>: ${item.note}`;
        playTone(480 + runtime.room2Observed.size * 60, 0.08);
        renderRoom2();
      });
    });

    document.querySelectorAll("[data-odd]").forEach(button => {
      button.addEventListener("click", () => {
        if (button.dataset.odd !== "sunvine") {
          showToast("두 식물의 빛과 잎 모양을 다시 비교해 보세요.");
          playTone(210, 0.12);
          return;
        }
        state.evidence.room2 = currentQuestion().evidences.room2;
        completeRoom("room2", "room3", "초록 비교 조각을 얻었어요!", state.evidence.room2);
      });
    });
  }

  function renderRoom3() {
    setBackground("room3");
    const complete = state.completedRooms.includes("room3");
    if (complete) {
      els.content.innerHTML = completedRoomMarkup("별가루의 이동 순서를 찾았어요.", state.evidence.room3, "room4");
      bindReopenPortal("room4", "room3", "노란 길 조각과 함께 음악 계단으로 이동해요.");
      return;
    }

    const routes = [
      { id: "gallery", icon: "🖼️", name: "초상화 회랑", dust: "별가루 ✦" },
      { id: "mail", icon: "🧹", name: "빗자루 우편실", dust: "별가루 ✦✦" },
      { id: "stairs", icon: "🎵", name: "음악 계단", dust: "별가루 ✦✦✦" }
    ];

    els.content.innerHTML = `
      <section class="mission-card">
        <span class="mission-badge">3번째 방 · 순서와 경로</span>
        <h2>잃어버린 빗자루 우편실</h2>
        <p>별가루가 적은 장소부터 많은 장소 순서로 눌러 이동 경로를 완성하세요.</p>
        <div class="route-grid">
          ${routes.map(item => `
            <button class="route-card ${runtime.room3Sequence.includes(item.id) ? "selected" : ""}" data-route="${item.id}" type="button">
              <span>${item.icon}</span><strong>${item.name}</strong><small>${item.dust}</small>
            </button>`).join("")}
        </div>
        <div class="sequence-box">
          ${runtime.room3Sequence.length
            ? runtime.room3Sequence.map(id => routes.find(item => item.id === id).name).join(" → ")
            : "장소를 순서대로 선택해 주세요."}
        </div>
        <div class="button-row">
          <button id="clearRoute" class="secondary-button" type="button">순서 지우기</button>
          <button id="checkRoute" class="primary-button" type="button" ${runtime.room3Sequence.length !== 3 ? "disabled" : ""}>경로 확인</button>
        </div>
      </section>`;

    document.querySelectorAll("[data-route]").forEach(button => {
      button.addEventListener("click", () => {
        const id = button.dataset.route;
        if (!runtime.room3Sequence.includes(id) && runtime.room3Sequence.length < 3) {
          runtime.room3Sequence.push(id);
          playTone(430 + runtime.room3Sequence.length * 90, 0.08);
          renderRoom3();
        }
      });
    });

    document.querySelector("#clearRoute").addEventListener("click", () => {
      runtime.room3Sequence = [];
      renderRoom3();
    });

    document.querySelector("#checkRoute").addEventListener("click", () => {
      const answer = runtime.room3Sequence.join(",");
      if (answer !== "gallery,mail,stairs") {
        runtime.room3Sequence = [];
        showToast("별가루 표시의 개수를 다시 살펴보세요.");
        playTone(200, 0.12);
        renderRoom3();
        return;
      }
      state.evidence.room3 = currentQuestion().evidences.room3;
      completeRoom("room3", "room4", "노란 길 조각을 얻었어요!", state.evidence.room3);
    });
  }

  function renderRoom4() {
    setBackground("room4");
    const complete = state.completedRooms.includes("room4");
    if (complete) {
      els.content.innerHTML = completedRoomMarkup("반복되는 빛의 규칙을 찾았어요.", state.evidence.room4, "room5");
      bindReopenPortal("room5", "room4", "분홍 규칙 조각과 함께 중앙탑으로 이동해요.");
      return;
    }

    els.content.innerHTML = `
      <section class="mission-card">
        <span class="mission-badge">4번째 방 · 규칙과 예측</span>
        <h2>조용한 마법 음악 계단</h2>
        <p>빛나는 계단의 규칙을 보고 물음표 자리에 올 모양을 예측하세요.</p>
        <div class="pattern-sequence" aria-label="달, 별, 별, 달, 별, 별, 물음표">
          <span class="pattern-chip">🌙</span><span class="pattern-chip">⭐</span><span class="pattern-chip">⭐</span>
          <span class="pattern-chip">🌙</span><span class="pattern-chip">⭐</span><span class="pattern-chip">⭐</span>
          <span class="pattern-chip mystery">?</span>
        </div>
        <div class="pattern-options">
          <button class="pattern-option" data-pattern="moon" type="button"><span>🌙</span>달</button>
          <button class="pattern-option" data-pattern="star" type="button"><span>⭐</span>별</button>
          <button class="pattern-option" data-pattern="bell" type="button"><span>🔔</span>종</button>
        </div>
        <p class="helper-text">모양을 누르면 서로 다른 마법 소리도 들을 수 있어요.</p>
      </section>`;

    document.querySelectorAll("[data-pattern]").forEach(button => {
      button.addEventListener("click", () => {
        const tones = { moon: 420, star: 650, bell: 840 };
        playTone(tones[button.dataset.pattern], 0.13);
        if (button.dataset.pattern !== "moon") {
          showToast("세 개씩 반복되는 묶음을 다시 찾아보세요.");
          return;
        }
        state.evidence.room4 = currentQuestion().evidences.room4;
        completeRoom("room4", "room5", "분홍 규칙 조각을 얻었어요!", state.evidence.room4);
      });
    });
  }

  function renderRoom5() {
    setBackground("room5");
    const q = currentQuestion();
    if (!q) {
      go("room1");
      return;
    }

    const evidenceOptions = [
      { id: "room2", label: "약초 온실 단서", text: state.evidence.room2 || "아직 찾지 못했어요." },
      { id: "room3", label: "빗자루 우편실 단서", text: state.evidence.room3 || "아직 찾지 못했어요." },
      { id: "room4", label: "음악 계단 단서", text: state.evidence.room4 || "아직 찾지 못했어요." },
      { id: "distractor", label: "그 밖의 관찰", text: "중앙탑의 창문 밖에는 초승달이 보였어요." }
    ];

    els.content.innerHTML = `
      <section class="final-card">
        <span class="mission-badge">5번째 방 · 연결과 성찰</span>
        <h2>별빛 중앙탑</h2>
        <p class="selected-question">최종 질문: ${q.title}</p>

        <div class="final-section">
          <h3>1. 질문의 답을 선택하세요.</h3>
          <div class="choice-list">
            ${q.answers.map(answer => `
              <button class="choice-button ${state.finalAnswer === answer.id ? "selected" : ""}" data-final-answer="${answer.id}" type="button">${answer.text}</button>
            `).join("")}
          </div>
        </div>

        <div class="final-section">
          <h3>2. 답을 뒷받침하는 단서를 2개 이상 고르세요.</h3>
          <div class="evidence-choices">
            ${evidenceOptions.map(item => `
              <label class="evidence-choice">
                <input type="checkbox" value="${item.id}" ${state.selectedEvidence.includes(item.id) ? "checked" : ""}
                  ${item.id !== "distractor" && !state.evidence[item.id] ? "disabled" : ""}>
                <span><strong>${item.label}</strong><br><small>${item.text}</small></span>
              </label>`).join("")}
          </div>
        </div>

        <div class="final-section">
          <h3>3. 나의 탐구를 돌아보세요.</h3>
          <div class="reflection-grid">
            <label class="field-label">처음 생각과 비교하면
              <select id="reflectionChange">
                <option value="">선택하기</option>
                <option value="same" ${state.reflectionChange === "same" ? "selected" : ""}>처음 생각과 같았어요.</option>
                <option value="changed" ${state.reflectionChange === "changed" ? "selected" : ""}>단서를 보고 생각이 달라졌어요.</option>
              </select>
            </label>
            <label class="field-label">가장 도움이 된 단서
              <select id="reflectionClue">
                <option value="">선택하기</option>
                <option value="room2" ${state.reflectionClue === "room2" ? "selected" : ""}>약초 온실 단서</option>
                <option value="room3" ${state.reflectionClue === "room3" ? "selected" : ""}>빗자루 우편실 단서</option>
                <option value="room4" ${state.reflectionClue === "room4" ? "selected" : ""}>음악 계단 단서</option>
              </select>
            </label>
          </div>
        </div>

        <div class="button-row">
          <button id="openBookFromFinal" class="secondary-button" type="button">단서책 다시 보기</button>
          <button id="submitFinal" class="primary-button" type="button">별씨앗 깨우기</button>
        </div>
      </section>`;

    document.querySelectorAll("[data-final-answer]").forEach(button => {
      button.addEventListener("click", () => {
        state.finalAnswer = button.dataset.finalAnswer;
        saveState();
        renderRoom5();
      });
    });

    document.querySelectorAll('.evidence-choice input[type="checkbox"]').forEach(input => {
      input.addEventListener("change", () => {
        state.selectedEvidence = [...document.querySelectorAll('.evidence-choice input:checked')].map(item => item.value);
        saveState();
      });
    });

    document.querySelector("#reflectionChange").addEventListener("change", event => {
      state.reflectionChange = event.target.value;
      saveState();
    });

    document.querySelector("#reflectionClue").addEventListener("change", event => {
      state.reflectionClue = event.target.value;
      saveState();
    });

    document.querySelector("#openBookFromFinal").addEventListener("click", openEvidenceBook);
    document.querySelector("#submitFinal").addEventListener("click", evaluateFinal);
  }

  function evaluateFinal() {
    const q = currentQuestion();
    const relevantEvidence = state.selectedEvidence.filter(id => ["room2", "room3", "room4"].includes(id));
    const completeReflection = Boolean(state.reflectionChange && state.reflectionClue);

    if (!state.finalAnswer || state.selectedEvidence.length < 2 || !completeReflection) {
      showToast("답, 근거 2개, 성찰 두 항목을 모두 완성해 주세요.");
      playTone(220, 0.12);
      return;
    }

    const correctAnswer = state.finalAnswer === q.correct;
    const enoughEvidence = relevantEvidence.length >= 2;

    if (correctAnswer && enoughEvidence) {
      if (!state.completedRooms.includes("room5")) state.completedRooms.push("room5");
      state.evidence.room5 = "여러 방의 단서를 연결해 최종 질문을 해결했어요.";
      state.retryReason = "";
      state.screen = "good";
      saveState();
      playSuccessSound();
      render();
      return;
    }

    if (!correctAnswer && !enoughEvidence) {
      state.retryReason = "답과 근거를 모두 다시 연결해 볼 필요가 있어요.";
    } else if (!correctAnswer) {
      state.retryReason = "모은 단서는 좋지만, 단서가 가리키는 답을 다시 생각해 보세요.";
    } else {
      state.retryReason = "답은 맞았지만, 그 답을 뒷받침하는 단서가 더 필요해요.";
    }
    state.screen = "retry";
    saveState();
    playTone(190, 0.18);
    render();
  }

  function renderGoodEnding() {
    setBackground("good");
    els.content.innerHTML = `
      <section class="ending-card">
        <div class="ending-stars">✦ ✦ ✦ ✦ ✦</div>
        <p class="eyebrow">굿엔딩 · 다시 빛나는 학교</p>
        <h2>별씨앗이 깨어났어요!</h2>
        <p class="lead">질문을 끝까지 놓지 않고, 여러 단서를 연결해 답을 찾았습니다. 마법학교의 모든 방에 별빛이 돌아왔어요.</p>
        <p><strong>해결한 질문</strong><br>${currentQuestion()?.title || ""}</p>
        <div class="button-row">
          <button id="goodBook" class="secondary-button" type="button">나의 단서 보기</button>
          <button id="restartGood" class="primary-button" type="button">다른 질문으로 다시 탐험</button>
        </div>
      </section>`;
    document.querySelector("#goodBook").addEventListener("click", openEvidenceBook);
    document.querySelector("#restartGood").addEventListener("click", () => els.resetDialog.showModal());
  }

  function renderRetryEnding() {
    setBackground("retry");
    els.content.innerHTML = `
      <section class="ending-card">
        <div class="ending-stars">✦ · · · ✦</div>
        <p class="eyebrow">재도전 엔딩 · 꺼진 별빛</p>
        <h2>별씨앗이 아직 잠들어 있어요.</h2>
        <p class="lead">${state.retryReason || "단서들을 다시 살펴보고 답을 한 번 더 연결해 보세요."}</p>
        <p>모은 단서는 사라지지 않아요. 필요한 방만 다시 살펴볼 수 있습니다.</p>
        <div class="button-row">
          <button id="retryBook" class="secondary-button" type="button">단서책 보기</button>
          <button id="retryRooms" class="secondary-button" type="button">2번 방부터 확인</button>
          <button id="retryTower" class="primary-button" type="button">중앙탑 다시 도전</button>
        </div>
      </section>`;
    document.querySelector("#retryBook").addEventListener("click", openEvidenceBook);
    document.querySelector("#retryRooms").addEventListener("click", () => go("room2"));
    document.querySelector("#retryTower").addEventListener("click", () => go("room5"));
  }

  function completedRoomMarkup(title, evidence, nextScreen) {
    return `
      <section class="mission-card">
        <span class="mission-badge">미션 완료</span>
        <h2>${title}</h2>
        <div class="room-complete"><strong>찾은 단서</strong><p>${evidence}</p></div>
        <div class="button-row">
          <button class="secondary-button" id="reviewBook" type="button">단서책 보기</button>
          <button class="primary-button" id="reopenPortal" data-next="${nextScreen}" type="button">포탈 다시 열기</button>
        </div>
      </section>`;
  }

  function bindReopenPortal(nextScreen, roomId, text) {
    document.querySelector("#reviewBook")?.addEventListener("click", openEvidenceBook);
    document.querySelector("#reopenPortal")?.addEventListener("click", () => {
      openPortal(nextScreen, roomId, "포탈이 다시 열렸어요!", text);
    });
  }

  function completeRoom(roomId, nextScreen, title, text) {
    if (!state.completedRooms.includes(roomId)) state.completedRooms.push(roomId);
    saveState();
    playSuccessSound();
    openPortal(nextScreen, roomId, title, text);
    renderProgress();
  }

  function openPortal(nextScreen, roomId, title, text) {
    els.portalTitle.textContent = title;
    els.portalText.textContent = text;
    els.portalFragment.src = FRAGMENTS[roomId];
    els.portalFragment.alt = `${roomId}에서 획득한 별빛 조각`;
    els.portalNextButton.textContent = nextScreen === "room5" ? "중앙탑으로 이동" : "다음 방으로 이동";
    els.portalNextButton.onclick = () => {
      els.portalDialog.close();
      go(nextScreen);
    };
    const sprite = els.portalDialog.querySelector(".portal-sprite");
    sprite.style.animation = "none";
    void sprite.offsetWidth;
    sprite.style.animation = "";
    els.portalDialog.showModal();
  }

  function openEvidenceBook() {
    const q = currentQuestion();
    els.selectedQuestionLabel.textContent = q ? `나의 질문: ${q.title}` : "아직 질문을 선택하지 않았어요.";
    const entries = [
      { room: "room1", title: "질문의 방", fragment: FRAGMENTS.room1 },
      { room: "room2", title: "약초 온실", fragment: FRAGMENTS.room2 },
      { room: "room3", title: "빗자루 우편실", fragment: FRAGMENTS.room3 },
      { room: "room4", title: "음악 계단", fragment: FRAGMENTS.room4 },
      { room: "room5", title: "중앙탑 성찰", fragment: FRAGMENTS.room5 }
    ];
    els.evidenceList.innerHTML = entries.map(entry => {
      const evidence = state.evidence[entry.room];
      return evidence
        ? `<article class="evidence-entry"><img src="${entry.fragment}" alt=""><h3>${entry.title}</h3><p>${evidence}</p></article>`
        : `<article class="evidence-entry locked"><span>🔒<br>${entry.title}<br>아직 단서가 없어요.</span></article>`;
    }).join("");
    els.evidenceDialog.showModal();
  }

  function showToast(message) {
    clearTimeout(runtime.toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("show");
    runtime.toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2400);
  }

  function playTone(frequency = 520, duration = 0.1) {
    if (!state.sound) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration + 0.02);
      oscillator.onended = () => ctx.close();
    } catch {
      // Sound is optional. The game remains fully usable without Web Audio.
    }
  }

  function playSuccessSound() {
    if (!state.sound) return;
    [520, 660, 820].forEach((frequency, index) => {
      setTimeout(() => playTone(frequency, 0.12), index * 110);
    });
  }

  els.soundButton.addEventListener("click", () => {
    state.sound = !state.sound;
    saveState();
    els.soundButton.textContent = state.sound ? "🔊" : "🔇";
    if (state.sound) playTone(620, 0.08);
  });

  els.homeButton.addEventListener("click", () => {
    state.resumeScreen = state.screen;
    state.screen = "title";
    saveState();
    render();
  });

  els.evidenceButton.addEventListener("click", openEvidenceBook);
  els.closeEvidenceButton.addEventListener("click", () => els.evidenceDialog.close());
  els.cancelResetButton.addEventListener("click", () => els.resetDialog.close());
  els.confirmResetButton.addEventListener("click", () => {
    els.resetDialog.close();
    resetState(true);
  });

  [els.portalDialog, els.evidenceDialog, els.resetDialog].forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target === dialog && dialog !== els.portalDialog) dialog.close();
    });
  });

  render();
})();

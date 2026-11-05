(() => {
  "use strict";

  const STORAGE_KEY = "magicSchoolInquiryStateV1";
  const BGM_VOLUME = 0.3;

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

  const EXPLORATION_ROOMS = {
    room2: {
      title: "뒤섞인 마법 약초 온실",
      badge: "2번째 방 · 관찰과 비교",
      next: "room3",
      fragmentTitle: "초록 탐구 조각을 얻었어요!",
      portalText: "질문과 관련된 약초 온실의 단서를 찾았습니다.",
      objects: [
        {
          id: "moonleaf", icon: "🌿", name: "빛을 잃은 달잎풀", x: 23, y: 63,
          clues: {
            cause: { relevant: true, text: "달잎풀의 빛줄기가 중앙탑의 별씨앗이 갈라진 순간부터 끊겨 있어요." },
            trail: { relevant: false, text: "잎은 어두워졌지만 별빛이 지나간 흔적은 보이지 않아요." },
            restore: { relevant: true, text: "두 갈래 잎을 서로 연결하자 아주 작은 별빛이 다시 켜졌어요." }
          }
        },
        {
          id: "vent", icon: "🌀", name: "천장의 바람 구멍", x: 72, y: 34,
          clues: {
            cause: { relevant: false, text: "바람은 평소와 같은 방향으로 불고 있어요." },
            trail: { relevant: true, text: "푸른 별가루가 바람 구멍을 지나 중앙탑 쪽으로 이어져 있어요." },
            restore: { relevant: false, text: "바람을 세게 불어도 꺼진 약초는 깨어나지 않아요." }
          }
        },
        {
          id: "wateringCrystal", icon: "💧", name: "별빛 물주기 수정", x: 72, y: 70,
          clues: {
            cause: { relevant: true, text: "수정에 기록된 빛의 파동이 중앙탑에서 먼저 멈춘 것을 보여 줘요." },
            trail: { relevant: true, text: "수정 안의 별빛이 온실에서 우편실 방향으로 움직이고 있어요." },
            restore: { relevant: true, text: "수정 조각을 올바른 홈에 놓자 주변 약초가 잠깐 반짝였어요." }
          }
        }
      ]
    },
    room3: {
      title: "멈춰 버린 빗자루 우편실",
      badge: "3번째 방 · 순서와 경로",
      next: "room4",
      fragmentTitle: "노란 길 조각을 얻었어요!",
      portalText: "별빛이 지나간 순서와 방향을 확인했습니다.",
      objects: [
        {
          id: "portraitSeal", icon: "🖼️", name: "초상화 우편 도장", x: 18, y: 48,
          clues: {
            cause: { relevant: true, text: "도장의 시간이 중앙탑의 별씨앗이 갈라진 때와 정확히 같아요." },
            trail: { relevant: true, text: "첫 번째 별가루 흔적은 초상화 회랑에서 시작되었어요." },
            restore: { relevant: false, text: "도장을 여러 번 찍어도 빗자루는 움직이지 않아요." }
          }
        },
        {
          id: "sortingDesk", icon: "✉️", name: "별가루 분류대", x: 51, y: 72,
          clues: {
            cause: { relevant: true, text: "중앙탑과 연결된 우편부터 차례로 멈췄다는 기록이 남아 있어요." },
            trail: { relevant: true, text: "별가루의 양이 회랑, 우편실, 음악 계단 순서로 많아져요." },
            restore: { relevant: true, text: "편지를 별가루 개수 순서로 놓자 첫 번째 빗자루가 움직였어요." }
          }
        },
        {
          id: "towerDoor", icon: "🚪", name: "중앙탑 배달문", x: 82, y: 47,
          clues: {
            cause: { relevant: false, text: "문은 잠겨 있지만 문 자체에는 고장이 없어요." },
            trail: { relevant: true, text: "가장 진한 별가루 발자국이 음악 계단과 중앙탑 방향으로 이어져요." },
            restore: { relevant: true, text: "조각, 나침반, 포탈 순서로 문양을 누르자 문의 불빛이 돌아왔어요." }
          }
        }
      ]
    },
    room4: {
      title: "조용한 마법 음악 계단",
      badge: "4번째 방 · 규칙과 예측",
      next: "room5",
      fragmentTitle: "분홍 규칙 조각을 얻었어요!",
      portalText: "반복되는 빛과 소리의 규칙을 발견했습니다.",
      objects: [
        {
          id: "glowingSteps", icon: "🎼", name: "빛나는 세 계단", x: 26, y: 70,
          clues: {
            cause: { relevant: false, text: "계단의 돌은 깨지지 않았고 소리도 정상이에요." },
            trail: { relevant: true, text: "계단의 별빛이 아래에서 위, 중앙탑 쪽으로 차례로 이동했어요." },
            restore: { relevant: true, text: "달-별-별의 반복 순서로 밟자 계단의 불빛이 되살아났어요." }
          }
        },
        {
          id: "musicBell", icon: "🔔", name: "멈춘 마법 종", x: 54, y: 38,
          clues: {
            cause: { relevant: true, text: "종의 마지막 울림이 별씨앗이 갈라진 순간에 갑자기 끊겼어요." },
            trail: { relevant: false, text: "종 주변에는 별가루가 거의 남아 있지 않아요." },
            restore: { relevant: true, text: "반복 박자에 맞춰 종을 울리자 분홍빛 조각이 반응했어요." }
          }
        },
        {
          id: "towerWindow", icon: "🔭", name: "중앙탑 관측창", x: 82, y: 55,
          clues: {
            cause: { relevant: true, text: "모든 마법선이 중앙탑의 갈라진 별씨앗에서 끊긴 모습이 보여요." },
            trail: { relevant: true, text: "사라진 별빛의 마지막 반짝임이 중앙탑 안에서 가장 강해요." },
            restore: { relevant: false, text: "창문을 열고 닫아도 마법선에는 변화가 없어요." }
          }
        }
      ]
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
    foundClues: { room2: [], room3: [], room4: [] },
    inspectedObjects: { room2: [], room3: [], room4: [] },
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
    toastTimer: null,
    exploration: null,
    heldDirections: new Set(),
    pendingExplorationComplete: null
  };

  const els = {
    scene: document.querySelector("#scene"),
    content: document.querySelector("#content"),
    topBar: document.querySelector("#topBar"),
    progressNav: document.querySelector("#progressNav"),
    actorLayer: document.querySelector("#actorLayer"),
    heroSprite: document.querySelector("#heroSprite"),
    backgroundMusic: document.querySelector("#backgroundMusic"),
    soundButton: document.querySelector("#soundButton"),
    homeButton: document.querySelector("#homeButton"),
    evidenceButton: document.querySelector("#evidenceButton"),
    toast: document.querySelector("#toast"),
    portalDialog: document.querySelector("#portalDialog"),
    portalFragment: document.querySelector("#portalFragment"),
    portalTitle: document.querySelector("#portalTitle"),
    portalText: document.querySelector("#portalText"),
    portalNextButton: document.querySelector("#portalNextButton"),
    clueDialog: document.querySelector("#clueDialog"),
    clueIcon: document.querySelector("#clueIcon"),
    clueKind: document.querySelector("#clueKind"),
    clueTitle: document.querySelector("#clueTitle"),
    clueText: document.querySelector("#clueText"),
    clueContinueButton: document.querySelector("#clueContinueButton"),
    evidenceDialog: document.querySelector("#evidenceDialog"),
    closeEvidenceButton: document.querySelector("#closeEvidenceButton"),
    evidenceList: document.querySelector("#evidenceList"),
    selectedQuestionLabel: document.querySelector("#selectedQuestionLabel"),
    resetDialog: document.querySelector("#resetDialog"),
    cancelResetButton: document.querySelector("#cancelResetButton"),
    confirmResetButton: document.querySelector("#confirmResetButton")
  };

  let state = loadState();
  els.backgroundMusic.volume = BGM_VOLUME;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || saved.version !== 1) return defaultState();
      const clean = { ...defaultState(), ...saved };
      clean.foundClues = { room2: [], room3: [], room4: [], ...(saved.foundClues || {}) };
      clean.inspectedObjects = { room2: [], room3: [], room4: [], ...(saved.inspectedObjects || {}) };
      return clean;
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

    const actors = state.screen === "room5";
    showActors(actors, "idle");
  }

  function render() {
    stopExploration();
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

    document.querySelector("#continueButton")?.addEventListener("click", () => {
      playBackgroundMusic();
      go(state.resumeScreen || "room1");
    });
    document.querySelector("#startButton").addEventListener("click", () => {
      playBackgroundMusic();
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
    renderExplorationRoom("room2");
  }

  function renderRoom3() {
    renderExplorationRoom("room3");
  }

  function renderRoom4() {
    renderExplorationRoom("room4");
  }

  function renderExplorationRoom(roomId) {
    setBackground(roomId);
    const room = EXPLORATION_ROOMS[roomId];
    const question = currentQuestion();
    if (!question) {
      go("room1");
      return;
    }

    if (state.completedRooms.includes(roomId)) {
      els.content.innerHTML = completedRoomMarkup(`${room.title} 탐구를 마쳤어요.`, state.evidence[roomId], room.next);
      bindReopenPortal(room.next, roomId, room.portalText);
      return;
    }

    const found = state.foundClues[roomId] || [];
    els.content.classList.add("explore-mode");
    els.content.innerHTML = `
      <section id="exploreWorld" class="explore-world" aria-label="${room.title} 탐험 화면">
        <div class="explore-hud">
          <div>
            <span class="mission-badge">${room.badge}</span>
            <h2>${room.title}</h2>
            <p><strong>나의 질문</strong> · ${question.title}</p>
          </div>
          <div class="clue-counter" aria-label="핵심 단서 ${found.length}개 중 2개">
            <span>핵심 단서</span><strong>${found.length} / 2</strong>
          </div>
        </div>

        <div class="explore-tip">방을 탐험해 보세요. 단서에 가까워지면 작은 별빛이 반짝입니다.</div>

        ${room.objects.map(object => {
          const isFound = found.includes(object.id);
          const inspected = (state.inspectedObjects[roomId] || []).includes(object.id);
          return `<div class="world-object ${isFound ? "found" : ""} ${inspected && !isFound ? "checked" : ""}"
            data-object-id="${object.id}" style="left:${object.x}%;top:${object.y}%" aria-hidden="true">
            <span class="sparkle-core">✦</span><span class="found-mark">✓</span>
          </div>`;
        }).join("")}

        <div id="explorerAvatar" class="explorer-avatar" aria-label="탐험 캐릭터"></div>
        <div id="nearbyPrompt" class="nearby-prompt">빛나는 물체를 찾아 이동해요!</div>

        <div class="explore-controls" aria-label="탐험 조작 버튼">
          <div class="dpad" aria-label="방향키">
            <button class="dpad-button up" data-direction="up" type="button" aria-label="위로 이동">▲</button>
            <button class="dpad-button left" data-direction="left" type="button" aria-label="왼쪽으로 이동">◀</button>
            <button class="dpad-button down" data-direction="down" type="button" aria-label="아래로 이동">▼</button>
            <button class="dpad-button right" data-direction="right" type="button" aria-label="오른쪽으로 이동">▶</button>
          </div>
          <button id="inspectButton" class="inspect-button" type="button"><span>🔍</span>조사</button>
        </div>
      </section>`;

    startExploration(roomId);
  }

  function startExploration(roomId) {
    const room = EXPLORATION_ROOMS[roomId];
    const avatar = document.querySelector("#explorerAvatar");
    const prompt = document.querySelector("#nearbyPrompt");
    const inspectButton = document.querySelector("#inspectButton");
    if (!avatar || !prompt || !inspectButton) return;

    runtime.exploration = {
      roomId,
      x: 50,
      y: 84,
      vx: 0,
      vy: 0,
      facingLeft: false,
      moveDirection: "down",
      walkTime: 0,
      walkFrame: -1,
      nearbyId: null,
      avatar,
      prompt,
      inspectButton,
      lastTime: performance.now(),
      raf: null
    };
    runtime.heldDirections.clear();

    document.querySelectorAll("[data-direction]").forEach(button => {
      const start = event => {
        event.preventDefault();
        runtime.heldDirections.add(button.dataset.direction);
      };
      const end = event => {
        event.preventDefault();
        runtime.heldDirections.delete(button.dataset.direction);
      };
      button.addEventListener("pointerdown", start);
      button.addEventListener("pointerup", end);
      button.addEventListener("pointercancel", end);
      button.addEventListener("pointerleave", end);
    });
    inspectButton.addEventListener("click", inspectNearbyObject);

    updateExplorerView(room);
    runtime.exploration.raf = requestAnimationFrame(explorationLoop);
  }

  function stopExploration() {
    if (runtime.exploration?.raf) cancelAnimationFrame(runtime.exploration.raf);
    runtime.exploration = null;
    runtime.heldDirections.clear();
  }

  function explorationLoop(now) {
    const explorer = runtime.exploration;
    if (!explorer) return;
    const room = EXPLORATION_ROOMS[explorer.roomId];
    const delta = Math.min((now - explorer.lastTime) / 1000, 0.05);
    explorer.lastTime = now;
    const speed = 22;
    let dx = 0;
    let dy = 0;
    if (runtime.heldDirections.has("left")) dx -= 1;
    if (runtime.heldDirections.has("right")) dx += 1;
    if (runtime.heldDirections.has("up")) dy -= 1;
    if (runtime.heldDirections.has("down")) dy += 1;
    if (dx && dy) {
      dx *= 0.707;
      dy *= 0.707;
    }

    const targetVx = dx * speed;
    const targetVy = dy * speed;
    const easing = 1 - Math.exp(-(dx || dy ? 10 : 15) * delta);
    explorer.vx += (targetVx - explorer.vx) * easing;
    explorer.vy += (targetVy - explorer.vy) * easing;
    if (Math.abs(explorer.vx) < 0.08 && !dx) explorer.vx = 0;
    if (Math.abs(explorer.vy) < 0.08 && !dy) explorer.vy = 0;

    const nextX = explorer.x + explorer.vx * delta;
    const nextY = explorer.y + explorer.vy * delta;
    explorer.x = Math.max(6, Math.min(94, nextX));
    explorer.y = Math.max(27, Math.min(86, nextY));
    if (explorer.x !== nextX) explorer.vx = 0;
    if (explorer.y !== nextY) explorer.vy = 0;

    const movingSpeed = Math.hypot(explorer.vx, explorer.vy);
    const walking = movingSpeed > 0.55;
    if (walking) {
      if (Math.abs(explorer.vy) > Math.abs(explorer.vx) * 0.82) {
        explorer.moveDirection = explorer.vy < 0 ? "up" : "down";
      } else {
        explorer.moveDirection = "side";
        if (explorer.vx < -0.6) explorer.facingLeft = true;
        if (explorer.vx > 0.6) explorer.facingLeft = false;
      }
    }
    explorer.avatar.classList.toggle("walking", walking);
    explorer.avatar.classList.toggle("face-left", explorer.moveDirection === "side" && explorer.facingLeft);
    explorer.avatar.classList.toggle("vertical", explorer.moveDirection !== "side");
    updateWalkFrame(explorer, delta, walking, movingSpeed / speed, explorer.moveDirection);
    updateExplorerView(room);
    explorer.raf = requestAnimationFrame(explorationLoop);
  }

  function updateWalkFrame(explorer, delta, walking, speedRatio, direction) {
    const vertical = direction === "up" || direction === "down";
    explorer.avatar.style.backgroundImage = vertical
      ? 'url("./assets/sprites/hero-vertical-4x2.png")'
      : 'url("./assets/sprites/hero-movement-6x2.png")';
    explorer.avatar.style.backgroundSize = vertical ? "400% 200%" : "600% 200%";

    if (!walking) {
      explorer.walkTime = 0;
      explorer.walkFrame = -1;
      const idleRow = direction === "up" ? "100%" : "0%";
      explorer.avatar.style.backgroundPosition = `0% ${idleRow}`;
      explorer.avatar.style.setProperty("--frame-shift", "0px");
      explorer.avatar.style.setProperty("--step-bob", "0px");
      return;
    }

    explorer.walkTime += delta * Math.max(0.72, Math.min(1.05, speedRatio));
    const frameCount = vertical ? 4 : 6;
    const frame = Math.floor(explorer.walkTime / 0.13) % frameCount;
    explorer.walkFrame = frame;
    const positions = vertical ? [0, 33.333, 66.667, 100] : [0, 20, 40, 60, 80, 100];
    const alignment = vertical ? [0, -1, 0, 1] : [-8, 0, 0, 1, -3, 3];
    const bob = vertical ? [0, -2, 0, -2] : [0, -2, 0, -3, -1, -2];
    const signedShift = alignment[frame] * (explorer.facingLeft ? -1 : 1);
    const row = direction === "up" ? "100%" : direction === "down" ? "0%" : "100%";
    explorer.avatar.style.backgroundPosition = `${positions[frame]}% ${row}`;
    explorer.avatar.style.setProperty("--frame-shift", `${signedShift}px`);
    explorer.avatar.style.setProperty("--step-bob", `${bob[frame]}px`);
  }

  function updateExplorerView(room) {
    const explorer = runtime.exploration;
    if (!explorer) return;
    explorer.avatar.style.left = `${explorer.x}%`;
    explorer.avatar.style.top = `${explorer.y}%`;

    let nearest = null;
    let nearestDistance = Infinity;
    let hasHint = false;
    room.objects.forEach(object => {
      const dx = explorer.x - object.x;
      const dy = (explorer.y - object.y) * 1.35;
      const distance = Math.hypot(dx, dy);
      const marker = document.querySelector(`[data-object-id="${object.id}"]`);
      const inspected = (state.inspectedObjects[explorer.roomId] || []).includes(object.id);
      const proximity = !inspected && distance <= 20;
      const nearby = !inspected && distance <= 11;
      marker?.classList.toggle("proximity", proximity);
      marker?.classList.toggle("nearby", nearby);
      if (proximity) hasHint = true;
      if (!inspected && distance < nearestDistance) {
        nearest = object;
        nearestDistance = distance;
      }
    });
    explorer.nearbyId = nearest && nearestDistance <= 11 ? nearest.id : null;
    explorer.inspectButton.classList.toggle("ready", Boolean(explorer.nearbyId));
    explorer.inspectButton.disabled = !explorer.nearbyId;
    explorer.prompt.textContent = explorer.nearbyId
      ? "바로 근처에서 별빛이 강하게 반짝여요. 조사해 볼까요?"
      : hasHint ? "가까운 곳에서 희미한 별빛이 반짝여요." : "방 안을 천천히 탐험해 보세요.";
  }

  function inspectNearbyObject() {
    const explorer = runtime.exploration;
    if (!explorer?.nearbyId) {
      showToast("빛나는 물체에 조금 더 가까이 가 보세요.");
      return;
    }
    const room = EXPLORATION_ROOMS[explorer.roomId];
    const object = room.objects.find(item => item.id === explorer.nearbyId);
    const clue = object.clues[state.questionId];
    const inspected = state.inspectedObjects[explorer.roomId];
    const found = state.foundClues[explorer.roomId];
    if (!inspected.includes(object.id)) inspected.push(object.id);

    let newlyFound = false;
    if (clue.relevant && !found.includes(object.id)) {
      found.push(object.id);
      newlyFound = true;
      playSuccessSound();
    } else {
      playTone(clue.relevant ? 620 : 330, 0.1);
    }
    saveState();

    els.clueIcon.textContent = clue.relevant ? "✨" : "🔎";
    els.clueKind.textContent = clue.relevant ? `질문과 연결되는 핵심 단서 ${found.length} / 2` : "관찰했지만 다른 단서예요";
    els.clueTitle.textContent = object.name;
    els.clueText.textContent = clue.text;
    els.clueContinueButton.textContent = found.length >= 2 ? "단서 조각으로 포탈 열기" : "탐험 계속하기";
    runtime.pendingExplorationComplete = newlyFound && found.length >= 2 ? explorer.roomId : null;
    els.clueDialog.showModal();
  }

  function finishExplorationRoom(roomId) {
    const room = EXPLORATION_ROOMS[roomId];
    const found = state.foundClues[roomId];
    state.evidence[roomId] = found.map(id => {
      const object = room.objects.find(item => item.id === id);
      return object.clues[state.questionId].text;
    }).join(" ");
    completeRoom(roomId, room.next, room.fragmentTitle, room.portalText);
  }

  function refreshExplorationStatus(roomId) {
    const found = state.foundClues[roomId] || [];
    const inspected = state.inspectedObjects[roomId] || [];
    const counter = document.querySelector(".clue-counter strong");
    if (counter) counter.textContent = `${found.length} / 2`;
    document.querySelectorAll("[data-object-id]").forEach(marker => {
      const id = marker.dataset.objectId;
      const isFound = found.includes(id);
      const wasInspected = inspected.includes(id);
      marker.classList.toggle("found", isFound);
      marker.classList.toggle("checked", wasInspected && !isFound);
      marker.classList.remove("proximity", "nearby");
    });
    updateExplorerView(EXPLORATION_ROOMS[roomId]);
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

  function playBackgroundMusic() {
    if (!state.sound) {
      els.backgroundMusic.pause();
      return;
    }
    els.backgroundMusic.volume = BGM_VOLUME;
    const playRequest = els.backgroundMusic.play();
    playRequest?.catch(() => {
      // Mobile browsers may wait for the next direct button press before playing.
    });
  }

  function pauseBackgroundMusic() {
    els.backgroundMusic.pause();
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
    if (state.sound) {
      playBackgroundMusic();
      playTone(620, 0.08);
    } else {
      pauseBackgroundMusic();
    }
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

  els.clueContinueButton.addEventListener("click", () => {
    els.clueDialog.close();
    const roomId = runtime.pendingExplorationComplete;
    runtime.pendingExplorationComplete = null;
    if (roomId) finishExplorationRoom(roomId);
    else if (runtime.exploration) refreshExplorationStatus(runtime.exploration.roomId);
  });

  els.clueDialog.addEventListener("cancel", event => event.preventDefault());

  const keyToDirection = {
    ArrowUp: "up", w: "up", W: "up",
    ArrowDown: "down", s: "down", S: "down",
    ArrowLeft: "left", a: "left", A: "left",
    ArrowRight: "right", d: "right", D: "right"
  };

  window.addEventListener("keydown", event => {
    if (!runtime.exploration || els.clueDialog.open || els.portalDialog.open) return;
    const direction = keyToDirection[event.key];
    if (direction) {
      event.preventDefault();
      runtime.heldDirections.add(direction);
      return;
    }
    if ((event.key === " " || event.key === "e" || event.key === "E") && !event.repeat) {
      event.preventDefault();
      inspectNearbyObject();
    }
  });

  window.addEventListener("keyup", event => {
    const direction = keyToDirection[event.key];
    if (direction) runtime.heldDirections.delete(direction);
  });

  window.addEventListener("pointerup", () => runtime.heldDirections.clear());
  window.addEventListener("blur", () => runtime.heldDirections.clear());

  [els.portalDialog, els.evidenceDialog, els.resetDialog, els.clueDialog].forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target === dialog && ![els.portalDialog, els.clueDialog].includes(dialog)) dialog.close();
    });
  });

  render();
})();

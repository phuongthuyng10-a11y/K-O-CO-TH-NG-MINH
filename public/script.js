/**
 * ==========================================================================
 * KÉO CO TRI THỨC - GAME ENGINE (JAVASCRIPT)
 * ==========================================================================
 */

// --- 1. HỆ THỐNG ÂM THANH TỔNG HỢP (WEB AUDIO API) ---
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, duration, type = 'sine', gainVal = 0.15) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.error(e);
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'triangle', 0.2);
      }, idx * 75);
    });
  }

  playWrong() {
    if (!this.enabled) return;
    this.init();
    this.playTone(196, 0.35, 'sawtooth', 0.18);
    setTimeout(() => {
      this.playTone(130.81, 0.45, 'sawtooth', 0.2);
    }, 120);
  }

  playWhistle() {
    if (!this.enabled) return;
    this.init();
    this.playTone(1800, 0.25, 'sine', 0.2);
    setTimeout(() => {
      this.playTone(2200, 0.4, 'sine', 0.22);
    }, 120);
  }

  playTick() {
    if (!this.enabled) return;
    this.playTone(880, 0.04, 'sine', 0.08);
  }

  playTension() {
    if (!this.enabled) return;
    this.playTone(120, 0.3, 'triangle', 0.25);
  }

  playCheer() {
    if (!this.enabled) return;
    this.init();
    const fan = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
    fan.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 0.3, 'sine', 0.2);
      }, i * 110);
    });
  }
}

const soundFX = new SoundSystem();

// --- 2. HIỆU ỨNG PHÁO HOA ĂN MỪNG (CONFETTI PARTICLES) ---
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#2563eb', '#dc2626', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      life: 1,
      decay: Math.random() * 0.015 + 0.008
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      if (p.life > 0) {
        active = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // trọng lực
        p.rotation += p.vRot;
        p.life -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }
    });

    if (active) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(animate);
}

// --- 3. TRẠNG THÁI TRÒ CHƠI (GAME STATE) ---
let customQuestionBank = loadQuestionBank();

let gameState = {
  mode: 'alternating', // 'alternating' (Đấu Luân Phiên) | 'parallel' (Đấu Song Song)
  opponentType: 'pvp', // 'pvp' (2 Người chơi) | 'ai' (Chơi với máy)
  aiDifficulty: 'medium', // 'easy' (50%), 'medium' (75%), 'hard' (90%)
  timeLimit: 10, // giây
  timeLeft: 10,
  timerInterval: null,
  isAnswered: false,
  status: 'playing', // 'playing' | 'victory'

  team1: {
    id: 'team1',
    name: 'Đội 1 (Xanh Lam)',
    shortName: 'Đội 1',
    score: 0,
    totalAnswered: 0
  },
  team2: {
    id: 'team2',
    name: 'Đội 2 (Đỏ Rực)',
    shortName: 'Đội 2',
    score: 0,
    totalAnswered: 0
  },

  ropePosition: 0, // -5 đến +5

  // Đấu luân phiên
  activeTeamId: 'team1', // Đội đang trả lời
  turnOwnerTeamId: 'team1', // Đội sở hữu lượt ban đầu
  isTurnTransferred: false,
  transferredReason: '',
  failedPrimaryOption: null,

  team1Questions: [],
  team2Questions: [],
  team1Index: 0,
  team2Index: 0,

  // Đấu song song
  team1Answered: false,
  team2Answered: false,
  team1Selected: null,
  team2Selected: null
};

// --- 4. TÍNH TOÁN ĐÁP ÁN AI BOT ---
function computeAiChoice(correctIndex, excludedIndex = null, difficulty = 'medium') {
  const roll = Math.random();
  let correctProb = 0.75;
  if (difficulty === 'easy') correctProb = 0.50;
  else if (difficulty === 'hard') correctProb = 0.90;

  if (roll < correctProb) {
    return correctIndex;
  }

  const wrongOptions = [0, 1, 2, 3].filter(
    idx => idx !== correctIndex && idx !== excludedIndex
  );
  if (wrongOptions.length === 0) return (correctIndex + 1) % 4;
  return wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
}

// --- 5. KHỞI TẠO TRẬN ĐẤU MỚI ---
function initNewMatch() {
  clearInterval(gameState.timerInterval);

  const { team1Questions, team2Questions } = generateQuestionSets(customQuestionBank);
  gameState.team1Questions = team1Questions;
  gameState.team2Questions = team2Questions;

  gameState.team1.score = 0;
  gameState.team1.totalAnswered = 0;
  gameState.team2.score = 0;
  gameState.team2.totalAnswered = 0;

  if (gameState.opponentType === 'ai') {
    gameState.team2.name = 'Máy Tính (AI)';
    gameState.team2.shortName = 'Máy (AI)';
  } else {
    if (gameState.team2.name.includes('Máy')) {
      gameState.team2.name = 'Đội 2 (Đỏ Rực)';
      gameState.team2.shortName = 'Đội 2';
    }
  }

  gameState.team1Index = 0;
  gameState.team2Index = 0;
  gameState.ropePosition = 0;

  gameState.activeTeamId = 'team1';
  gameState.turnOwnerTeamId = 'team1';
  gameState.isTurnTransferred = false;
  gameState.transferredReason = '';
  gameState.failedPrimaryOption = null;

  gameState.isAnswered = false;
  gameState.status = 'playing';

  gameState.team1Answered = false;
  gameState.team2Answered = false;
  gameState.team1Selected = null;
  gameState.team2Selected = null;

  gameState.timeLeft = gameState.timeLimit;

  closeAllModals();
  soundFX.playWhistle();
  renderApp();

  if (gameState.mode === 'alternating') {
    startTimer();
  }
}

// --- 6. HỆ THỐNG ĐỒNG HỒ ĐẾM NGƯỢC 10 GIÂY ---
function startTimer() {
  clearInterval(gameState.timerInterval);
  if (gameState.timeLimit === null) return;

  gameState.timeLeft = gameState.timeLimit;
  updateTimerUI();

  gameState.timerInterval = setInterval(() => {
    if (gameState.isAnswered || gameState.status !== 'playing') {
      clearInterval(gameState.timerInterval);
      return;
    }

    gameState.timeLeft -= 1;
    updateTimerUI();

    if (gameState.timeLeft <= 3 && gameState.timeLeft > 0) {
      soundFX.playTick();
    }

    if (gameState.timeLeft <= 0) {
      clearInterval(gameState.timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function updateTimerUI() {
  const timerBadge = document.getElementById('turnTimerBadge');
  const timerNum = document.getElementById('turnTimerNum');
  if (!timerNum) return;

  timerNum.textContent = `${gameState.timeLeft}s`;
  if (gameState.timeLeft <= 3) {
    timerBadge?.classList.add('urgent');
  } else {
    timerBadge?.classList.remove('urgent');
  }
}

// Khi hết 10 giây mà chưa trả lời
function handleTimeout() {
  if (gameState.isAnswered) return;
  soundFX.playWrong();

  // Nếu đội chủ lượt bị hết giờ: Chuyển lượt sang đối phương cướp điểm!
  if (!gameState.isTurnTransferred) {
    gameState.isTurnTransferred = true;
    gameState.transferredReason = `${gameState.turnOwnerTeamId === 'team1' ? gameState.team1.name : gameState.team2.name} HẾT 10 GIÂY! Quyền trả lời chuyển sang đối phương để cướp điểm!`;
    gameState.activeTeamId = gameState.turnOwnerTeamId === 'team1' ? 'team2' : 'team1';
    gameState.failedPrimaryOption = null;

    renderApp();
    startTimer();

    // Nếu chuyển lượt sang AI máy tính, cho AI suy nghĩ và chọn
    checkTriggerAiTurn();
  } else {
    // Đội cướp điểm cũng hết giờ: Chuyển câu hỏi kế tiếp
    gameState.isAnswered = true;
    renderApp();
    setTimeout(() => {
      advanceNextTurn();
    }, 2500);
  }
}

// --- 7. XỬ LÝ CHỌN ĐÁP ÁN (ĐẤU LUÂN PHIÊN) ---
function handleAlternatingAnswer(choiceIndex) {
  if (gameState.isAnswered || gameState.status !== 'playing') return;
  clearInterval(gameState.timerInterval);

  const currentQ = getCurrentQuestion();
  if (!currentQ) return;

  const isCorrect = choiceIndex === currentQ.correctIndex;

  if (isCorrect) {
    soundFX.playCorrect();
    soundFX.playTension();
    gameState.isAnswered = true;

    // Đội trả lời đúng ghi điểm và kéo dây về phía mình
    if (gameState.activeTeamId === 'team1') {
      gameState.team1.score += 1;
      gameState.ropePosition = Math.max(-5, gameState.ropePosition - 1);
      triggerPullAnimation('left');
    } else {
      gameState.team2.score += 1;
      gameState.ropePosition = Math.min(5, gameState.ropePosition + 1);
      triggerPullAnimation('right');
    }

    renderApp(choiceIndex, true);
    checkVictoryCondition();

    // Tự động chuyển câu kế tiếp sau 2.5 giây
    setTimeout(() => {
      if (gameState.status === 'playing') {
        advanceNextTurn();
      }
    }, 2500);
  } else {
    soundFX.playWrong();

    // Nếu trả lời sai ở lượt đầu: Chuyển lượt sang đối thủ!
    if (!gameState.isTurnTransferred) {
      gameState.isTurnTransferred = true;
      gameState.transferredReason = `${gameState.turnOwnerTeamId === 'team1' ? gameState.team1.name : gameState.team2.name} trả lời SAI! Quyền trả lời chuyển sang đối phương!`;
      gameState.activeTeamId = gameState.turnOwnerTeamId === 'team1' ? 'team2' : 'team1';
      gameState.failedPrimaryOption = choiceIndex;

      renderApp();
      startTimer();

      checkTriggerAiTurn();
    } else {
      // Cả 2 đội đều sai
      gameState.isAnswered = true;
      renderApp(choiceIndex, false);
      setTimeout(() => {
        if (gameState.status === 'playing') {
          advanceNextTurn();
        }
      }, 2500);
    }
  }
}

// Chuyển sang lượt hỏi kế tiếp
function advanceNextTurn() {
  if (gameState.turnOwnerTeamId === 'team1') {
    gameState.team1.totalAnswered += 1;
    gameState.team1Index += 1;
    gameState.turnOwnerTeamId = 'team2';
    gameState.activeTeamId = 'team2';
  } else {
    gameState.team2.totalAnswered += 1;
    gameState.team2Index += 1;
    gameState.turnOwnerTeamId = 'team1';
    gameState.activeTeamId = 'team1';
  }

  gameState.isTurnTransferred = false;
  gameState.transferredReason = '';
  gameState.failedPrimaryOption = null;
  gameState.isAnswered = false;

  checkVictoryCondition();

  if (gameState.status === 'playing') {
    renderApp();
    startTimer();
    checkTriggerAiTurn();
  }
}

function getCurrentQuestion() {
  const isT1 = gameState.turnOwnerTeamId === 'team1';
  const list = isT1 ? gameState.team1Questions : gameState.team2Questions;
  const idx = isT1 ? gameState.team1Index : gameState.team2Index;
  return list[idx];
}

// Kiểm tra và kích hoạt lượt trả lời của AI
function checkTriggerAiTurn() {
  if (
    gameState.mode !== 'alternating' ||
    gameState.opponentType !== 'ai' ||
    gameState.activeTeamId !== 'team2' ||
    gameState.isAnswered ||
    gameState.status !== 'playing'
  ) {
    return;
  }

  const currentQ = getCurrentQuestion();
  if (!currentQ) return;

  const thinkDelay = 1500 + Math.random() * 900;
  setTimeout(() => {
    if (gameState.activeTeamId === 'team2' && !gameState.isAnswered) {
      const choice = computeAiChoice(
        currentQ.correctIndex,
        gameState.isTurnTransferred ? gameState.failedPrimaryOption : null,
        gameState.aiDifficulty
      );
      handleAlternatingAnswer(choice);
    }
  }, thinkDelay);
}

// --- 8. XỬ LÝ ĐẤU SONG SONG (PARALLEL MODE) ---
function handleParallelAnswer(teamId, choiceIndex) {
  if (gameState.status !== 'playing') return;

  if (teamId === 'team1') {
    if (gameState.team1Answered || gameState.team1.totalAnswered >= 10) return;
    const q = gameState.team1Questions[gameState.team1Index];
    if (!q) return;

    gameState.team1Answered = true;
    gameState.team1Selected = choiceIndex;
    const isCorrect = choiceIndex === q.correctIndex;

    if (isCorrect) {
      soundFX.playCorrect();
      soundFX.playTension();
      gameState.team1.score += 1;
      gameState.ropePosition = Math.max(-5, gameState.ropePosition - 1);
      triggerPullAnimation('left');
    } else {
      soundFX.playWrong();
    }

    renderApp();
    checkVictoryCondition();

    setTimeout(() => {
      gameState.team1.totalAnswered += 1;
      gameState.team1Index += 1;
      gameState.team1Answered = false;
      gameState.team1Selected = null;
      renderApp();
      checkVictoryCondition();
    }, 1800);
  } else {
    if (gameState.team2Answered || gameState.team2.totalAnswered >= 10) return;
    const q = gameState.team2Questions[gameState.team2Index];
    if (!q) return;

    gameState.team2Answered = true;
    gameState.team2Selected = choiceIndex;
    const isCorrect = choiceIndex === q.correctIndex;

    if (isCorrect) {
      soundFX.playCorrect();
      soundFX.playTension();
      gameState.team2.score += 1;
      gameState.ropePosition = Math.min(5, gameState.ropePosition + 1);
      triggerPullAnimation('right');
    } else {
      soundFX.playWrong();
    }

    renderApp();
    checkVictoryCondition();

    setTimeout(() => {
      gameState.team2.totalAnswered += 1;
      gameState.team2Index += 1;
      gameState.team2Answered = false;
      gameState.team2Selected = null;
      renderApp();
      checkVictoryCondition();
      checkTriggerParallelAi();
    }, 1800);
  }
}

// Tự động kích hoạt AI trong Đấu song song
function checkTriggerParallelAi() {
  if (
    gameState.mode !== 'parallel' ||
    gameState.opponentType !== 'ai' ||
    gameState.team2Answered ||
    gameState.team2.totalAnswered >= 10 ||
    gameState.status !== 'playing'
  ) {
    return;
  }

  const q = gameState.team2Questions[gameState.team2Index];
  if (!q) return;

  const thinkDelay = 1800 + Math.random() * 1200;
  setTimeout(() => {
    if (!gameState.team2Answered && gameState.status === 'playing') {
      const choice = computeAiChoice(q.correctIndex, null, gameState.aiDifficulty);
      handleParallelAnswer('team2', choice);
    }
  }, thinkDelay);
}

// --- 9. KIỂM TRA ĐIỀU KIỆN CHIẾN THẮNG ---
function checkVictoryCondition() {
  let winner = null;

  // 1. Dây kéo chạm mốc -5 (Đội 1 thắng tuyệt đối) hoặc +5 (Đội 2 thắng tuyệt đối)
  if (gameState.ropePosition <= -5) {
    winner = gameState.team1;
  } else if (gameState.ropePosition >= 5) {
    winner = gameState.team2;
  }
  // 2. Cả 2 đội đã hoàn thành 10 câu hỏi
  else if (gameState.team1.totalAnswered >= 10 && gameState.team2.totalAnswered >= 10) {
    if (gameState.ropePosition < 0) {
      winner = gameState.team1;
    } else if (gameState.ropePosition > 0) {
      winner = gameState.team2;
    } else {
      winner = 'draw';
    }
  }

  if (winner) {
    gameState.status = 'victory';
    clearInterval(gameState.timerInterval);
    soundFX.playCheer();
    launchConfetti();
    setTimeout(() => {
      showVictoryModal(winner);
    }, 800);
  }
}

// Hiệu ứng kéo dây
function triggerPullAnimation(direction) {
  const pullersLeft = document.getElementById('team1Pullers');
  const pullersRight = document.getElementById('team2Pullers');

  if (direction === 'left' && pullersLeft) {
    pullersLeft.classList.add('pulling-action-left');
    setTimeout(() => pullersLeft.classList.remove('pulling-action-left'), 1000);
  } else if (direction === 'right' && pullersRight) {
    pullersRight.classList.add('pulling-action-right');
    setTimeout(() => pullersRight.classList.remove('pulling-action-right'), 1000);
  }
}

// --- 10. RENDER TOÀN BỘ GIAO DIỆN CHÍNH (UI) ---
function renderApp(lastAnswerIndex = null, lastAnswerCorrect = null) {
  renderScoreHUD();
  renderArenaRope();
  renderPlayArea(lastAnswerIndex, lastAnswerCorrect);
}

// Render Thanh điểm và thông tin 2 đội
function renderScoreHUD() {
  const team1NameEl = document.getElementById('hudTeam1Name');
  const team2NameEl = document.getElementById('hudTeam2Name');
  const team1ScoreEl = document.getElementById('hudTeam1Score');
  const team2ScoreEl = document.getElementById('hudTeam2Score');
  const ropeDispEl = document.getElementById('hudRopeDisp');
  const card1 = document.getElementById('team1CardHud');
  const card2 = document.getElementById('team2CardHud');

  if (team1NameEl) team1NameEl.textContent = gameState.team1.name;
  if (team2NameEl) team2NameEl.textContent = gameState.team2.name;
  if (team1ScoreEl) team1ScoreEl.textContent = gameState.team1.score;
  if (team2ScoreEl) team2ScoreEl.textContent = gameState.team2.score;

  if (ropeDispEl) {
    const pos = gameState.ropePosition;
    if (pos < 0) {
      ropeDispEl.textContent = `⬅ ${gameState.team1.shortName} (+${Math.abs(pos)})`;
      ropeDispEl.style.color = '#2563eb';
    } else if (pos > 0) {
      ropeDispEl.textContent = `${gameState.team2.shortName} (+${pos}) ➡`;
      ropeDispEl.style.color = '#dc2626';
    } else {
      ropeDispEl.textContent = `CÂN BẰNG (0)`;
      ropeDispEl.style.color = '#475569';
    }
  }

  if (gameState.mode === 'alternating') {
    if (gameState.activeTeamId === 'team1') {
      card1?.classList.add('active-turn');
      card2?.classList.remove('active-turn');
    } else {
      card2?.classList.add('active-turn');
      card1?.classList.remove('active-turn');
    }
  } else {
    card1?.classList.remove('active-turn');
    card2?.classList.remove('active-turn');
  }
}

// Render Dây thừng và vị trí các nhân vật
function renderArenaRope() {
  const ropeContainer = document.getElementById('ropeAnimatedContainer');
  const team1Pullers = document.getElementById('team1Pullers');
  const team2Pullers = document.getElementById('team2Pullers');

  // Mỗi điểm dịch chuyển tương đương 7% chiều ngang sân
  const shiftPercent = gameState.ropePosition * 7;

  if (ropeContainer) {
    ropeContainer.style.transform = `translate(${shiftPercent}%, -50%)`;
  }
  if (team1Pullers) {
    team1Pullers.style.transform = `translateX(${shiftPercent * 0.85}%)`;
  }
  if (team2Pullers) {
    team2Pullers.style.transform = `translateX(${shiftPercent * 0.85}%)`;
  }
}

// Render Khu vực câu hỏi (Luân phiên hoặc Song song)
function renderPlayArea(lastAnswerIndex, lastAnswerCorrect) {
  const playArea = document.getElementById('gamePlayArea');
  if (!playArea) return;

  if (gameState.mode === 'alternating') {
    renderAlternatingUI(playArea, lastAnswerIndex, lastAnswerCorrect);
  } else {
    renderParallelUI(playArea);
  }
}

// Render Giao diện Đấu Luân Phiên
function renderAlternatingUI(container, lastAnswerIndex, lastAnswerCorrect) {
  const currentQ = getCurrentQuestion();
  if (!currentQ) {
    container.innerHTML = `<div class="card-alternating" style="text-align: center; padding: 40px;">
      <h3 style="font-size: 1.4rem;">Trận đấu kết thúc! Đang tính điểm...</h3>
    </div>`;
    return;
  }

  const isT1Active = gameState.activeTeamId === 'team1';
  const activeTeamObj = isT1Active ? gameState.team1 : gameState.team2;
  const isBotThinking = gameState.opponentType === 'ai' && !isT1Active && !gameState.isAnswered;

  let alertBanner = '';
  if (gameState.isTurnTransferred && gameState.transferredReason) {
    alertBanner = `
      <div class="transfer-alert-banner">
        <span>⚡</span>
        <div>${gameState.transferredReason}</div>
      </div>
    `;
  }

  let botBanner = '';
  if (isBotThinking) {
    botBanner = `
      <div class="ai-thinking-banner">
        <span>🤖</span>
        <div>Máy tính (AI) đang phân tích và lựa chọn câu trả lời...</div>
      </div>
    `;
  }

  let optionsHtml = '';
  const letters = ['A', 'B', 'C', 'D'];

  currentQ.options.forEach((opt, idx) => {
    let btnClass = 'option-btn';
    let disabledAttr = '';

    if (isBotThinking) {
      disabledAttr = 'disabled';
    }

    if (gameState.isTurnTransferred && idx === gameState.failedPrimaryOption) {
      btnClass += ' disabled-option wrong';
      disabledAttr = 'disabled';
    }

    if (gameState.isAnswered) {
      disabledAttr = 'disabled';
      if (idx === currentQ.correctIndex) {
        btnClass += ' correct';
      } else if (idx === lastAnswerIndex && !lastAnswerCorrect) {
        btnClass += ' wrong';
      }
    }

    optionsHtml += `
      <button class="${btnClass}" ${disabledAttr} onclick="handleAlternatingAnswer(${idx})">
        <span class="option-letter">${letters[idx]}</span>
        <span>${opt}</span>
      </button>
    `;
  });

  let explanationHtml = '';
  if (gameState.isAnswered && currentQ.explanation) {
    explanationHtml = `
      <div class="explanation-box">
        <div class="explanation-title">💡 Giải thích chi tiết:</div>
        <div>${currentQ.explanation}</div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="card-alternating">
      <div class="card-banner">
        <div class="turn-pill ${isT1Active ? 'team1' : 'team2'}">
          <span>${isT1Active ? '🔵' : '🔴'}</span>
          <span>Lượt: ${activeTeamObj.name} (Câu ${(gameState.turnOwnerTeamId === 'team1' ? gameState.team1Index : gameState.team2Index) + 1}/10)</span>
        </div>
        <div class="timer-badge ${gameState.timeLeft <= 3 ? 'urgent' : ''}" id="turnTimerBadge">
          <span>⏱</span>
          <span id="turnTimerNum">${gameState.timeLeft}s</span>
        </div>
      </div>

      ${alertBanner}
      ${botBanner}

      <div class="category-tag">${currentQ.category || 'Kiến thức chung'}</div>
      <div class="question-text-title">${currentQ.question}</div>

      <div class="options-grid">
        ${optionsHtml}
      </div>

      ${explanationHtml}
    </div>
  `;
}

// Render Giao diện Đấu Song Song
function renderParallelUI(container) {
  const letters = ['A', 'B', 'C', 'D'];
  const t1Shortcuts = ['A', 'S', 'D', 'F'];
  const t2Shortcuts = ['J', 'K', 'L', ';'];

  const q1 = gameState.team1Questions[gameState.team1Index];
  const q2 = gameState.team2Questions[gameState.team2Index];

  // Column Team 1
  let t1Content = '';
  if (gameState.team1.totalAnswered >= 10 || !q1) {
    t1Content = `<div style="text-align:center; padding: 30px; font-weight: 700; color: #16a34a;">✅ Đội 1 đã hoàn thành 10 câu hỏi! Đang chờ kết quả...</div>`;
  } else {
    let t1Options = '';
    q1.options.forEach((opt, idx) => {
      let btnClass = 'option-btn';
      let disabledAttr = gameState.team1Answered ? 'disabled' : '';

      if (gameState.team1Answered) {
        if (idx === q1.correctIndex) btnClass += ' correct';
        else if (idx === gameState.team1Selected) btnClass += ' wrong';
      }

      t1Options += `
        <button class="${btnClass}" ${disabledAttr} onclick="handleParallelAnswer('team1', ${idx})">
          <span class="option-letter">${letters[idx]}</span>
          <span>${opt}</span>
          <span class="shortcut-badge">${t1Shortcuts[idx]}</span>
        </button>
      `;
    });

    t1Content = `
      <div class="category-tag">${q1.category || 'Kiến thức'} - Câu ${gameState.team1Index + 1}/10</div>
      <div class="question-text-title" style="font-size: 1.15rem; min-height: 54px;">${q1.question}</div>
      <div class="options-grid">${t1Options}</div>
    `;
  }

  // Column Team 2
  let t2Content = '';
  if (gameState.team2.totalAnswered >= 10 || !q2) {
    t2Content = `<div style="text-align:center; padding: 30px; font-weight: 700; color: #16a34a;">✅ ${gameState.team2.name} đã hoàn thành 10 câu hỏi! Đang chờ kết quả...</div>`;
  } else {
    let t2Options = '';
    const isBot = gameState.opponentType === 'ai';

    q2.options.forEach((opt, idx) => {
      let btnClass = 'option-btn';
      let disabledAttr = (gameState.team2Answered || isBot) ? 'disabled' : '';

      if (gameState.team2Answered) {
        if (idx === q2.correctIndex) btnClass += ' correct';
        else if (idx === gameState.team2Selected) btnClass += ' wrong';
      }

      t2Options += `
        <button class="${btnClass}" ${disabledAttr} onclick="handleParallelAnswer('team2', ${idx})">
          <span class="option-letter">${letters[idx]}</span>
          <span>${opt}</span>
          ${!isBot ? `<span class="shortcut-badge">${t2Shortcuts[idx]}</span>` : ''}
        </button>
      `;
    });

    t2Content = `
      <div class="category-tag">${q2.category || 'Kiến thức'} - Câu ${gameState.team2Index + 1}/10</div>
      <div class="question-text-title" style="font-size: 1.15rem; min-height: 54px;">${q2.question}</div>
      <div class="options-grid">${t2Options}</div>
    `;
  }

  container.innerHTML = `
    <div class="parallel-layout">
      <div class="card-parallel team1-theme">
        <div style="font-weight: 800; font-size: 1.1rem; color: #2563eb; margin-bottom: 12px; display: flex; justify-content: space-between;">
          <span>🔵 ${gameState.team1.name}</span>
          <span>Điểm: ${gameState.team1.score}</span>
        </div>
        ${t1Content}
      </div>

      <div class="card-parallel team2-theme">
        <div style="font-weight: 800; font-size: 1.1rem; color: #dc2626; margin-bottom: 12px; display: flex; justify-content: space-between;">
          <span>🔴 ${gameState.team2.name}</span>
          <span>Điểm: ${gameState.team2.score}</span>
        </div>
        ${t2Content}
      </div>
    </div>
  `;
}

// --- 11. BÀN PHÍM PHÍM TẮT CHO ĐẤU SONG SONG ---
window.addEventListener('keydown', (e) => {
  if (gameState.mode !== 'parallel' || gameState.status !== 'playing') return;

  const key = e.key.toLowerCase();
  // Team 1: A, S, D, F
  if (key === 'a') handleParallelAnswer('team1', 0);
  else if (key === 's') handleParallelAnswer('team1', 1);
  else if (key === 'd') handleParallelAnswer('team1', 2);
  else if (key === 'f') handleParallelAnswer('team1', 3);

  // Team 2 (nếu là PvP): J, K, L, ;
  if (gameState.opponentType === 'pvp') {
    if (key === 'j') handleParallelAnswer('team2', 0);
    else if (key === 'k') handleParallelAnswer('team2', 1);
    else if (key === 'l') handleParallelAnswer('team2', 2);
    else if (key === ';' || key === ':') handleParallelAnswer('team2', 3);
  }
});

// --- 12. QUẢN LÝ MODAL (LUẬT CHƠI, CÀI ĐẶT, CÂU HỎI, CHIẾN THẮNG) ---
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
}

// Modal Chiến Thắng
function showVictoryModal(winner) {
  const modal = document.getElementById('victoryModal');
  const titleEl = document.getElementById('victoryTitle');
  const descEl = document.getElementById('victoryDesc');
  const t1FinalScore = document.getElementById('finalT1Score');
  const t2FinalScore = document.getElementById('finalT2Score');

  if (t1FinalScore) t1FinalScore.textContent = `${gameState.team1.score} câu đúng`;
  if (t2FinalScore) t2FinalScore.textContent = `${gameState.team2.score} câu đúng`;

  if (winner === 'draw') {
    titleEl.textContent = 'HÒA NHAU KỊCH TÍNH!';
    descEl.textContent = 'Hai bên ngang tài ngang sức, dây thừng đứng ngay tại vạch xuất phát!';
  } else {
    titleEl.textContent = `${winner.name} VÔ ĐỊCH! 🏆`;
    if (gameState.opponentType === 'ai') {
      if (winner.id === 'team1') {
        descEl.textContent = 'Chúc mừng bạn đã xuất sắc chiến thắng trí tuệ nhân tạo (AI)!';
      } else {
        descEl.textContent = 'Máy tính (AI) đã giành chiến thắng chung cuộc! Hãy thử sức lại nhé!';
      }
    } else {
      descEl.textContent = `Chúc mừng ${winner.name} đã giành chiến thắng ngoạn mục trên đấu trường tri thức!`;
    }
  }

  openModal('victoryModal');
}

// Modal Quản Lý Câu Hỏi (CRUD)
let editingQuestionId = null;

function openQuestionsModal() {
  renderQuestionsList();
  openModal('questionsModal');
}

function renderQuestionsList() {
  const listContainer = document.getElementById('questionsListContainer');
  if (!listContainer) return;

  const countBadge = document.getElementById('totalQuestionsCount');
  if (countBadge) countBadge.textContent = `${customQuestionBank.length} câu hỏi`;

  let html = '';
  customQuestionBank.forEach((q, idx) => {
    html += `
      <div class="question-item-row">
        <div style="flex: 1;">
          <div class="question-item-text">${idx + 1}. ${q.question}</div>
          <div class="question-item-meta">
            <span style="color: #16a34a; font-weight: 700;">Đáp án đúng:</span> ${q.options[q.correctIndex]} |
            <span style="color: #64748b;">Chủ đề:</span> ${q.category || 'Chung'}
          </div>
        </div>
        <div class="item-actions">
          <button class="btn-icon-small" title="Chỉnh sửa" onclick="editQuestion('${q.id}')">✏️</button>
          <button class="btn-icon-small danger" title="Xóa" onclick="deleteQuestion('${q.id}')">🗑️</button>
        </div>
      </div>
    `;
  });

  listContainer.innerHTML = html;
}

function addNewQuestionPrompt() {
  editingQuestionId = null;
  document.getElementById('qFormTitle').textContent = 'Thêm Câu Hỏi Mới';
  document.getElementById('formQuestionText').value = '';
  document.getElementById('formOption0').value = '';
  document.getElementById('formOption1').value = '';
  document.getElementById('formOption2').value = '';
  document.getElementById('formOption3').value = '';
  document.getElementById('formCorrectSelect').value = '0';
  document.getElementById('formCategory').value = 'Kiến thức chung';
  document.getElementById('formExplanation').value = '';

  document.getElementById('questionEditorSection').style.display = 'block';
  document.getElementById('questionListSection').style.display = 'none';
}

function editQuestion(id) {
  const q = customQuestionBank.find(item => item.id === id);
  if (!q) return;

  editingQuestionId = id;
  document.getElementById('qFormTitle').textContent = 'Chỉnh Sửa Câu Hỏi';
  document.getElementById('formQuestionText').value = q.question;
  document.getElementById('formOption0').value = q.options[0];
  document.getElementById('formOption1').value = q.options[1];
  document.getElementById('formOption2').value = q.options[2];
  document.getElementById('formOption3').value = q.options[3];
  document.getElementById('formCorrectSelect').value = q.correctIndex.toString();
  document.getElementById('formCategory').value = q.category || 'Kiến thức chung';
  document.getElementById('formExplanation').value = q.explanation || '';

  document.getElementById('questionEditorSection').style.display = 'block';
  document.getElementById('questionListSection').style.display = 'none';
}

function cancelQuestionForm() {
  editingQuestionId = null;
  document.getElementById('questionEditorSection').style.display = 'none';
  document.getElementById('questionListSection').style.display = 'block';
}

function saveQuestionForm() {
  const text = document.getElementById('formQuestionText').value.trim();
  const opt0 = document.getElementById('formOption0').value.trim();
  const opt1 = document.getElementById('formOption1').value.trim();
  const opt2 = document.getElementById('formOption2').value.trim();
  const opt3 = document.getElementById('formOption3').value.trim();
  const correct = parseInt(document.getElementById('formCorrectSelect').value, 10);
  const category = document.getElementById('formCategory').value.trim();
  const explanation = document.getElementById('formExplanation').value.trim();

  if (!text || !opt0 || !opt1 || !opt2 || !opt3) {
    alert('Vui lòng điền đầy đủ câu hỏi và tất cả 4 phương án lựa chọn!');
    return;
  }

  if (editingQuestionId) {
    const idx = customQuestionBank.findIndex(q => q.id === editingQuestionId);
    if (idx !== -1) {
      customQuestionBank[idx] = {
        ...customQuestionBank[idx],
        question: text,
        options: [opt0, opt1, opt2, opt3],
        correctIndex: correct,
        category: category || 'Kiến thức chung',
        explanation: explanation
      };
    }
  } else {
    const newQ = {
      id: 'custom-' + Date.now(),
      question: text,
      options: [opt0, opt1, opt2, opt3],
      correctIndex: correct,
      category: category || 'Kiến thức chung',
      explanation: explanation
    };
    customQuestionBank.unshift(newQ);
  }

  saveQuestionBank(customQuestionBank);
  cancelQuestionForm();
  renderQuestionsList();
}

function deleteQuestion(id) {
  if (customQuestionBank.length <= 10) {
    alert('Ngân hàng câu hỏi cần tối thiểu 10 câu để trận đấu diễn ra!');
    return;
  }
  if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) {
    customQuestionBank = customQuestionBank.filter(q => q.id !== id);
    saveQuestionBank(customQuestionBank);
    renderQuestionsList();
  }
}

function resetDefaultQuestions() {
  if (confirm('Khôi phục toàn bộ danh sách 60+ câu hỏi gốc ban đầu?')) {
    customQuestionBank = [...DEFAULT_QUESTION_BANK];
    saveQuestionBank(customQuestionBank);
    renderQuestionsList();
  }
}

// Modal Cài Đặt (Settings)
function openSettingsModal() {
  document.getElementById('settingTeam1Name').value = gameState.team1.name;
  document.getElementById('settingTeam2Name').value = gameState.team2.name;
  document.getElementById('settingTimeLimit').value = gameState.timeLimit ? gameState.timeLimit.toString() : 'none';
  document.getElementById('settingGameMode').value = gameState.mode;
  document.getElementById('settingOpponentType').value = gameState.opponentType;
  document.getElementById('settingAiDifficulty').value = gameState.aiDifficulty;

  openModal('settingsModal');
}

function saveSettingsModal() {
  const t1Name = document.getElementById('settingTeam1Name').value.trim() || 'Đội 1 (Xanh Lam)';
  const t2Name = document.getElementById('settingTeam2Name').value.trim() || 'Đội 2 (Đỏ Rực)';
  const tLimit = document.getElementById('settingTimeLimit').value;
  const mode = document.getElementById('settingGameMode').value;
  const opp = document.getElementById('settingOpponentType').value;
  const diff = document.getElementById('settingAiDifficulty').value;

  gameState.team1.name = t1Name;
  gameState.team2.name = t2Name;
  gameState.timeLimit = tLimit === 'none' ? null : parseInt(tLimit, 10);
  gameState.mode = mode;
  gameState.opponentType = opp;
  gameState.aiDifficulty = diff;

  updateModeButtonsUI();
  closeModal('settingsModal');
  initNewMatch();
}

// Chuyển đổi nhanh chế độ qua nút trên thanh header
function toggleSound() {
  soundFX.enabled = !soundFX.enabled;
  const soundBtn = document.getElementById('btnSoundToggle');
  if (soundBtn) {
    soundBtn.innerHTML = soundFX.enabled ? '🔊 Bật' : '🔇 Tắt';
    soundBtn.classList.toggle('active', soundFX.enabled);
  }
}

function setGameMode(mode) {
  gameState.mode = mode;
  updateModeButtonsUI();
  initNewMatch();
}

function setOpponentType(type) {
  gameState.opponentType = type;
  if (type === 'ai') {
    gameState.team2.name = 'Máy Tính (AI)';
    gameState.team2.shortName = 'Máy (AI)';
  } else {
    gameState.team2.name = 'Đội 2 (Đỏ Rực)';
    gameState.team2.shortName = 'Đội 2';
  }
  updateModeButtonsUI();
  initNewMatch();
}

function updateModeButtonsUI() {
  const btnPvp = document.getElementById('btnModePvp');
  const btnAi = document.getElementById('btnModeAi');
  const btnAlternating = document.getElementById('btnModeAlternating');
  const btnParallel = document.getElementById('btnModeParallel');

  if (btnPvp && btnAi) {
    btnPvp.classList.toggle('active', gameState.opponentType === 'pvp');
    btnAi.classList.toggle('active', gameState.opponentType === 'ai');
  }

  if (btnAlternating && btnParallel) {
    btnAlternating.classList.toggle('active', gameState.mode === 'alternating');
    btnParallel.classList.toggle('active', gameState.mode === 'parallel');
  }
}

// Khởi chạy khi load trang
window.addEventListener('DOMContentLoaded', () => {
  updateModeButtonsUI();
  initNewMatch();
});

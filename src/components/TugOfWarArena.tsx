import React from 'react';
import { motion } from 'motion/react';
import { Team, TeamId, GameMode } from '../types';

interface TugOfWarArenaProps {
  ropePosition: number; // âm: nghiêng về Đội 1 (trái), dương: nghiêng về Đội 2 (phải). Thang đo -10 đến +10 (hoặc -5 đến +5)
  team1: Team;
  team2: Team;
  activeTeamId: TeamId;
  lastAction?: {
    teamId: TeamId;
    isCorrect: boolean;
    timestamp: number;
  } | null;
  gameMode?: GameMode;
  compact?: boolean;
}

export const TugOfWarArena: React.FC<TugOfWarArenaProps> = ({
  ropePosition,
  team1,
  team2,
  activeTeamId,
  lastAction,
  gameMode = 'parallel',
  compact = false,
}) => {
  // Chuẩn hóa ropePosition từ -8..+8 sang pixel di chuyển
  const maxOffset = compact ? 85 : 130;
  const clampedPos = Math.max(-8, Math.min(8, ropePosition));
  const ropePixelShift = (clampedPos / 8) * maxOffset;

  const isTeam1Pulling = lastAction && lastAction.teamId === 'team1' && lastAction.isCorrect;
  const isTeam2Pulling = lastAction && lastAction.teamId === 'team2' && lastAction.isCorrect;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 via-amber-50/50 to-emerald-100/70 border border-amber-200/70 shadow-lg p-3 sm:p-5 select-none flex flex-col justify-between">
      {/* Background Stadium & Sky Elements */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-200/50">
        <div className="text-xs font-black tracking-wider text-sky-800 uppercase flex items-center gap-1.5">
          <span className="text-sm">🏟️</span>
          <span>Sân Đấu Tri Thức</span>
        </div>

        <div>
          {gameMode === 'parallel' ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-100 border border-amber-300 shadow-2xs text-amber-900">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              ĐẤU SONG SONG
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-white/90 border border-slate-200 shadow-2xs text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Lượt: {activeTeamId === 'team1' ? team1.name : team2.name}
            </span>
          )}
        </div>
      </div>

      {/* Arena Stage */}
      <div className="relative my-2 sm:my-3 flex-1 flex flex-col justify-center">
        {/* Rope Tension Lines & Measurement Gauge */}
        <div className="relative w-full max-w-xl mx-auto mb-2 px-2 sm:px-4">
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 mb-1">
            <span className="text-emerald-700 flex items-center gap-0.5 truncate max-w-[110px]">
              ◀ {team1.name}
            </span>
            <span className="text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full border border-amber-300 font-mono text-[10px]">
              0m
            </span>
            <span className="text-rose-700 flex items-center gap-0.5 truncate max-w-[110px]">
              {team2.name} ▶
            </span>
          </div>

          {/* Sân thi đấu và thước đo vạch mốc */}
          <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
            {/* Center tick */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-amber-500 z-10" />
            {/* Team 1 zone (left) */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-emerald-400/40"
              style={{ width: '50%' }}
            />
            {/* Team 2 zone (right) */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-rose-400/40"
              style={{ width: '50%' }}
            />
          </div>

          {/* Meter indicators */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-0.5 px-0.5">
            <span>-8m</span>
            <span>-4m</span>
            <span className="font-bold text-amber-700">0</span>
            <span>+4m</span>
            <span>+8m</span>
          </div>
        </div>

        {/* Cỏ nhân tạo và vạch xuất phát trên mặt sàn */}
        <div className={`relative w-full mx-auto ${compact ? 'h-40 sm:h-48' : 'h-48 sm:h-56 lg:h-64'} bg-gradient-to-b from-emerald-50 to-emerald-200/90 rounded-2xl border-2 border-emerald-300/80 shadow-inner overflow-hidden flex items-end justify-center`}>
          {/* Ground pattern lines */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-emerald-300/40 border-t border-emerald-400/50" />
          
          {/* Sọc vạch trung tâm sân đấu */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 sm:w-12 border-x-2 border-dashed border-white/60 bg-amber-200/20 flex flex-col justify-between items-center py-2 pointer-events-none">
            <span className="text-[9px] font-bold text-amber-800 bg-white/90 px-1 py-0.5 rounded shadow-2xs">ĐÍCH</span>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-[8px] font-semibold text-slate-500">GIỮA</span>
          </div>

          {/* Vạch ranh giới 2 bên */}
          <div className="absolute left-8 sm:left-12 inset-y-0 w-0.5 border-l-2 border-emerald-500/70 border-dashed" />
          <div className="absolute right-8 sm:right-12 inset-y-0 w-0.5 border-r-2 border-rose-500/70 border-dashed" />

          {/* TUG OF WAR ROPE & CHARACTERS CONTAINER WITH MOTION */}
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            animate={{
              x: ropePixelShift,
            }}
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 18,
              mass: 1.2,
            }}
          >
            {/* THE THICK BRAIDED ROPE */}
            <div className="absolute w-[860px] h-4 sm:h-5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              {/* Rope Shadow */}
              <div className="absolute w-full h-2 bottom-[-16px] bg-slate-900/15 rounded-full blur-[2px]" />
              
              {/* Textured Braided Rope */}
              <div className="relative w-full h-3.5 sm:h-4 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-full border-y border-amber-900 shadow-md flex items-center overflow-hidden">
                {/* Rope Braided Fiber Pattern */}
                <div
                  className="w-full h-full opacity-60"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      #fef3c7,
                      #fef3c7 4px,
                      #b45309 4px,
                      #b45309 8px
                    )`,
                  }}
                />
              </div>

              {/* CENTER RED RIBBON (CỜ ĐỎ ĐÁNH DẤU CHÍNH GIỮA DÂY) */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -top-5 sm:-top-6 flex flex-col items-center z-20"
                animate={
                  isTeam1Pulling || isTeam2Pulling
                    ? { rotate: [0, -10, 10, -5, 0], scale: [1, 1.2, 1] }
                    : { rotate: 0 }
                }
                transition={{ duration: 0.5 }}
              >
                {/* Red Bow and Ribbon */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 border-2 border-white shadow-md flex items-center justify-center">
                  <span className="text-white text-[11px] font-black">★</span>
                </div>
                {/* Hanging tails of the ribbon */}
                <div className="flex gap-1 -mt-1">
                  <div className="w-1.5 h-5 bg-red-600 rounded-b-sm transform -rotate-12 shadow-2xs" />
                  <div className="w-1.5 h-6 bg-rose-700 rounded-b-sm transform rotate-12 shadow-2xs" />
                </div>
              </motion.div>
            </div>

            {/* TEAM 1 (BÊN TRÁI / LEFT) - 3 VẬN ĐỘNG VIÊN */}
            <motion.div
              className={`absolute right-1/2 ${compact ? 'mr-6 sm:mr-8 gap-1 sm:gap-2 scale-85 sm:scale-95' : 'mr-10 sm:mr-14 gap-2 sm:gap-3.5'} top-1/2 -translate-y-1/2 flex items-center pr-1`}
              animate={
                isTeam1Pulling
                  ? {
                      x: [-6, 6, -10, 0],
                      rotate: [-2, -6, -4],
                      scale: [1, 1.05, 1],
                    }
                  : activeTeamId === 'team1' || gameMode === 'parallel'
                  ? { y: [0, -2, 0] }
                  : {}
              }
              transition={{ duration: 0.4, repeat: (activeTeamId === 'team1' || gameMode === 'parallel') ? Infinity : 0, repeatDelay: 1.5 }}
            >
              {/* VĐV 1 (Neo cuối / Anchor) */}
              <CharacterSprite
                teamName={team1.name}
                teamColor="emerald"
                leanDirection="left"
                isPullingHard={!!isTeam1Pulling}
                isLeader={false}
                label="Đội 1"
                number={3}
              />
              {/* VĐV 2 (Giữa) */}
              <CharacterSprite
                teamName={team1.name}
                teamColor="emerald"
                leanDirection="left"
                isPullingHard={!!isTeam1Pulling}
                isLeader={false}
                number={2}
              />
              {/* VĐV 3 (Đội trưởng / Đầu dây) */}
              <CharacterSprite
                teamName={team1.name}
                teamColor="emerald"
                leanDirection="left"
                isPullingHard={!!isTeam1Pulling}
                isLeader={true}
                number={1}
              />
            </motion.div>

            {/* TEAM 2 (BÊN PHẢI / RIGHT) - 3 VẬN ĐỘNG VIÊN */}
            <motion.div
              className={`absolute left-1/2 ${compact ? 'ml-6 sm:ml-8 gap-1 sm:gap-2 scale-85 sm:scale-95' : 'ml-10 sm:ml-14 gap-2 sm:gap-3.5'} top-1/2 -translate-y-1/2 flex items-center pl-1`}
              animate={
                isTeam2Pulling
                  ? {
                      x: [6, -6, 10, 0],
                      rotate: [2, 6, 4],
                      scale: [1, 1.05, 1],
                    }
                  : activeTeamId === 'team2' || gameMode === 'parallel'
                  ? { y: [0, -2, 0] }
                  : {}
              }
              transition={{ duration: 0.4, repeat: (activeTeamId === 'team2' || gameMode === 'parallel') ? Infinity : 0, repeatDelay: 1.5 }}
            >
              {/* VĐV 1 (Đội trưởng / Đầu dây) */}
              <CharacterSprite
                teamName={team2.name}
                teamColor="rose"
                leanDirection="right"
                isPullingHard={!!isTeam2Pulling}
                isLeader={true}
                number={1}
              />
              {/* VĐV 2 (Giữa) */}
              <CharacterSprite
                teamName={team2.name}
                teamColor="rose"
                leanDirection="right"
                isPullingHard={!!isTeam2Pulling}
                isLeader={false}
                number={2}
              />
              {/* VĐV 3 (Neo cuối / Anchor) */}
              <CharacterSprite
                teamName={team2.name}
                teamColor="rose"
                leanDirection="right"
                isPullingHard={!!isTeam2Pulling}
                isLeader={false}
                label="Đội 2"
                number={3}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Realtime Live Status & Tension readout */}
      <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-600 pt-2 border-t border-amber-200/50 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span className="text-emerald-800 font-bold">{team1.name}</span>
          <span className="text-slate-500 font-mono text-[11px]">({team1.correctAnswers}/10)</span>
        </div>

        <div className="text-center font-bold text-[11px] sm:text-xs">
          {ropePosition === 0 ? (
            <span className="text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 shadow-2xs">
              ⚖️ Cân bằng (0)
            </span>
          ) : ropePosition < 0 ? (
            <span className="text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
              🔥 {team1.name} +{Math.abs(ropePosition)}
            </span>
          ) : (
            <span className="text-rose-800 bg-rose-100/90 px-2 py-0.5 rounded-full border border-rose-300 shadow-2xs">
              🔥 {team2.name} +{ropePosition}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-mono text-[11px]">({team2.correctAnswers}/10)</span>
          <span className="text-rose-800 font-bold">{team2.name}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
        </div>
      </div>
    </div>
  );
};

// Component vẽ nhân vật kéo co hoạt hình dạng Vector/SVG tinh tế
interface CharacterProps {
  teamName: string;
  teamColor: 'emerald' | 'rose';
  leanDirection: 'left' | 'right';
  isPullingHard: boolean;
  isLeader?: boolean;
  label?: string;
  number: number;
}

const CharacterSprite: React.FC<CharacterProps> = ({
  teamColor,
  leanDirection,
  isPullingHard,
  isLeader,
}) => {
  const isLeft = leanDirection === 'left';
  const rotationAngle = isLeft
    ? isPullingHard
      ? -28
      : -18
    : isPullingHard
    ? 28
    : 18;

  const primaryColor = teamColor === 'emerald' ? '#059669' : '#e11d48';
  const accentColor = teamColor === 'emerald' ? '#10b981' : '#f43f5e';
  const headbandColor = teamColor === 'emerald' ? '#f59e0b' : '#3b82f6';

  return (
    <motion.div
      className="relative flex flex-col items-center"
      style={{
        transformOrigin: 'bottom center',
        rotate: `${rotationAngle}deg`,
      }}
      animate={
        isPullingHard
          ? {
              y: [0, -6, 0],
              scale: [1, 1.1, 1],
            }
          : {}
      }
      transition={{ duration: 0.3 }}
    >
      {/* Hiệu ứng mồ hôi / biểu cảm nỗ lực */}
      {isPullingHard && (
        <motion.div
          className="absolute -top-4 -right-1 text-xs select-none"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          💦
        </motion.div>
      )}

      {/* Head with Headband & Expression */}
      <div className="relative w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-900/40 shadow-xs flex items-center justify-center">
        {/* Headband */}
        <div
          className="absolute top-1 inset-x-0 h-2 rounded-t-sm"
          style={{ backgroundColor: headbandColor }}
        />
        {/* Face */}
        <div className="mt-1 flex flex-col items-center">
          {/* Eyes in tugging strain */}
          <div className="flex gap-1.5 text-[9px] font-black text-slate-800">
            <span>&gt;</span>
            <span>&lt;</span>
          </div>
          {/* Gritted teeth */}
          <div className="w-2.5 h-1 bg-white border border-slate-700 rounded-xs -mt-0.5" />
        </div>
      </div>

      {/* Torso & Uniform */}
      <div
        className="w-7 h-9 rounded-t-md mt-0.5 shadow-sm border border-black/20 flex items-center justify-center relative"
        style={{
          background: `linear-gradient(to bottom, ${accentColor}, ${primaryColor})`,
        }}
      >
        {isLeader && (
          <span className="text-[8px] font-black text-white/90">C</span>
        )}
      </div>

      {/* Hands gripping the rope */}
      <div
        className="absolute top-10 w-8 h-3 flex justify-between px-0.5 z-10"
        style={{ transform: isLeft ? 'translateX(4px)' : 'translateX(-4px)' }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-900/40 shadow-2xs" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-900/40 shadow-2xs" />
      </div>

      {/* Legs in wide brace stance */}
      <div className="flex gap-1.5 -mt-0.5">
        <div className="w-2.5 h-6 bg-slate-800 rounded-b-sm transform -rotate-12" />
        <div className="w-2.5 h-6 bg-slate-800 rounded-b-sm transform rotate-12" />
      </div>

      {/* Shadow */}
      <div className="w-10 h-2 bg-slate-900/20 rounded-full blur-[1px] mt-0.5" />
    </motion.div>
  );
};

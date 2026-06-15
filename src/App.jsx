import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, ArrowRight, RefreshCw, BookOpen, AlertCircle, ChevronRight, HelpCircle } from 'lucide-react';

const VERSES = [
  {
    ref: "[부활 주일] 요한복음 20:8",
    text: "그 때에야 무덤에 먼저 갔던 그 다른 제자도 들어가 보고 믿더라"
  },
  {
    ref: "10과 잠언 17:1",
    text: "마른 떡 한 조각만 있고도 화목하는 것이 제육이 집에 가득하고도 다투는 것보다 나으니라"
  },
  {
    ref: "11과 여호수아 24:15",
    text: "만일 여호와를 섬기는 것이 너희에게 좋지 않게 보이거든 너희 조상들이 강 저쪽에서 섬기던 신들이든지 또는 너희가 거주하는 땅에 있는 아모리 족속의 신들이든지 너희가 섬길 자를 오늘 택하라 오직 나와 내 집은 여호와를 섬기겠노라 하니"
  },
  {
    ref: "12과 로마서 12:12~13",
    text: "소망 중에 즐거워하며 환난 중에 참으며 기도에 항상 힘쓰며 성도들의 쓸 것을 공급하며 손 대접하기를 힘쓰라"
  },
  {
    ref: "13과 시편 19:1",
    text: "하늘이 하나님의 영광을 선포하고 궁창이 그의 손으로 하신 일을 나타내는도다"
  },
  {
    ref: "14과 골로새서 2:8",
    text: "누가 철학과 헛된 속임수로 너희를 사로잡을까 주의하라 이것은 사람의 전통과 세상의 초등학문을 따름이요 그리스도를 따름이 아니니라"
  },
  {
    ref: "15과 고린도후서 10:5",
    text: "하나님을 아는 것을 대적하여 높아진 것을 다 무너뜨리고 모든 생각을 사로잡아 그리스도에게 복종하게 하니"
  },
  {
    ref: "16과 빌립보서 2:5",
    text: "너희 안에 이 마음을 품으라 곧 그리스도 예수의 마음이니"
  },
  {
    ref: "17과 로마서 1:20",
    text: "창세로부터 그의 보이지 아니하는 것들 곧 그의 영원하신 능력과 신성이 그가 만드신 만물에 분명히 보여 알려졌나니 그러므로 그들이 핑계하지 못할지니라"
  },
  {
    ref: "18과 잠언 4:27",
    text: "좌로나 우로나 치우치지 말고 네 발을 악에서 떠나게 하라"
  },
  {
    ref: "19과 마태복음 5:16",
    text: "이같이 너희 빛이 사람 앞에 비치게 하여 그들로 너희 착한 행실을 보고 하늘에 계신 너희 아버지께 영광을 돌리게 하라"
  }
];

// 정밀 비교를 위한 LCS 알고리즘 기반 Diff 함수
const getDiff = (target, input) => {
  const n = target.length;
  const m = input.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (target[i - 1] === input[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const diff = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && target[i - 1] === input[j - 1]) {
      diff.unshift({ type: 'match', char: target[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // 입력에만 있는 글자 (무시하거나 특별 처리 가능)
      j--;
    } else if (i > 0 && (j === 0 || dp[i - 1][j] >= dp[i][j - 1])) {
      // 정답에 있는데 입력에는 없는 글자 (틀린 부분)
      diff.unshift({ type: 'miss', char: target[i - 1] });
      i--;
    }
  }
  return diff;
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const currentVerse = VERSES[currentIndex];

  const diffResult = useMemo(() => {
    if (!isChecked) return null;
    return getDiff(currentVerse.text, userInput);
  }, [isChecked, userInput, currentVerse.text]);

  const isExactMatch = useMemo(() => {
    if (!diffResult) return false;
    return !diffResult.some(d => d.type === 'miss');
  }, [diffResult]);

  const handleCheck = () => {
    setIsChecked(true);
  };

  const handleNext = () => {
    if (currentIndex < VERSES.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput("");
      setIsChecked(false);
      setShowHint(false);
    } else {
      setShowCompleteModal(true);
    }
  };

  const resetAll = () => {
    setCurrentIndex(0);
    setUserInput("");
    setIsChecked(false);
    setShowHint(false);
    setShowCompleteModal(false);
  };

  const progressPercentage = ((currentIndex + (isChecked ? 1 : 0)) / VERSES.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-6 px-4 font-sans text-slate-800">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-indigo-700 flex items-center justify-center gap-2 mb-1">
            <BookOpen className="w-7 h-7" /> 중등부 말씀 암송 연습하기
          </h1>
          <p className="text-slate-500 text-sm"> 7월 5일 성경 암송 축제까지 화이팅! </p>
        </header>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Progress</span>
            <span className="text-xs font-medium text-slate-500">{currentIndex + 1} / {VERSES.length}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="p-5 bg-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-sm font-bold">
                {currentIndex + 1}
              </span>
              <h2 className="text-lg font-bold">{currentVerse.ref}</h2>
            </div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {showHint && (
              <div className="mb-5 p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-900 text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2">
                <span className="font-bold">힌트: </span>
                {currentVerse.text.substring(0, 15)}...
              </div>
            )}

            {!isChecked ? (
              <div className="space-y-4">
                <textarea
                  className="w-full h-48 p-5 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 focus:ring-0 outline-none transition-all text-lg leading-relaxed bg-slate-50 focus:bg-white shadow-inner"
                  placeholder="여기에 말씀을 입력하세요..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) handleCheck();
                  }}
                />
                <button
                  disabled={!userInput.trim()}
                  onClick={handleCheck}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                    userInput.trim()
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-[0.98]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" /> 제출하여 확인하기
                </button>
                <p className="text-center text-xs text-slate-400">Ctrl + Enter를 눌러 바로 제출할 수 있습니다.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <div className="w-1 h-3 bg-slate-300 rounded-full"></div> 내 입력 결과
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-lg leading-relaxed">
                    {userInput}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <div className="w-1 h-3 bg-indigo-300 rounded-full"></div> 정답 확인 및 대조
                  </h3>
                  <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-lg leading-relaxed shadow-inner">
                    {diffResult.map((d, i) => (
                      <span
                        key={i}
                        className={d.type === 'match'
                          ? "text-green-600 font-medium"
                          : "bg-red-100 text-red-600 font-bold decoration-wavy underline"
                        }
                      >
                        {d.char}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> 일치</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> 틀림/누락</span>
                    <span className="ml-auto text-indigo-600">*{isExactMatch ? "완벽하게 암송하셨습니다!" : "틀린 부분을 확인해 보세요."}</span>
                  </div>
                </section>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsChecked(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    <RefreshCw className="w-5 h-5" /> 다시 시도
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                  >
                    다음 말씀으로 <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-90 duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-2">암송 완료!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              모든 구절을 끝까지 마치셨습니다.<br/>수고하셨습니다!
            </p>
            <button
              onClick={resetAll}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
            >
              처음부터 다시 하기
            </button>
          </div>
        </div>
      )}

      <footer className="mt-auto pt-10 text-slate-400 text-[10px] tracking-widest uppercase">
        Bible Memory Test Tool
      </footer>
    </div>
  );
}
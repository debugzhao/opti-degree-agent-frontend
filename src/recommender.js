import { supportedProvinces, universities } from "./data";

export const initialExam = {
  province: "河南",
  score: "",
  rank: "",
  subjects: ["物理", "化学"],
  batch: "本科批"
};

export const initialProfile = {
  familyType: "",
  familyBudget: "12000",
  careerPriority: "就业优先",
  riskStyle: "均衡",
  majorPrefs: ["计算机类", "电子信息类"],
  cityPrefs: ["杭州", "南京", "深圳"],
  rejectedMajors: ["土木类"],
  acceptOutProvince: true,
  acceptGraduate: true
};

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const hasOverlap = (left, right) => left.some((item) => right.includes(item));

const estimateRank = (score) => {
  const numericScore = toNumber(score);
  if (!numericScore) return 52000;
  return clamp(Math.round((750 - numericScore) * 980), 4500, 180000);
};

export const getRank = (exam) => toNumber(exam.rank) || estimateRank(exam.score);

const getBudget = (profile) => toNumber(profile.familyBudget) || 12000;

const getPosition = (probability) => {
  if (probability >= 78) return "保";
  if (probability >= 60) return "稳";
  if (probability >= 42) return "冲";
  return "高冲";
};

const getPositionTone = (position) => {
  if (position === "保") return "safe";
  if (position === "稳") return "steady";
  if (position === "冲") return "warn";
  return "bad";
};

const subjectScore = (candidate, exam) => {
  if (!candidate.subjects?.length) return 1;
  return candidate.subjects.every((subject) => exam.subjects.includes(subject)) ? 1 : 0.35;
};

const preferenceScore = (candidate, profile) => {
  let score = 46;
  const majorPrefs = profile.majorPrefs || [];
  const cityPrefs = profile.cityPrefs || [];
  const rejectedMajors = profile.rejectedMajors || [];

  if (majorPrefs.includes(candidate.majorCategory)) score += 25;
  if (hasOverlap(majorPrefs, candidate.majors)) score += 16;
  if (cityPrefs.includes(candidate.city)) score += 18;
  if (hasOverlap(rejectedMajors, [candidate.majorCategory, ...candidate.majors])) score -= 34;
  if (profile.careerPriority === "就业优先" && candidate.trendScore >= 82) score += 10;
  if (profile.careerPriority === "稳定优先" && ["医学类", "师范类", "法学类"].includes(candidate.majorCategory)) score += 12;
  if (profile.acceptGraduate && ["医学类", "电子信息类", "生物制造类"].includes(candidate.majorCategory)) score += 8;

  return clamp(score, 0, 100);
};

const costScore = (candidate, profile) => {
  const budget = getBudget(profile);
  if (candidate.tuition <= budget) return 100;
  if (candidate.tuition <= budget * 1.4) return 72;
  return 45;
};

const admissionProbability = (candidate, exam) => {
  const rank = getRank(exam);
  const ratio = (candidate.targetRank - rank) / candidate.targetRank;
  return clamp(Math.round(58 + ratio * 126), 18, 93);
};

const enrichCandidate = (candidate, exam, profile) => {
  const subject = subjectScore(candidate, exam);
  const probability = subject < 1 ? 22 : admissionProbability(candidate, exam);
  const position = getPosition(probability);
  const pref = preferenceScore(candidate, profile);
  const city = (profile.cityPrefs || []).includes(candidate.city) ? 100 : 68;
  const cost = costScore(candidate, profile);
  const overall = Math.round(probability * 0.35 + pref * 0.2 + candidate.trendScore * 0.2 + city * 0.15 + cost * 0.1);
  const hardWarnings = [];

  if (subject < 1) hardWarnings.push("选科不完全匹配，仅作风险样本");
  if (candidate.tuition > getBudget(profile)) hardWarnings.push("学费超出当前预算");
  if (candidate.risks.length >= 3) hardWarnings.push("专业路径投入较长");

  return {
    ...candidate,
    probability,
    position,
    tone: getPositionTone(position),
    preferenceScore: pref,
    overall,
    hardWarnings
  };
};

const uniqueById = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const takePlan = (candidates, positions, limit) =>
  candidates
    .filter((item) => positions.includes(item.position))
    .sort((a, b) => b.overall - a.overall)
    .slice(0, limit);

const fillPlan = (base, candidates, limit) => uniqueById([...base, ...candidates]).slice(0, limit);

export function buildRiskProfile(exam, profile) {
  const rank = getRank(exam);
  const risks = [];
  const strengths = [];
  let riskPoints = 18;

  if (!toNumber(exam.rank)) {
    risks.push({
      level: "warn",
      title: "缺少真实位次",
      detail: "仅用分数估算会放大误差，出分后必须换成省排名。"
    });
    riskPoints += 18;
  } else {
    strengths.push("已提供位次，可进入冲稳保分层。");
  }

  if (!supportedProvinces.includes(exam.province)) {
    risks.push({
      level: "warn",
      title: "当前省份不在首期深度覆盖",
      detail: "可做基础咨询，不建议售卖高价复核。"
    });
    riskPoints += 12;
  } else {
    strengths.push(`${exam.province}在首期重点省份内，可启用深度报告。`);
  }

  if (rank <= 18000) {
    risks.push({
      level: "warn",
      title: "高分段容错率低",
      detail: "志愿排序和专业组调剂风险会明显影响分数利用效率。"
    });
    riskPoints += 10;
  }

  if (!profile.familyType) {
    risks.push({
      level: "warn",
      title: "家庭背景未补全",
      detail: "同分学生的策略会因预算、资源、读研意愿完全不同。"
    });
    riskPoints += 12;
  }

  if ((profile.rejectedMajors || []).length > 0) {
    risks.push({
      level: "bad",
      title: "存在不可接受专业",
      detail: "必须检查院校专业组内是否包含调剂后不能接受的专业。"
    });
    riskPoints += 14;
  }

  if (exam.subjects.includes("物理") && exam.subjects.includes("化学")) {
    strengths.push("物理+化学组合覆盖多数新工科与医学方向。");
  }

  const score = clamp(100 - riskPoints, 32, 88);
  return {
    score,
    label: score >= 76 ? "风险较低" : score >= 58 ? "需要复核" : "高风险",
    rank,
    risks,
    strengths,
    metrics: [
      { label: "数据完整度", value: toNumber(exam.rank) ? "高" : "中" },
      { label: "省份覆盖", value: supportedProvinces.includes(exam.province) ? "深度" : "基础" },
      { label: "决策风格", value: profile.riskStyle || "均衡" }
    ]
  };
}

const buildPlans = (candidates) => {
  const byOverall = candidates.slice().sort((a, b) => b.overall - a.overall);
  const ambitious = fillPlan([...takePlan(candidates, ["冲", "高冲"], 3), ...takePlan(candidates, ["稳"], 3)], byOverall, 6);
  const balanced = fillPlan([...takePlan(candidates, ["冲"], 2), ...takePlan(candidates, ["稳"], 3), ...takePlan(candidates, ["保"], 2)], byOverall, 7);
  const conservative = fillPlan(takePlan(candidates, ["稳", "保"], 6), byOverall.filter((item) => item.probability >= 55), 6);

  return [
    { id: "conservative", name: "保守型", intent: "优先降低滑档和退档风险", items: conservative },
    { id: "balanced", name: "均衡型", intent: "兼顾学校层次、专业适配和城市机会", items: balanced },
    { id: "ambitious", name: "进取型", intent: "允许适度上探，但保留兜底", items: ambitious }
  ];
};

export function getVolunteerRisks(items, profile) {
  const risks = [];
  const positions = items.map((item) => item.position);
  const hotCount = items.filter((item) => ["计算机类", "电子信息类", "医学类"].includes(item.majorCategory)).length;
  const rejected = profile.rejectedMajors || [];

  if (!positions.includes("保")) {
    risks.push({ level: "bad", title: "保底不足", detail: "当前方案缺少明确保底项，填报前必须补足。" });
  }

  if (hotCount >= Math.max(3, Math.floor(items.length * 0.55))) {
    risks.push({ level: "warn", title: "热门专业集中", detail: "计算机、电子信息、医学占比过高，建议加入替代路径。" });
  }

  const conflict = items.find((item) => hasOverlap(rejected, [item.majorCategory, ...item.majors]));
  if (conflict) {
    risks.push({ level: "bad", title: "存在不可接受专业", detail: `${conflict.university} 的专业组需要重点核查调剂风险。` });
  }

  if (items.length > 0) {
    const sorted = items.slice().sort((a, b) => a.probability - b.probability);
    if (sorted.at(-1).probability - sorted[0].probability < 18) {
      risks.push({ level: "warn", title: "梯度过密", detail: "冲稳保之间概率差距不明显，排序需要重新拉开。" });
    }
  }

  if (risks.length === 0) {
    risks.push({ level: "safe", title: "结构基本合理", detail: "当前方案已有冲稳保梯度，仍需核查正式招生计划。" });
  }

  return risks;
}

export function buildReport(exam, profile) {
  const riskProfile = buildRiskProfile(exam, profile);
  const enriched = universities
    .map((item) => enrichCandidate(item, exam, profile))
    .sort((a, b) => b.overall - a.overall);
  const eligible = enriched.filter((item) => item.tone !== "bad" || item.overall >= 58);
  const plans = buildPlans(eligible);

  return {
    generatedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    riskProfile,
    plans,
    topCandidates: enriched.slice(0, 5),
    volunteerRisks: getVolunteerRisks(plans[1].items, profile),
    evidence: [
      "录取概率为模拟分层，用于产品原型演示。",
      "真实上线需接入官方招生计划、历年投档线、一分一段表和专业选科要求。",
      "最终报告只做辅助决策，不替代省级考试院填报系统。"
    ]
  };
}

export function buildAdvisorDraft(report, exam) {
  if (!report) return null;
  const balanced = report.plans.find((plan) => plan.id === "balanced") || report.plans[0];
  const top = balanced.items[0];

  return {
    summary: `${exam.province}考生，位次约 ${report.riskProfile.rank}，当前建议以“${balanced.name}”为主方案。`,
    conclusion: top
      ? `首选方向建议围绕 ${top.city} 的 ${top.majorCategory} 展开，兼顾录取概率和就业趋势。`
      : "需要补全位次、选科和家庭偏好后再给最终结论。",
    reviewChecklist: [
      "复核省份批次、位次和选科是否准确",
      "复核院校专业组内是否存在不可接受专业",
      "复核保底项是否足够",
      "向家长说明不承诺录取，只给辅助方案"
    ],
    meetingAgenda: ["5 分钟确认家庭底线", "10 分钟解释三套方案", "10 分钟处理学生和家长分歧", "5 分钟确认后续填报动作"]
  };
}

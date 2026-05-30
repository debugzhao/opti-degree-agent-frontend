export const supportedProvinces = ["河南", "山东", "广东", "江苏", "浙江", "四川"];

export const allProvinces = [
  "河南",
  "山东",
  "广东",
  "江苏",
  "浙江",
  "四川",
  "北京",
  "上海",
  "河北",
  "湖北",
  "湖南",
  "其他"
];

export const subjectOptions = ["物理", "化学", "生物", "历史", "政治", "地理"];

export const genderOptions = ["男", "女"];

export const genderMajorAffinity = {
  男: {
    计算机类: 8,
    电子信息类: 8,
    自动化类: 10,
    新能源类: 8,
    生物制造类: 4,
    财经类: 0,
    医学类: 0,
    法学类: 0,
    师范类: -4
  },
  女: {
    师范类: 10,
    医学类: 8,
    财经类: 8,
    法学类: 6,
    计算机类: 2,
    生物制造类: 4,
    电子信息类: 0,
    新能源类: -2,
    自动化类: -6
  }
};

export const genderMajorHints = {
  男: "男生在工科、智能制造、新能源等高强度现场与硬件方向适配度更高，可适当上探。",
  女: "女生在师范、医学、财经、法学等稳定与表达密集方向适配度更高，工科现场岗需结合个人意愿。"
};

export const familyTypes = ["普通工薪", "预算敏感", "有行业资源", "可长期投入"];

export const priorities = ["就业优先", "稳定优先", "兴趣优先", "城市优先", "读研优先"];

export const riskStyles = ["保守", "均衡", "进取"];

export const majorOptions = [
  "计算机类",
  "电子信息类",
  "自动化类",
  "医学类",
  "师范类",
  "财经类",
  "法学类",
  "新能源类",
  "生物制造类"
];

export const cityOptions = ["杭州", "南京", "深圳", "广州", "成都", "济南", "郑州", "西安", "青岛"];

export const rejectedOptions = ["土木类", "化工类", "生物制造类", "医学类", "师范类", "财经类", "法学类"];

export const packages = [
  {
    id: "ai_basic",
    name: "AI 初版报告",
    price: 99,
    fit: "预算敏感家庭",
    includes: ["完整三套方案", "证据链", "基础风险体检"]
  },
  {
    id: "deep_report",
    name: "深度报告",
    price: 399,
    fit: "需要反复讨论的家庭",
    includes: ["深度报告", "AI 语音答疑", "一次志愿表体检"]
  },
  {
    id: "advisor_review",
    name: "顾问复核",
    price: 999,
    fit: "高价值关键决策",
    includes: ["顾问复核", "30 分钟家庭会议", "服务留痕"]
  },
  {
    id: "season_guard",
    name: "填报陪跑",
    price: 1999,
    fit: "填报当天需要兜底",
    includes: ["两次复核", "最终表检查", "应急答疑"]
  }
];

export const universities = [
  {
    id: "zju-ai-01",
    university: "浙江工业大学",
    city: "杭州",
    province: "浙江",
    groupName: "物理+化学组",
    majorCategory: "计算机类",
    majors: ["计算机科学与技术", "人工智能", "数据科学与大数据技术"],
    subjects: ["物理", "化学"],
    targetRank: 28500,
    rankHistory: [30200, 29100, 27800],
    tuition: 6000,
    trendScore: 91,
    industry: "AI 应用、工业软件、数字经济",
    employment: "杭州数字经济岗位密集，适合就业优先家庭。",
    risks: ["热门专业竞争高", "需要持续学习数学和编程"],
    evidence: ["近三年模拟位次区间 27800-30200", "城市产业与计算机类匹配度高"]
  },
  {
    id: "njupt-elec-01",
    university: "南京邮电大学",
    city: "南京",
    province: "江苏",
    groupName: "电子信息组",
    majorCategory: "电子信息类",
    majors: ["通信工程", "电子信息工程", "集成电路设计与集成系统"],
    subjects: ["物理", "化学"],
    targetRank: 31800,
    rankHistory: [33500, 32100, 30900],
    tuition: 5800,
    trendScore: 88,
    industry: "通信、半导体、智能硬件",
    employment: "通信和芯片链条岗位较多，读研后上限更高。",
    risks: ["课程难度高", "优质岗位偏好研究生"],
    evidence: ["近三年模拟位次区间 30900-33500", "专业壁垒高，转行弹性较好"]
  },
  {
    id: "sztech-auto-01",
    university: "深圳技术大学",
    city: "深圳",
    province: "广东",
    groupName: "智能制造组",
    majorCategory: "自动化类",
    majors: ["自动化", "机器人工程", "智能制造工程"],
    subjects: ["物理", "化学"],
    targetRank: 39500,
    rankHistory: [42100, 40100, 38200],
    tuition: 6200,
    trendScore: 86,
    industry: "机器人、新能源、智能制造",
    employment: "深圳制造业升级明显，适合看重城市机会的学生。",
    risks: ["学校品牌仍在成长", "实践能力要求高"],
    evidence: ["近三年模拟位次区间 38200-42100", "城市产业对口度高"]
  },
  {
    id: "henu-normal-01",
    university: "河南大学",
    city: "郑州",
    province: "河南",
    groupName: "师范与计算组",
    majorCategory: "师范类",
    majors: ["数学与应用数学(师范)", "物理学(师范)", "教育技术学"],
    subjects: ["物理"],
    targetRank: 45500,
    rankHistory: [47000, 46200, 44100],
    tuition: 5000,
    trendScore: 76,
    industry: "教育、教培转型、教育数字化",
    employment: "适合追求稳定和省内就业的家庭。",
    risks: ["编制竞争持续存在", "城市上限弱于一线城市"],
    evidence: ["近三年模拟位次区间 44100-47000", "省内认可度较强"]
  },
  {
    id: "sdu-med-01",
    university: "山东第一医科大学",
    city: "济南",
    province: "山东",
    groupName: "医学组",
    majorCategory: "医学类",
    majors: ["临床医学", "医学影像学", "口腔医学技术"],
    subjects: ["物理", "化学"],
    targetRank: 33800,
    rankHistory: [34900, 33700, 32900],
    tuition: 7500,
    trendScore: 79,
    industry: "医疗服务、医学影像、基层医疗",
    employment: "医学路径稳定，但培养周期长，家庭需要接受长期投入。",
    risks: ["学习周期长", "读研/规培压力大", "不适合抗压弱的学生"],
    evidence: ["近三年模拟位次区间 32900-34900", "职业确定性较强但回报慢"]
  },
  {
    id: "scu-bio-01",
    university: "成都理工大学",
    city: "成都",
    province: "四川",
    groupName: "新工科组",
    majorCategory: "生物制造类",
    majors: ["生物工程", "智能科学与技术", "新能源科学与工程"],
    subjects: ["物理", "化学"],
    targetRank: 52000,
    rankHistory: [54800, 53100, 50400],
    tuition: 5600,
    trendScore: 82,
    industry: "生物制造、新能源、软件服务",
    employment: "成都生活成本和产业机会相对均衡。",
    risks: ["生物方向建议读研", "专业口径需要仔细区分"],
    evidence: ["近三年模拟位次区间 50400-54800", "未来产业方向强，但中位就业需谨慎"]
  },
  {
    id: "gz-fin-01",
    university: "广东财经大学",
    city: "广州",
    province: "广东",
    groupName: "经管组",
    majorCategory: "财经类",
    majors: ["会计学", "金融科技", "数字经济"],
    subjects: [],
    targetRank: 43000,
    rankHistory: [44800, 43600, 41800],
    tuition: 5510,
    trendScore: 73,
    industry: "金融科技、会计审计、数字贸易",
    employment: "适合有商科兴趣或家庭资源的学生。",
    risks: ["财经类岗位竞争大", "普通家庭不建议盲目追金融"],
    evidence: ["近三年模拟位次区间 41800-44800", "城市商业机会较多"]
  },
  {
    id: "njust-law-01",
    university: "南京审计大学",
    city: "南京",
    province: "江苏",
    groupName: "审计法学组",
    majorCategory: "法学类",
    majors: ["审计学", "法学", "财政学"],
    subjects: [],
    targetRank: 37600,
    rankHistory: [39000, 38100, 36500],
    tuition: 5200,
    trendScore: 70,
    industry: "审计、法务、财政金融监管",
    employment: "适合表达能力强、愿意考证考公的学生。",
    risks: ["法学就业分化大", "需要长期考试能力"],
    evidence: ["近三年模拟位次区间 36500-39000", "学校行业标签清晰"]
  },
  {
    id: "xidian-soft-01",
    university: "西安电子科技大学",
    city: "西安",
    province: "陕西",
    groupName: "软件工程组",
    majorCategory: "计算机类",
    majors: ["软件工程", "网络空间安全", "人工智能"],
    subjects: ["物理", "化学"],
    targetRank: 16500,
    rankHistory: [17400, 16600, 15800],
    tuition: 6600,
    trendScore: 92,
    industry: "网络安全、人工智能、军工电子",
    employment: "专业壁垒高，适合高分且愿意读研的学生。",
    risks: ["分数门槛高", "学习压力大"],
    evidence: ["近三年模拟位次区间 15800-17400", "电子信息和网安特色强"]
  },
  {
    id: "hznu-teacher-01",
    university: "杭州师范大学",
    city: "杭州",
    province: "浙江",
    groupName: "师范应用组",
    majorCategory: "师范类",
    majors: ["小学教育", "汉语言文学(师范)", "计算机科学与技术(师范)"],
    subjects: [],
    targetRank: 61000,
    rankHistory: [63600, 61800, 59600],
    tuition: 5300,
    trendScore: 75,
    industry: "教育、数字教育、公共服务",
    employment: "适合追求城市和稳定均衡的家庭。",
    risks: ["热门城市教师竞争激烈", "文科类专业需重视考编"],
    evidence: ["近三年模拟位次区间 59600-63600", "城市和师范标签较强"]
  },
  {
    id: "qd-energy-01",
    university: "青岛科技大学",
    city: "青岛",
    province: "山东",
    groupName: "新能源材料组",
    majorCategory: "新能源类",
    majors: ["新能源材料与器件", "高分子材料与工程", "能源与动力工程"],
    subjects: ["物理", "化学"],
    targetRank: 70500,
    rankHistory: [72800, 71100, 69200],
    tuition: 5800,
    trendScore: 81,
    industry: "新能源、化工新材料、储能",
    employment: "适合接受制造业和工程现场的学生。",
    risks: ["工作环境可能偏工程现场", "部分岗位城市选择有限"],
    evidence: ["近三年模拟位次区间 69200-72800", "产业方向处于长期增长区间"]
  },
  {
    id: "zz-light-01",
    university: "郑州轻工业大学",
    city: "郑州",
    province: "河南",
    groupName: "计算机与设计组",
    majorCategory: "计算机类",
    majors: ["软件工程", "物联网工程", "数字媒体技术"],
    subjects: ["物理"],
    targetRank: 78000,
    rankHistory: [80500, 78900, 76000],
    tuition: 5500,
    trendScore: 78,
    industry: "软件服务、物联网、数字内容",
    employment: "适合省内就业和预算敏感家庭。",
    risks: ["学校平台一般", "需要靠项目作品提升竞争力"],
    evidence: ["近三年模拟位次区间 76000-80500", "专业就业弹性强于纯文科"]
  }
];

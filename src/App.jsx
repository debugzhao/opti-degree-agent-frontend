import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpenCheck,
  Brain,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  Home,
  MessageSquareText,
  Mic,
  ScanLine,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Upload,
  UsersRound
} from "lucide-react";
import {
  allProvinces,
  cityOptions,
  familyTypes,
  genderMajorHints,
  genderOptions,
  majorOptions,
  packages,
  priorities,
  rejectedOptions,
  riskStyles,
  subjectOptions
} from "./data";
import {
  buildAdvisorDraft,
  buildReport,
  buildRiskProfile,
  getVolunteerRisks,
  initialExam,
  initialProfile
} from "./recommender";

const steps = [
  { id: "measure", label: "测算", icon: Home },
  { id: "profile", label: "建档", icon: SlidersHorizontal },
  { id: "report", label: "方案", icon: FileCheck2 },
  { id: "advisor", label: "顾问", icon: MessageSquareText },
  { id: "family", label: "家庭", icon: UsersRound }
];

const memberNames = {
  student: "学生",
  father: "父亲",
  mother: "母亲"
};

const statusMap = {
  like: { label: "喜欢", tone: "safe" },
  reject: { label: "不能接受", tone: "bad" },
  question: { label: "有疑问", tone: "warn" }
};

function Metric({ label, value, tone }) {
  return (
    <div className={`metric ${tone || ""}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Section({ title, aside, children, className = "" }) {
  return (
    <section className={`section ${className}`}>
      <div className="section-head">
        <h2>{title}</h2>
        {aside ? <span>{aside}</span> : null}
      </div>
      {children}
    </section>
  );
}

function Chip({ active, tone, children, onClick }) {
  return (
    <button type="button" className={`chip ${active ? "active" : ""} ${tone || ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function EmptyState({ title, detail, action }) {
  return (
    <div className="empty-state">
      <BookOpenCheck size={28} />
      <strong>{title}</strong>
      <p>{detail}</p>
      {action}
    </div>
  );
}

function RiskList({ risks }) {
  return (
    <div className="stack">
      {risks.map((risk) => (
        <div className="risk-row" key={`${risk.title}-${risk.detail}`}>
          <span className={`risk-dot ${risk.level}`} />
          <div>
            <strong>{risk.title}</strong>
            <p>{risk.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="chip-row">
      {options.map((option) => (
        <Chip active={value === option} key={option} onClick={() => onChange(option)}>
          {option}
        </Chip>
      ))}
    </div>
  );
}

function MultiSelect({ options, value, onChange, bad }) {
  const current = value || [];
  return (
    <div className="chip-row">
      {options.map((option) => (
        <Chip
          active={current.includes(option)}
          key={option}
          tone={bad && current.includes(option) ? "bad" : ""}
          onClick={() => {
            onChange(current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
          }}
        >
          {option}
        </Chip>
      ))}
    </div>
  );
}

function MeasurePage({ exam, profile, riskProfile, setExam, setRiskProfile, setStep }) {
  const update = (key, value) => setExam((prev) => ({ ...prev, [key]: value }));
  const toggleSubject = (subject) => {
    setExam((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject) ? prev.subjects.filter((item) => item !== subject) : [...prev.subjects, subject]
    }));
  };

  return (
    <div className="page-grid">
      <div className="main-flow">
        <div className="page-title">
          <span className="eyebrow">志愿规划 Agent</span>
          <h1>开始测算</h1>
          <p>首页直接进入分数和位次测算，先给免费风险画像，再引导补全家庭与偏好。</p>
        </div>

        <Section title="基础信息" aside="免费入口">
          <div className="form-grid">
            <label>
              <span>省份</span>
              <select value={exam.province} onChange={(event) => update("province", event.target.value)}>
                {allProvinces.map((province) => (
                  <option key={province}>{province}</option>
                ))}
              </select>
            </label>
            <label>
              <span>性别</span>
              <select value={exam.gender} onChange={(event) => update("gender", event.target.value)}>
                {genderOptions.map((gender) => (
                  <option key={gender}>{gender}</option>
                ))}
              </select>
            </label>
            <label>
              <span>批次</span>
              <select value={exam.batch} onChange={(event) => update("batch", event.target.value)}>
                <option>本科批</option>
                <option>特殊类型批</option>
                <option>专科批</option>
              </select>
            </label>
            <label>
              <span>高考分数</span>
              <input inputMode="numeric" placeholder="例如 612" value={exam.score} onChange={(event) => update("score", event.target.value)} />
            </label>
            <label>
              <span>省排名/位次</span>
              <input inputMode="numeric" placeholder="例如 32680" value={exam.rank} onChange={(event) => update("rank", event.target.value)} />
            </label>
          </div>

          <div className="field-block">
            <span className="field-label">选科</span>
            <div className="chip-row">
              {subjectOptions.map((subject) => (
                <Chip active={exam.subjects.includes(subject)} key={subject} onClick={() => toggleSubject(subject)}>
                  {subject}
                </Chip>
              ))}
            </div>
          </div>

          {genderMajorHints[exam.gender] ? (
            <p className="fineprint">性别参考：{genderMajorHints[exam.gender]}（仅作为专业规划的软性参考，不构成硬性限制）</p>
          ) : null}

          <div className="button-row">
            <button
              className="btn secondary"
              type="button"
              onClick={() => {
                update("score", exam.score || "612");
                update("rank", exam.rank || "32680");
              }}
            >
              <Upload size={18} />
              上传截图演示
            </button>
            <button className="btn secondary" type="button">
              <Mic size={18} />
              语音补充
            </button>
            <button className="btn primary" type="button" onClick={() => setRiskProfile(buildRiskProfile(exam, profile))}>
              <ScanLine size={18} />
              志愿规划
            </button>
          </div>
        </Section>

        {riskProfile ? (
          <Section title="免费风险画像" aside={riskProfile.label}>
            <div className="metric-grid">
              <Metric label="风险控制分" value={riskProfile.score} />
              <Metric label="用于测算位次" value={riskProfile.rank} />
              <Metric label="省份覆盖" value={riskProfile.metrics[1].value} />
            </div>
            <div className="meter">
              <span style={{ width: `${riskProfile.score}%` }} />
            </div>
            <RiskList risks={riskProfile.risks} />
            <div className="button-row">
              <button className="btn primary" type="button" onClick={() => setStep("profile")}>
                补全家庭与偏好
                <ChevronRight size={18} />
              </button>
            </div>
          </Section>
        ) : (
          <EmptyState
            title="先输入分数或位次"
            detail="系统会先判断数据完整度、省份覆盖、选科匹配和专业组风险。"
            action={null}
          />
        )}
      </div>

      <aside className="side-rail">
        <Section title="核心痛点" aside="to C">
          <ul className="plain-list">
            <li>分数出来后时间短，信息分散。</li>
            <li>家长看就业，学生看兴趣，家庭内耗严重。</li>
            <li>新高考专业组、选科、体检、调剂规则复杂。</li>
            <li>免费工具能查数据，但不能替家庭做权衡。</li>
          </ul>
        </Section>
        <Section title="合规边界" aside="必须守住">
          <p className="fineprint">只做志愿辅助，不替代省级考试院系统；不承诺录取，不宣传内部数据，不使用“保录”“必中”“精准录取”。</p>
        </Section>
      </aside>
    </div>
  );
}

function ProfilePage({ profile, setProfile, setReport, exam, setRiskProfile, setStep }) {
  const update = (key, value) => setProfile((prev) => ({ ...prev, [key]: value }));

  const questions = useMemo(() => {
    const items = [];
    if (!profile.familyType) items.push(["家庭试错能力", "是否能接受复读、转专业、读研和外地生活成本？"]);
    if (!profile.majorPrefs.length) items.push(["专业方向", "学生更看重兴趣、就业、稳定，还是城市机会？"]);
    if (!profile.cityPrefs.length) items.push(["城市底线", "是否必须留省内，是否接受一线城市高成本？"]);
    if (profile.rejectedMajors.length) items.push(["调剂红线", "不可接受专业必须在正式志愿表中逐个专业组核查。"]);
    return items.length ? items : [["信息较完整", "可以生成初步方向，付费后再做志愿表风险体检。"]];
  }, [profile]);

  const generate = () => {
    const nextReport = buildReport(exam, profile);
    setReport(nextReport);
    setRiskProfile(nextReport.riskProfile);
    setStep("report");
  };

  return (
    <div className="page-grid">
      <div className="main-flow">
        <div className="page-title">
          <span className="eyebrow">连续问诊</span>
          <h1>补全家庭与偏好</h1>
          <p>同样的分数，不同家庭策略会完全不同。这里决定推荐权重。</p>
        </div>

        <Section title="家庭底线" aside="影响策略">
          <div className="form-stack">
            <div>
              <span className="field-label">家庭类型</span>
              <ToggleGroup options={familyTypes} value={profile.familyType} onChange={(value) => update("familyType", value)} />
            </div>
            <label>
              <span>每年可接受学费/培养成本</span>
              <input inputMode="numeric" value={profile.familyBudget} onChange={(event) => update("familyBudget", event.target.value)} />
            </label>
            <div>
              <span className="field-label">决策优先级</span>
              <ToggleGroup options={priorities} value={profile.careerPriority} onChange={(value) => update("careerPriority", value)} />
            </div>
            <div>
              <span className="field-label">风险风格</span>
              <ToggleGroup options={riskStyles} value={profile.riskStyle} onChange={(value) => update("riskStyle", value)} />
            </div>
          </div>
        </Section>

        <Section title="专业与城市偏好" aside="可多选">
          <div className="form-stack">
            <div>
              <span className="field-label">偏好专业</span>
              <MultiSelect options={majorOptions} value={profile.majorPrefs} onChange={(value) => update("majorPrefs", value)} />
            </div>
            <div>
              <span className="field-label">偏好城市</span>
              <MultiSelect options={cityOptions} value={profile.cityPrefs} onChange={(value) => update("cityPrefs", value)} />
            </div>
            <div>
              <span className="field-label">不可接受专业</span>
              <MultiSelect bad options={rejectedOptions} value={profile.rejectedMajors} onChange={(value) => update("rejectedMajors", value)} />
            </div>
          </div>
        </Section>

        <Section title="关键开关" aside="影响权重">
          <div className="switch-grid">
            <label className="switch-card">
              <input checked={profile.acceptOutProvince} type="checkbox" onChange={(event) => update("acceptOutProvince", event.target.checked)} />
              <span>
                <strong>接受外省</strong>
                <small>关闭后优先本省和近邻城市</small>
              </span>
            </label>
            <label className="switch-card">
              <input checked={profile.acceptGraduate} type="checkbox" onChange={(event) => update("acceptGraduate", event.target.checked)} />
              <span>
                <strong>接受读研</strong>
                <small>医学、电子信息、生物制造提高权重</small>
              </span>
            </label>
          </div>
        </Section>

        <div className="button-row sticky-actions">
          <button className="btn secondary" type="button" onClick={() => setStep("measure")}>
            返回测算
          </button>
          <button className="btn primary" type="button" onClick={generate}>
            生成初步方向
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <aside className="side-rail">
        <Section title="Agent 追问" aside={`${questions.length} 项`}>
          <div className="stack">
            {questions.map(([title, detail]) => (
              <div className="mini-card" key={title}>
                <strong>{title}</strong>
                <p>{detail}</p>
              </div>
            ))}
          </div>
        </Section>
      </aside>
    </div>
  );
}

function ReportPage({ report, profile, paidPackage, setPaidPackage, setVolunteerRisks, volunteerRisks, selectedPlanId, setSelectedPlanId, setStep }) {
  const activePlan = report?.plans.find((plan) => plan.id === selectedPlanId) || report?.plans[1];

  if (!report) {
    return (
      <EmptyState
        title="还没有生成方案"
        detail="请先完成测算和家庭建档。"
        action={
          <button className="btn primary" type="button" onClick={() => setStep("measure")}>
            开始测算
          </button>
        }
      />
    );
  }

  return (
    <div className="page-grid">
      <div className="main-flow">
        <div className="page-title">
          <span className="eyebrow">方案报告</span>
          <h1>冲稳保方案</h1>
          <p>免费预览看方向，付费解锁证据链、志愿表体检、顾问复核和家庭协同。</p>
        </div>

        <Section title="风险总览" aside={report.generatedAt}>
          <div className="metric-grid">
            <Metric label={report.riskProfile.label} value={report.riskProfile.score} />
            <Metric label="用于测算位次" value={report.riskProfile.rank} />
            <Metric label={paidPackage ? paidPackage.name : "免费预览"} value={paidPackage ? `¥${paidPackage.price}` : "¥0"} />
          </div>
          <div className="meter">
            <span style={{ width: `${report.riskProfile.score}%` }} />
          </div>
        </Section>

        <Section title="方案类型" aside={activePlan.intent}>
          <div className="chip-row">
            {report.plans.map((plan) => (
              <Chip active={plan.id === activePlan.id} key={plan.id} onClick={() => setSelectedPlanId(plan.id)}>
                {plan.name}
              </Chip>
            ))}
          </div>
        </Section>

        <Section title={activePlan.name} aside={`${activePlan.items.length} 个推荐`}>
          <div className="candidate-list">
            {activePlan.items.map((item) => (
              <article className="candidate-card" key={item.id}>
                <div className="candidate-head">
                  <div>
                    <h3>{item.university}</h3>
                    <p>{`${item.city}｜${item.groupName}｜${item.majors.join("、")}`}</p>
                  </div>
                  <span className={`pill ${item.tone}`}>{`${item.position} ${item.probability}%`}</span>
                </div>
                <div className="score-strip">
                  <span>综合 {item.overall}</span>
                  <span>趋势 {item.trendScore}</span>
                  <span>学费 {item.tuition}/年</span>
                  {item.genderFit ? <span>性别适配 {item.genderFit}</span> : null}
                </div>
                <p className="body-copy">推荐理由：{item.employment}</p>
                {paidPackage ? (
                  <>
                    <div className="chip-row compact">
                      {item.evidence.map((text) => (
                        <span className="chip active" key={text}>
                          {text}
                        </span>
                      ))}
                    </div>
                    <div className="chip-row compact">
                      {item.risks.map((text) => (
                        <span className="chip warn" key={text}>
                          {text}
                        </span>
                      ))}
                    </div>
                  </>
                ) : null}
              </article>
            ))}
          </div>
        </Section>

        <Section title="志愿表风险体检" aside="上传草稿后复核">
          <RiskList risks={volunteerRisks.length ? volunteerRisks : report.volunteerRisks} />
          <div className="button-row">
            <button
              className="btn secondary"
              type="button"
              onClick={() => setVolunteerRisks(getVolunteerRisks(activePlan.items, profile))}
            >
              <ClipboardCheck size={18} />
              上传志愿表并体检
            </button>
          </div>
        </Section>
      </div>

      <aside className="side-rail">
        <Section title="为什么不直接问通用模型" aside="付费理由">
          <div className="value-list">
            {[
              ["可核验数据", "每条建议绑定位次、专业组、风险点和证据链。"],
              ["志愿表体检", "检查保底不足、热门扎堆、调剂红线和梯度过密。"],
              ["家庭共识", "父母和学生分别标注分歧，减少口头争吵。"],
              ["专家复核", "AI 初筛后，人审关键风险并留下服务记录。"]
            ].map(([title, detail]) => (
              <div className="value-row" key={title}>
                <ShieldCheck size={18} />
                <div>
                  <strong>{title}</strong>
                  <p>{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {!paidPackage ? (
          <Section title="解锁完整交付" aside="付费咨询制">
            <div className="package-list">
              {packages.map((item) => (
                <button className="package-card" key={item.id} type="button" onClick={() => setPaidPackage(item)}>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{`${item.fit}｜${item.includes.join("、")}`}</small>
                  </span>
                  <b>¥{item.price}</b>
                </button>
              ))}
            </div>
            <p className="fineprint">服务不承诺录取，不代替考试院官方填报系统。</p>
          </Section>
        ) : (
          <Section title="完整报告已解锁" aside={paidPackage.name}>
            <div className="stack">
              {report.evidence.map((text) => (
                <div className="mini-card" key={text}>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <div className="button-row vertical">
              <button className="btn secondary" type="button" onClick={() => setStep("family")}>
                <Share2 size={18} />
                家庭协同
              </button>
              <button className="btn primary" type="button" onClick={() => setStep("advisor")}>
                <MessageSquareText size={18} />
                顾问复核
              </button>
            </div>
          </Section>
        )}
      </aside>
    </div>
  );
}

function AdvisorPage({ report, exam, paidPackage, setPaidPackage, advisorChecks, setAdvisorChecks, setStep }) {
  const draft = useMemo(() => buildAdvisorDraft(report, exam), [report, exam]);
  const highValue = paidPackage && ["advisor_review", "season_guard"].includes(paidPackage.id);
  const checklist = advisorChecks.length || !draft ? advisorChecks : draft.reviewChecklist.map((text) => ({ text, done: false }));
  const checkedCount = checklist.filter((item) => item.done).length;

  const toggleCheck = (index) => {
    const base = checklist.map((item, itemIndex) => (itemIndex === index ? { ...item, done: !item.done } : item));
    setAdvisorChecks(base);
  };

  if (!report) {
    return (
      <EmptyState
        title="还没有方案"
        detail="顾问复核需要先生成报告。"
        action={
          <button className="btn primary" type="button" onClick={() => setStep("report")}>
            查看方案
          </button>
        }
      />
    );
  }

  if (!highValue) {
    return (
      <div className="page-grid single">
        <div className="main-flow">
          <div className="page-title">
            <span className="eyebrow">专家复核</span>
            <h1>顾问工作台</h1>
            <p>适合高分段、专业组复杂、家庭意见不一致、不可接受专业较多的家庭。</p>
          </div>
          <Section title="顾问复核未开启" aside={paidPackage?.name || "未付费"}>
            <div className="value-list">
              <div className="value-row">
                <Brain size={18} />
                <div>
                  <strong>AI 先生成咨询底稿</strong>
                  <p>顾问只复核数据、排序、调剂风险和家庭底线。</p>
                </div>
              </div>
              <div className="value-row">
                <ShieldCheck size={18} />
                <div>
                  <strong>服务只做复核，不做承诺</strong>
                  <p>保留数据来源、风险解释和最终确认记录。</p>
                </div>
              </div>
            </div>
            <div className="button-row">
              <button className="btn secondary" type="button" onClick={() => setPaidPackage(packages.find((item) => item.id === "advisor_review"))}>
                升级 ¥999
              </button>
              <button className="btn primary" type="button" onClick={() => setPaidPackage(packages.find((item) => item.id === "season_guard"))}>
                陪跑 ¥1999
              </button>
            </div>
          </Section>
        </div>
      </div>
    );
  }

  return (
    <div className="page-grid">
      <div className="main-flow">
        <div className="page-title">
          <span className="eyebrow">专家复核</span>
          <h1>顾问工作台</h1>
          <p>AI 先生成咨询底稿，顾问只复核关键风险、解释方案和确认最终边界。</p>
        </div>
        <Section title="AI 咨询底稿" aside={paidPackage.name}>
          <div className="stack">
            <div className="mini-card">
              <strong>考生概况</strong>
              <p>{draft.summary}</p>
            </div>
            <div className="mini-card">
              <strong>初步结论</strong>
              <p>{draft.conclusion}</p>
            </div>
          </div>
        </Section>
        <Section title="复核清单" aside={`${checkedCount}/${checklist.length}`}>
          <div className="stack">
            {checklist.map((item, index) => (
              <button className="check-row" type="button" key={item.text} onClick={() => toggleCheck(index)}>
                <span className={`check-box ${item.done ? "done" : ""}`}>{item.done ? <Check size={16} /> : null}</span>
                {item.text}
              </button>
            ))}
          </div>
        </Section>
      </div>
      <aside className="side-rail">
        <Section title="家庭会议议程" aside="30 分钟">
          <div className="stack">
            {draft.meetingAgenda.map((item) => (
              <div className="mini-card" key={item}>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <div className="button-row vertical">
            <button className="btn secondary" type="button">
              预约会议
            </button>
            <button className="btn primary" type="button" disabled={checkedCount < checklist.length}>
              确认复核完成
            </button>
          </div>
          <p className="fineprint">顾问不得代替用户登录官方系统，不保管考生填报密码，不承诺录取。</p>
        </Section>
      </aside>
    </div>
  );
}

function FamilyPage({ report, paidPackage, familyNotes, setFamilyNotes, setStep }) {
  const [member, setMember] = useState("student");
  const plan = report?.plans.find((item) => item.id === "balanced") || report?.plans[0];
  const items = plan?.items || [];

  const setNote = (id, note) => {
    setFamilyNotes((prev) => {
      const current = prev[member]?.[id];
      return {
        ...prev,
        [member]: {
          ...prev[member],
          [id]: current === note ? "" : note
        }
      };
    });
  };

  const summary = useMemo(() => {
    const result = { like: 0, reject: 0, question: 0 };
    Object.values(familyNotes).forEach((notes) => {
      Object.values(notes).forEach((note) => {
        if (result[note] !== undefined) result[note] += 1;
      });
    });
    return result;
  }, [familyNotes]);

  const conflicts = useMemo(
    () =>
      items
        .map((item) => {
          const statuses = Object.keys(memberNames).map((person) => familyNotes[person]?.[item.id]).filter(Boolean);
          if (statuses.includes("like") && statuses.includes("reject")) {
            return {
              id: item.id,
              name: item.university,
              detail: "同一志愿同时出现“喜欢”和“不能接受”，建议家庭会议优先讨论。"
            };
          }
          return null;
        })
        .filter(Boolean),
    [items, familyNotes]
  );

  if (!report) {
    return (
      <EmptyState
        title="还没有可分享的报告"
        detail="请先生成志愿方案。"
        action={
          <button className="btn primary" type="button" onClick={() => setStep("report")}>
            查看方案
          </button>
        }
      />
    );
  }

  return (
    <div className="page-grid">
      <div className="main-flow">
        <div className="page-title">
          <span className="eyebrow">家庭共识</span>
          <h1>分享与标注</h1>
          <p>父母和学生分别标注“喜欢、不能接受、有疑问”，把争吵变成可讨论清单。</p>
        </div>
        <Section title="分享报告" aside={paidPackage?.name || "预览版"}>
          <div className="metric-grid">
            <Metric label="喜欢" value={summary.like} />
            <Metric label="不能接受" value={summary.reject} />
            <Metric label="有疑问" value={summary.question} />
          </div>
          <div className="button-row">
            <button className="btn secondary" type="button">
              <Share2 size={18} />
              复制分享链接
            </button>
            <button className="btn primary" type="button">
              <UsersRound size={18} />
              发给家人
            </button>
          </div>
        </Section>
        <Section title="均衡型方案" aside={memberNames[member]}>
          <div className="candidate-list">
            {items.map((item) => {
              const note = familyNotes[member]?.[item.id] || "";
              const status = statusMap[note] || { label: "未标注", tone: "" };
              return (
                <article className="candidate-card" key={item.id}>
                  <div className="candidate-head">
                    <div>
                      <h3>{item.university}</h3>
                      <p>{`${item.city}｜${item.majorCategory}｜${item.majors.join("、")}`}</p>
                    </div>
                    <span className={`pill ${status.tone}`}>{status.label}</span>
                  </div>
                  <div className="chip-row compact">
                    {Object.entries(statusMap).map(([key, option]) => (
                      <Chip active={note === key} tone={option.tone} key={key} onClick={() => setNote(item.id, key)}>
                        {option.label}
                      </Chip>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </Section>
      </div>
      <aside className="side-rail">
        <Section title="标注身份" aside={memberNames[member]}>
          <div className="chip-row">
            {Object.entries(memberNames).map(([id, name]) => (
              <Chip active={member === id} key={id} onClick={() => setMember(id)}>
                {name}
              </Chip>
            ))}
          </div>
        </Section>
        <Section title="分歧提醒" aside={`${conflicts.length} 项`}>
          {conflicts.length ? (
            <div className="stack">
              {conflicts.map((item) => (
                <div className="mini-card" key={item.id}>
                  <strong>{item.name}</strong>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="fineprint">当前没有明显分歧。建议提交前再由顾问复核专业组调剂风险。</p>
          )}
        </Section>
      </aside>
    </div>
  );
}

function App() {
  const [step, setStep] = useState("measure");
  const [exam, setExam] = useState(initialExam);
  const [profile, setProfile] = useState(initialProfile);
  const [riskProfile, setRiskProfile] = useState(null);
  const [report, setReport] = useState(null);
  const [paidPackage, setPaidPackage] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState("balanced");
  const [volunteerRisks, setVolunteerRisks] = useState([]);
  const [advisorChecks, setAdvisorChecks] = useState([]);
  const [familyNotes, setFamilyNotes] = useState({ student: {}, father: {}, mother: {} });

  const activeStep = steps.find((item) => item.id === step);
  const ActiveStepIcon = activeStep.icon;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <div className="brand-mark">
            <Sparkles size={22} />
          </div>
          <div>
            <strong>志愿规划 Agent</strong>
            <span>AI 志愿决策助理 + 专家复核咨询</span>
          </div>
        </div>
        <div className="header-badges">
          <span>
            <ShieldCheck size={16} />
            不承诺录取
          </span>
          <span>
            <CircleDollarSign size={16} />
            付费咨询制
          </span>
        </div>
      </header>

      <div className="layout">
        <nav className="step-nav" aria-label="产品流程">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <button className={item.id === step ? "active" : ""} key={item.id} type="button" onClick={() => setStep(item.id)}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <main className="content">
          <div className="mobile-step">
            <ActiveStepIcon size={18} />
            <span>{activeStep.label}</span>
          </div>

          {step === "measure" ? (
            <MeasurePage
              exam={exam}
              profile={profile}
              riskProfile={riskProfile}
              setExam={setExam}
              setRiskProfile={setRiskProfile}
              setStep={setStep}
            />
          ) : null}

          {step === "profile" ? (
            <ProfilePage
              profile={profile}
              setProfile={setProfile}
              setReport={setReport}
              exam={exam}
              setRiskProfile={setRiskProfile}
              setStep={setStep}
            />
          ) : null}

          {step === "report" ? (
            <ReportPage
              report={report}
              profile={profile}
              paidPackage={paidPackage}
              setPaidPackage={setPaidPackage}
              selectedPlanId={selectedPlanId}
              setSelectedPlanId={setSelectedPlanId}
              volunteerRisks={volunteerRisks}
              setVolunteerRisks={setVolunteerRisks}
              setStep={setStep}
            />
          ) : null}

          {step === "advisor" ? (
            <AdvisorPage
              report={report}
              exam={exam}
              paidPackage={paidPackage}
              setPaidPackage={setPaidPackage}
              advisorChecks={advisorChecks}
              setAdvisorChecks={setAdvisorChecks}
              setStep={setStep}
            />
          ) : null}

          {step === "family" ? (
            <FamilyPage
              report={report}
              paidPackage={paidPackage}
              familyNotes={familyNotes}
              setFamilyNotes={setFamilyNotes}
              setStep={setStep}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default App;

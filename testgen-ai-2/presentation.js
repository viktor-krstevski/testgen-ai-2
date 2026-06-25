const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const { FaBolt, FaRobot, FaServer, FaDesktop, FaChartBar, FaGraduationCap, FaCode } = require("react-icons/fa");

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

const PRIMARY = "6366F1";
const PRIMARY_DARK = "4F46E5";
const DARK = "1E293B";
const LIGHT_BG = "F8FAFC";
const WHITE = "FFFFFF";
const TEXT = "334155";
const MUTED = "64748B";

const mkShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 45, opacity: 0.12 });

async function createPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Viktor Krstevski, Anja Brgjovikj";
  pres.title = "TestGen AI";

  const iconBolt = await iconToBase64Png(FaBolt, "#FFFFFF");
  const iconRobot = await iconToBase64Png(FaRobot, "#6366F1");
  const iconServer = await iconToBase64Png(FaServer, "#6366F1");
  const iconDesktop = await iconToBase64Png(FaDesktop, "#6366F1");
  const iconChart = await iconToBase64Png(FaChartBar, "#6366F1");
  const iconGrad = await iconToBase64Png(FaGraduationCap, "#FFFFFF");
  const iconCode = await iconToBase64Png(FaCode, "#FFFFFF");

  // ========== SLIDE 1: Title ==========
  const s1 = pres.addSlide();
  s1.background = { color: DARK };
  // Purple accent circle
  s1.addShape(pres.shapes.OVAL, { x: 7.5, y: -1.5, w: 5, h: 5, fill: { color: PRIMARY, transparency: 20 } });
  s1.addShape(pres.shapes.OVAL, { x: 8.5, y: 3, w: 4, h: 4, fill: { color: PRIMARY_DARK, transparency: 30 } });
  s1.addImage({ data: iconCode, x: 0.8, y: 1.2, w: 0.7, h: 0.7 });
  s1.addText("TestGen AI", { x: 0.8, y: 1.9, w: 7, h: 1.2, fontSize: 48, fontFace: "Cambria", bold: true, color: WHITE, margin: 0 });
  s1.addText("Автоматизација на тестови со вештачка интелигенција", { x: 0.8, y: 3.0, w: 7, h: 0.6, fontSize: 18, fontFace: "Calibri", color: MUTED, margin: 0 });
  s1.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.9, w: 2, h: 0.04, fill: { color: PRIMARY } });
  s1.addText([
    { text: "Виктор Крстевски 211559", options: { breakLine: true, color: "94A3B8" } },
    { text: "Ања Бргјовиќ 211528", options: { color: "94A3B8" } },
  ], { x: 0.8, y: 4.2, w: 6, h: 0.8, fontSize: 14, fontFace: "Calibri", margin: 0 });
  s1.addText("Тимски Проект  |  ФИНКИ", { x: 0.8, y: 5.0, w: 6, h: 0.4, fontSize: 12, fontFace: "Calibri", color: MUTED, margin: 0 });

  // ========== SLIDE 2: Problem ==========
  const s2 = pres.addSlide();
  s2.background = { color: LIGHT_BG };
  s2.addText("Проблем", { x: 0.8, y: 0.4, w: 8, h: 0.8, fontSize: 36, fontFace: "Cambria", bold: true, color: DARK, margin: 0 });

  const problems = [
    { title: "Рачно пишување тестови", desc: "Одзема многу време и е подложно на грешки" },
    { title: "Недостаток на автоматизација", desc: "Мали тимови немаат ресурси за test automation" },
    { title: "Бариера за почетници", desc: "Selenium и Playwright бараат техничко знаење" },
  ];

  problems.forEach((p, i) => {
    const y = 1.6 + i * 1.2;
    s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.8, y, w: 8.4, h: 1.0, fill: { color: WHITE }, rectRadius: 0.08, shadow: mkShadow() });
    s2.addShape(pres.shapes.OVAL, { x: 1.1, y: y + 0.2, w: 0.55, h: 0.55, fill: { color: PRIMARY } });
    s2.addText(String(i + 1), { x: 1.1, y: y + 0.2, w: 0.55, h: 0.55, fontSize: 18, fontFace: "Calibri", bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
    s2.addText(p.title, { x: 2.0, y: y + 0.1, w: 6.5, h: 0.4, fontSize: 16, fontFace: "Calibri", bold: true, color: DARK, margin: 0 });
    s2.addText(p.desc, { x: 2.0, y: y + 0.5, w: 6.5, h: 0.4, fontSize: 13, fontFace: "Calibri", color: MUTED, margin: 0 });
  });

  // ========== SLIDE 3: Solution ==========
  const s3 = pres.addSlide();
  s3.background = { color: LIGHT_BG };
  s3.addText("Решение: TestGen AI", { x: 0.8, y: 0.4, w: 8, h: 0.8, fontSize: 36, fontFace: "Cambria", bold: true, color: DARK, margin: 0 });

  const features = [
    { icon: iconRobot, title: "AI генерација", desc: "GPT-4, Claude и Gemini генерираат тестови од природен јазик" },
    { icon: iconCode, title: "Selenium & Playwright", desc: "Поддршка за Python и JavaScript frameworks" },
    { icon: iconChart, title: "Споредба на модели", desc: "Паралелна споредба помеѓу 3 AI модели" },
  ];

  features.forEach((f, i) => {
    const x = 0.6 + i * 3.1;
    s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.6, w: 2.9, h: 3.2, fill: { color: WHITE }, rectRadius: 0.1, shadow: mkShadow() });
    s3.addShape(pres.shapes.OVAL, { x: x + 0.95, y: 1.9, w: 0.9, h: 0.9, fill: { color: "EEF2FF" } });
    s3.addImage({ data: f.icon, x: x + 1.1, y: 2.05, w: 0.6, h: 0.6 });
    s3.addText(f.title, { x: x + 0.2, y: 3.0, w: 2.5, h: 0.5, fontSize: 16, fontFace: "Calibri", bold: true, color: DARK, align: "center", margin: 0 });
    s3.addText(f.desc, { x: x + 0.2, y: 3.5, w: 2.5, h: 1.0, fontSize: 12, fontFace: "Calibri", color: MUTED, align: "center", margin: 0 });
  });

  // ========== SLIDE 4: Architecture ==========
  const s4 = pres.addSlide();
  s4.background = { color: LIGHT_BG };
  s4.addText("Архитектура", { x: 0.8, y: 0.4, w: 8, h: 0.8, fontSize: 36, fontFace: "Cambria", bold: true, color: DARK, margin: 0 });

  // Left column: tech stack
  const stack = [
    { label: "Frontend", value: "HTML, CSS, Bootstrap, JavaScript" },
    { label: "Backend", value: "Firebase Cloud Functions (Node.js)" },
    { label: "Database", value: "Cloud Firestore" },
    { label: "Auth", value: "Firebase Authentication" },
    { label: "Hosting", value: "Firebase Hosting" },
    { label: "AI APIs", value: "OpenAI, Anthropic, Google Gemini" },
  ];

  stack.forEach((item, i) => {
    const y = 1.5 + i * 0.6;
    s4.addText(item.label, { x: 0.8, y, w: 2.2, h: 0.5, fontSize: 13, fontFace: "Calibri", bold: true, color: PRIMARY_DARK, margin: 0 });
    s4.addText(item.value, { x: 3.0, y, w: 6, h: 0.5, fontSize: 13, fontFace: "Calibri", color: TEXT, margin: 0 });
  });

  // Right: flow diagram as cards
  s4.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.5, w: 2.8, h: 0.7, fill: { color: PRIMARY }, rectRadius: 0.08 });
  s4.addText("Корисник", { x: 6.8, y: 1.5, w: 2.8, h: 0.7, fontSize: 14, fontFace: "Calibri", bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });

  s4.addText("↓", { x: 7.8, y: 2.2, w: 0.8, h: 0.4, fontSize: 20, color: MUTED, align: "center", margin: 0 });

  s4.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 2.6, w: 2.8, h: 0.7, fill: { color: "EEF2FF" }, rectRadius: 0.08 });
  s4.addText("Cloud Function", { x: 6.8, y: 2.6, w: 2.8, h: 0.7, fontSize: 14, fontFace: "Calibri", bold: true, color: PRIMARY_DARK, align: "center", valign: "middle", margin: 0 });

  s4.addText("↓", { x: 7.8, y: 3.3, w: 0.8, h: 0.4, fontSize: 20, color: MUTED, align: "center", margin: 0 });

  s4.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 3.7, w: 2.8, h: 0.7, fill: { color: "F0FDF4" }, rectRadius: 0.08 });
  s4.addText("AI API (GPT/Claude/Gemini)", { x: 6.8, y: 3.7, w: 2.8, h: 0.7, fontSize: 12, fontFace: "Calibri", bold: true, color: "166534", align: "center", valign: "middle", margin: 0 });

  s4.addText("↓", { x: 7.8, y: 4.4, w: 0.8, h: 0.4, fontSize: 20, color: MUTED, align: "center", margin: 0 });

  s4.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 4.8, w: 2.8, h: 0.6, fill: { color: "FEF3C7" }, rectRadius: 0.08 });
  s4.addText("Генериран тест код", { x: 6.8, y: 4.8, w: 2.8, h: 0.6, fontSize: 13, fontFace: "Calibri", bold: true, color: "92400E", align: "center", valign: "middle", margin: 0 });

  // ========== SLIDE 5: Demo Screenshots ==========
  const s5 = pres.addSlide();
  s5.background = { color: LIGHT_BG };
  s5.addText("Демо", { x: 0.8, y: 0.4, w: 8, h: 0.8, fontSize: 36, fontFace: "Cambria", bold: true, color: DARK, margin: 0 });

  const screens = [
    { title: "Почетна страница", desc: "Landing page со преглед на функционалности" },
    { title: "Генератор", desc: "Избор на AI модел, framework и внес на инструкции" },
    { title: "Споредба", desc: "Паралелна генерација со сите 3 модели" },
    { title: "Историја", desc: "Зачувани тестови со пребарување и филтрирање" },
  ];

  screens.forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.8 + col * 4.5;
    const y = 1.4 + row * 1.9;
    s5.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 4.1, h: 1.6, fill: { color: WHITE }, rectRadius: 0.08, shadow: mkShadow() });
    s5.addShape(pres.shapes.OVAL, { x: x + 0.3, y: y + 0.35, w: 0.8, h: 0.8, fill: { color: "EEF2FF" } });
    s5.addImage({ data: iconDesktop, x: x + 0.45, y: y + 0.5, w: 0.5, h: 0.5 });
    s5.addText(s.title, { x: x + 1.3, y: y + 0.25, w: 2.5, h: 0.45, fontSize: 15, fontFace: "Calibri", bold: true, color: DARK, margin: 0 });
    s5.addText(s.desc, { x: x + 1.3, y: y + 0.7, w: 2.5, h: 0.6, fontSize: 12, fontFace: "Calibri", color: MUTED, margin: 0 });
  });

  s5.addText("Live Demo", { x: 3.5, y: 5.0, w: 3, h: 0.45, fontSize: 14, fontFace: "Calibri", bold: true, color: PRIMARY, align: "center", margin: 0 });

  // ========== SLIDE 6: AI Comparison ==========
  const s6 = pres.addSlide();
  s6.background = { color: LIGHT_BG };
  s6.addText("Споредба на AI модели", { x: 0.8, y: 0.4, w: 8, h: 0.8, fontSize: 36, fontFace: "Cambria", bold: true, color: DARK, margin: 0 });

  const models = [
    { name: "GPT-4o Mini", provider: "OpenAI", color: "10B981", traits: "Брз, точен, добра структура" },
    { name: "Claude Haiku", provider: "Anthropic", color: "8B5CF6", traits: "Детален, креативен, контекстуален" },
    { name: "Gemini Flash", provider: "Google", color: "3B82F6", traits: "Разновиден, силен, ефикасен" },
  ];

  models.forEach((m, i) => {
    const x = 0.6 + i * 3.1;
    s6.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.5, w: 2.9, h: 3.5, fill: { color: WHITE }, rectRadius: 0.1, shadow: mkShadow() });
    s6.addShape(pres.shapes.OVAL, { x: x + 0.95, y: 1.8, w: 0.9, h: 0.9, fill: { color: m.color } });
    s6.addText("AI", { x: x + 0.95, y: 1.8, w: 0.9, h: 0.9, fontSize: 18, fontFace: "Calibri", bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
    s6.addText(m.name, { x: x + 0.2, y: 2.9, w: 2.5, h: 0.5, fontSize: 16, fontFace: "Calibri", bold: true, color: DARK, align: "center", margin: 0 });
    s6.addText(m.provider, { x: x + 0.2, y: 3.3, w: 2.5, h: 0.4, fontSize: 12, fontFace: "Calibri", color: MUTED, align: "center", margin: 0 });
    s6.addText(m.traits, { x: x + 0.2, y: 3.8, w: 2.5, h: 0.8, fontSize: 12, fontFace: "Calibri", color: TEXT, align: "center", margin: 0 });
  });

  // ========== SLIDE 7: Conclusion ==========
  const s7 = pres.addSlide();
  s7.background = { color: DARK };
  s7.addShape(pres.shapes.OVAL, { x: -2, y: -2, w: 6, h: 6, fill: { color: PRIMARY, transparency: 15 } });
  s7.addShape(pres.shapes.OVAL, { x: 7, y: 2.5, w: 5, h: 5, fill: { color: PRIMARY_DARK, transparency: 25 } });

  s7.addImage({ data: iconGrad, x: 0.8, y: 0.8, w: 0.6, h: 0.6 });
  s7.addText("Заклучок", { x: 0.8, y: 1.5, w: 8, h: 0.9, fontSize: 40, fontFace: "Cambria", bold: true, color: WHITE, margin: 0 });

  s7.addText([
    { text: "Што научивме", options: { bold: true, fontSize: 16, color: "A5B4FC", breakLine: true } },
    { text: "Cloud архитектура, AI API интеграција, тимска работа", options: { fontSize: 13, color: "94A3B8", breakLine: true } },
    { text: "", options: { fontSize: 8, breakLine: true } },
    { text: "Идни подобрувања", options: { bold: true, fontSize: 16, color: "A5B4FC", breakLine: true } },
    { text: "Реални AI API повици, повеќе frameworks, export опции", options: { fontSize: 13, color: "94A3B8" } },
  ], { x: 0.8, y: 2.6, w: 6, h: 2.2, fontFace: "Calibri", margin: 0 });

  s7.addText("Ви благодариме!", { x: 0.8, y: 4.8, w: 8, h: 0.6, fontSize: 22, fontFace: "Cambria", bold: true, color: WHITE, margin: 0 });

  const outputPath = "/Users/viktorkrstevski/Desktop/uni/team-project/testgen-ai-2/TestGen_AI_Prezentacija.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log("Presentation created: " + outputPath);
}

createPresentation().catch(console.error);

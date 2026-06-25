# TestGen AI

Веб апликација за автоматско генерирање на Selenium и Playwright тестови со помош на AI.

## Тим

- **Виктор Крстевски** — 211559
- **Ања Бргјовиќ** — 211528
- **Ментор:** Проф. Д-р Бојана Котеска
- **ФИНКИ**, Тимски Проект 2025/2026

## Што прави апликацијата?

Корисникот пишува инструкции на природен јазик (македонски или англиски), а апликацијата генерира готов тест код користејќи AI модели.

**Пример:** "Отвори ја страната на ФИНКИ, најави се со индекс и лозинка" → генерира комплетен Selenium Python тест.

## Функционалности

- Генерирање тестови со **GPT-4**, **Claude** и **Gemini**
- Поддршка за **Selenium (Python)** и **Playwright (JavaScript)**
- Споредба на резултати од сите 3 модели паралелно
- Историја на генерирани тестови (per-user, зачувана во Firestore)
- Copy, Download (.py/.js), Save to history
- Firebase Authentication (Email/Password + Google Sign-In)

## Технологии

| Компонента | Технологија |
|------------|-------------|
| Frontend | HTML, CSS, Bootstrap 5, JavaScript |
| Backend | Firebase Cloud Functions (Node.js) |
| Database | Cloud Firestore |
| Auth | Firebase Authentication |
| Hosting | Firebase Hosting |
| AI APIs | OpenAI (GPT-4o-mini), Anthropic (Claude Haiku), Google (Gemini Flash) |

## Структура

```
testgen-ai-2/
├── index.html              # Single Page Application
├── css/style.css           # Custom styling
├── js/
│   ├── ui.js               # Navigation, page switching
│   ├── auth.js             # Firebase Authentication
│   ├── generator.js        # AI test generation
│   └── history.js          # History CRUD operations
├── functions/
│   └── index.js            # Cloud Functions (AI API calls)
├── firestore.rules         # Security rules
└── firebase.json           # Firebase config
```

## Setup

```bash
# Install function dependencies
cd functions && npm install && cd ..

# Set API keys
firebase functions:secrets:set OPENAI_API_KEY
firebase functions:secrets:set ANTHROPIC_API_KEY
firebase functions:secrets:set GEMINI_API_KEY

# Deploy
firebase deploy
```

## Live Demo

https://testgen-ai-827a7.web.app

window.generateMockCode = function(prompt, model, framework) {
    const lowerPrompt = prompt.toLowerCase();
    const modelNames = { gpt4: 'GPT-4 Turbo', claude: 'Claude 3.5', gemini: 'Gemini Pro' };
    const modelComment = modelNames[model] || model;

    if (framework === 'selenium') {
        if (lowerPrompt.includes('login') || lowerPrompt.includes('најава') || lowerPrompt.includes('логин')) {
            return `# ${modelComment} - Selenium Login Test
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("https://example.com/login")

# Чекај елементите да бидат видливи
wait = WebDriverWait(driver, 10)

username = wait.until(EC.presence_of_element_located((By.ID, "username")))
username.send_keys("user@test.com")

password = driver.find_element(By.ID, "password")
password.send_keys("password123")

driver.find_element(By.ID, "submit-btn").click()

# Верификација
wait.until(EC.title_contains("Dashboard"))
assert "Dashboard" in driver.title

print("Login тестот е успешен!")
driver.quit()`;
        }
        if (lowerPrompt.includes('cart') || lowerPrompt.includes('кошничка') || lowerPrompt.includes('shop')) {
            return `# ${modelComment} - Selenium Shopping Cart Test
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("https://example.com/shop")

wait = WebDriverWait(driver, 10)

# Додај продукт во кошничка
product = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".product-card .add-to-cart")))
product.click()

# Отвори ја кошничката
cart_icon = driver.find_element(By.ID, "cart-icon")
cart_icon.click()

# Верификација
cart_items = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".cart-item")))
assert len(cart_items) > 0

# Продолжи кон плаќање
driver.find_element(By.ID, "checkout-btn").click()
wait.until(EC.url_contains("/checkout"))

print("Cart тестот е успешен!")
driver.quit()`;
        }
        if (lowerPrompt.includes('form') || lowerPrompt.includes('форма') || lowerPrompt.includes('валидација')) {
            return `# ${modelComment} - Selenium Form Validation Test
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("https://example.com/register")

wait = WebDriverWait(driver, 10)

# Тест 1: Празна форма
driver.find_element(By.ID, "submit-btn").click()
error = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".error-message")))
assert error.is_displayed()

# Тест 2: Невалиден email
driver.find_element(By.ID, "email").send_keys("invalid-email")
driver.find_element(By.ID, "submit-btn").click()
error = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".email-error")))
assert "валиден" in error.text.lower() or "valid" in error.text.lower()

# Тест 3: Валидни податоци
driver.find_element(By.ID, "email").clear()
driver.find_element(By.ID, "email").send_keys("test@example.com")
driver.find_element(By.ID, "password").send_keys("SecurePass123!")
driver.find_element(By.ID, "submit-btn").click()

wait.until(EC.url_contains("/success"))
print("Form validation тестот е успешен!")
driver.quit()`;
        }
        return `# ${modelComment} - Selenium Test
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("https://example.com")

wait = WebDriverWait(driver, 10)

# Инструкции: ${prompt}
page_title = driver.title
print(f"Страницата е отворена: {page_title}")

assert driver.current_url is not None
print("Тестот е успешен!")
driver.quit()`;
    } else {
        if (lowerPrompt.includes('login') || lowerPrompt.includes('најава') || lowerPrompt.includes('логин')) {
            return `// ${modelComment} - Playwright Login Test
const { test, expect } = require('@playwright/test');

test('Login test', async ({ page }) => {
  await page.goto('https://example.com/login');

  // Пополни ги полињата
  await page.fill('#username', 'user@test.com');
  await page.fill('#password', 'password123');

  // Кликни на копчето за најава
  await page.click('#submit-btn');

  // Верификација
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.locator('h1')).toContainText('Dashboard');

  console.log('Login тестот е успешен!');
});`;
        }
        if (lowerPrompt.includes('cart') || lowerPrompt.includes('кошничка') || lowerPrompt.includes('shop')) {
            return `// ${modelComment} - Playwright Shopping Cart Test
const { test, expect } = require('@playwright/test');

test('Shopping cart test', async ({ page }) => {
  await page.goto('https://example.com/shop');

  // Додај продукт
  await page.click('.product-card .add-to-cart');

  // Отвори кошничка
  await page.click('#cart-icon');

  // Верификација
  const cartItems = await page.locator('.cart-item').count();
  expect(cartItems).toBeGreaterThan(0);

  // Плаќање
  await page.click('#checkout-btn');
  await expect(page).toHaveURL(/.*checkout/);

  console.log('Cart тестот е успешен!');
});`;
        }
        if (lowerPrompt.includes('form') || lowerPrompt.includes('форма') || lowerPrompt.includes('валидација')) {
            return `// ${modelComment} - Playwright Form Validation Test
const { test, expect } = require('@playwright/test');

test('Form validation test', async ({ page }) => {
  await page.goto('https://example.com/register');

  // Тест 1: Празна форма
  await page.click('#submit-btn');
  await expect(page.locator('.error-message')).toBeVisible();

  // Тест 2: Невалиден email
  await page.fill('#email', 'invalid-email');
  await page.click('#submit-btn');
  await expect(page.locator('.email-error')).toBeVisible();

  // Тест 3: Валидни податоци
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'SecurePass123!');
  await page.click('#submit-btn');

  await expect(page).toHaveURL(/.*success/);
  console.log('Form validation тестот е успешен!');
});`;
        }
        return `// ${modelComment} - Playwright Test
const { test, expect } = require('@playwright/test');

test('Basic test', async ({ page }) => {
  await page.goto('https://example.com');

  // Инструкции: ${prompt}
  const title = await page.title();
  console.log('Страницата е отворена:', title);

  await expect(page).toHaveTitle(/.+/);
  console.log('Тестот е успешен!');
});`;
    }
};

window.generateTest = async function() {
    const promptInput = document.getElementById('test-instructions');
    const codeOutput = document.getElementById('code-output');
    const generateBtn = document.getElementById('generate-btn');
    const modelBadge = document.getElementById('output-model-badge');
    const frameworkBadge = document.getElementById('output-framework-badge');

    if (!promptInput || !promptInput.value.trim()) {
        alert('Внесете опис за тестот!');
        return;
    }

    const prompt = promptInput.value.trim();
    const model = window.selectedModel || 'gpt4';
    const framework = window.getSelectedFramework();

    const modelNames = { gpt4: 'GPT-4 Turbo', claude: 'Claude 3.5', gemini: 'Gemini Pro' };
    const modelClasses = { gpt4: 'gpt', claude: 'claude', gemini: 'gemini' };
    if (modelBadge) {
        modelBadge.textContent = modelNames[model] || model;
        modelBadge.className = 'model-badge ' + (modelClasses[model] || '');
    }
    if (frameworkBadge) {
        frameworkBadge.textContent = framework === 'selenium' ? 'Selenium' : 'Playwright';
    }

    if (generateBtn) generateBtn.disabled = true;
    codeOutput.textContent = 'Генерирам код со AI...';

    let generatedCode;
    try {
        const fn = window.fbFunctions.httpsCallable(window.fbFunctions.functions, 'generateTest');
        const result = await fn({ prompt, model, framework });
        generatedCode = result.data.code;
    } catch (error) {
        console.warn('Cloud Function недостапна, користам mock:', error.message);
        generatedCode = window.generateMockCode(prompt, model, framework);
    }

    codeOutput.textContent = generatedCode;
    window.lastGeneratedCode = generatedCode;

    if (generateBtn) generateBtn.disabled = false;

    if (window.auth?.currentUser && typeof window.saveTestToHistory === 'function') {
        await window.saveTestToHistory(prompt, generatedCode, model, framework);
    }
};

window.generateComparison = async function() {
    const promptInput = document.getElementById('comparison-instructions');
    const compareBtn = document.getElementById('compare-btn');

    if (!promptInput || !promptInput.value.trim()) {
        alert('Внесете опис за тестот!');
        return;
    }

    const prompt = promptInput.value.trim();
    const frameworkRadio = document.querySelector('input[name="comp-framework"]:checked');
    const framework = frameworkRadio ? frameworkRadio.value : 'selenium';
    const models = ['gpt', 'claude', 'gemini'];
    const modelKeys = { gpt: 'gpt4', claude: 'claude', gemini: 'gemini' };

    if (compareBtn) compareBtn.disabled = true;

    models.forEach(m => {
        const el = document.getElementById(m + '-output');
        const time = document.getElementById(m + '-time');
        if (el) el.textContent = 'Генерирам со AI...';
        if (time) time.textContent = '...';
    });

    try {
        const fn = window.fbFunctions.httpsCallable(window.fbFunctions.functions, 'generateComparison');
        const result = await fn({ prompt, framework });
        const data = result.data;

        models.forEach(m => {
            const el = document.getElementById(m + '-output');
            const time = document.getElementById(m + '-time');
            const res = data[m];
            if (el) el.textContent = res.error ? 'Грешка: ' + res.error : res.code;
            if (time) time.textContent = res.time + 's';
        });
    } catch (error) {
        console.warn('Cloud Function недостапна, користам mock:', error.message);
        const promises = models.map(async (m) => {
            const start = performance.now();
            await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));
            const code = window.generateMockCode(prompt, modelKeys[m], framework);
            const elapsed = ((performance.now() - start) / 1000).toFixed(2);
            const el = document.getElementById(m + '-output');
            const time = document.getElementById(m + '-time');
            if (el) el.textContent = code;
            if (time) time.textContent = elapsed + 's';
        });
        await Promise.all(promises);
    }

    if (compareBtn) compareBtn.disabled = false;
};

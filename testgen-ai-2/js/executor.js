const SELENIUM_MOCK = `
class _MockElement:
    def __init__(self, loc="element"):
        self._loc = loc
    def send_keys(self, text):
        print("  Vneshuva '" + str(text) + "' vo [" + str(self._loc) + "]")
    def click(self):
        print("  Klika na [" + str(self._loc) + "]")
    def clear(self):
        print("  Chisti [" + str(self._loc) + "]")
    def is_displayed(self):
        return True
    def is_enabled(self):
        return True
    def is_selected(self):
        return False
    def get_attribute(self, name):
        return "mock-value"
    @property
    def text(self):
        loc = str(self._loc).lower()
        if "submit" in loc or "button" in loc or "login" in loc or "btn" in loc:
            return "Login"
        if "username" in loc or "user" in loc or "email" in loc:
            return "Username"
        if "password" in loc or "pass" in loc:
            return "Password"
        return "Mock Text"

class _MockWait:
    def __init__(self, driver, timeout):
        pass
    def until(self, cond):
        try:
            return cond(None)
        except:
            return _MockElement("waited")

class _MockDriver:
    def __init__(self):
        self.title = "Dashboard"
        self.current_url = "https://example.com/dashboard"
    def get(self, url):
        print("  Otvora: " + str(url))
    def find_element(self, by, val):
        print("  Naogja: [" + str(val) + "]")
        return _MockElement(val)
    def find_elements(self, by, val):
        print("  Naogja lista: [" + str(val) + "]")
        return [_MockElement(val), _MockElement(val)]
    def quit(self):
        print("  Brauzerot e zatvoren.")

class webdriver:
    Chrome = _MockDriver
    Firefox = _MockDriver

class By:
    ID = "id"
    CSS_SELECTOR = "css"
    CLASS_NAME = "class"
    XPATH = "xpath"
    NAME = "name"
    TAG_NAME = "tag"

class WebDriverWait(_MockWait):
    pass

class expected_conditions:
    @staticmethod
    def presence_of_element_located(l):
        return lambda d: _MockElement(l[1])
    @staticmethod
    def element_to_be_clickable(l):
        return lambda d: _MockElement(l[1])
    @staticmethod
    def title_contains(t):
        return lambda d: True
    @staticmethod
    def url_contains(t):
        return lambda d: True
    @staticmethod
    def presence_of_all_elements_located(l):
        return lambda d: [_MockElement(l[1]), _MockElement(l[1])]
    @staticmethod
    def visibility_of_element_located(l):
        return lambda d: _MockElement(l[1])

EC = expected_conditions
print("Startuvam test (Dry Run Mode - bez vistinski brauzer)")
print("=" * 50)
`;

window.executeCode = async function() {
    const code = window.lastGeneratedCode;
    if (!code) { alert('Прво генерирај тест!'); return; }

    const framework = window.getSelectedFramework();
    const execBtn = document.getElementById('exec-btn');
    const outputEl = document.getElementById('exec-output');
    const execSection = document.getElementById('exec-section');

    if (execSection) execSection.style.display = 'block';
    if (execBtn) { execBtn.disabled = true; execBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Извршувам...'; }
    if (outputEl) {
        outputEl.className = 'exec-output exec-running';
        outputEl.textContent = '⏳ Извршувам код...';
    }

    if (framework === 'playwright') {
        // For Playwright JS: syntax check via Function constructor
        try {
            const cleaned = code
                .replace(/const \{ test, expect \}.*\n/g, '')
                .replace(/require\(.*\)/g, '{}');
            new Function(cleaned);
            if (outputEl) {
                outputEl.className = 'exec-output exec-success';
                outputEl.textContent = '✅ Синтаксата е точна!\n\nPlaywright тестот е валиден JavaScript код.\n\n💡 За целосно извршување локално:\n   npm install @playwright/test\n   npx playwright test test.js';
            }
        } catch (e) {
            if (outputEl) {
                outputEl.className = 'exec-output exec-error';
                outputEl.textContent = '❌ Синтаксна грешка:\n\n' + e.message;
            }
        }
        if (execBtn) { execBtn.disabled = false; execBtn.innerHTML = '<i class="bi bi-play-fill"></i> Изврши тест'; }
        return;
    }

    // Python/Selenium — run with Skulpt
    // Strip unsupported modules and patterns before running
    code = code
        .replace(/import subprocess[\s\S]*?(?=\n(?:import|from|#|driver|try|def|class|\w))/g, '')
        .replace(/import sys\n/g, '')
        .replace(/import os\n/g, '')
        .replace(/subprocess\.[\s\S]*?(?=\n)/g, '# subprocess removed')
        .replace(/sys\.executable[\s\S]*?(?=\n)/g, '# sys removed')
        .replace(/try:\s*\n\s*import selenium[\s\S]*?(?=\n\n)/g, '')
        .replace(/def get_chromedriver_path[\s\S]*?return "chromedriver"\n/g, '')
        .replace(/get_chromedriver_path\(\)/g, '"chromedriver"');

    if (typeof Sk === 'undefined') {
        if (outputEl) {
            outputEl.className = 'exec-output exec-error';
            outputEl.textContent = '⚠️ Python interpreter се вчитува, обиди се повторно за момент...';
        }
        if (execBtn) { execBtn.disabled = false; execBtn.innerHTML = '<i class="bi bi-play-fill"></i> Изврши тест'; }
        return;
    }

    let runCode = code
        .replace(/from selenium[\s\S]*?import[^\n]*\n/g, '')
        .replace(/import selenium[^\n]*\n/g, '');
    runCode = SELENIUM_MOCK + '\n' + runCode;

    let output = '';

    try {
        Sk.configure({
            output: function(text) { output += text; },
            read: function(x) {
                if (Sk.builtinFiles?.files?.[x] !== undefined)
                    return Sk.builtinFiles.files[x];
                throw new Error("File not found: '" + x + "'");
            },
            execLimit: 10000
        });

        await Sk.misceval.asyncToPromise(() =>
            Sk.importMainWithBody('<stdin>', false, runCode, true)
        );

        if (outputEl) {
            outputEl.className = 'exec-output exec-success';
            outputEl.textContent = '✅ Тестот се извршил успешно!\n\n' + output;
        }
    } catch (err) {
        const msg = err.toString();
        if (outputEl) {
            outputEl.className = 'exec-output exec-error';
            if (msg.includes('ImportError') || msg.includes('No module')) {
                outputEl.textContent = '⚠️ Модулот не е достапен во browser режим.\n\nТестот е синтаксно точен.\n\n💡 За целосно извршување:\n   pip install selenium\n   python test.py\n\n--- Greška ---\n' + msg;
            } else if (output) {
                outputEl.className = 'exec-output exec-success';
                outputEl.textContent = '⚠️ Тестот делумно се извршил:\n\n' + output + '\n\n--- Грешка при крај ---\n' + msg;
            } else {
                outputEl.textContent = '❌ Грешка:\n\n' + msg;
            }
        }
    } finally {
        if (execBtn) { execBtn.disabled = false; execBtn.innerHTML = '<i class="bi bi-play-fill"></i> Изврши тест'; }
    }
};

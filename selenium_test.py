import os, time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

APP_URL = "http://localhost:8000/index.html"
SCREEN_DIR = "screenshots"
os.makedirs(SCREEN_DIR, exist_ok=True)

def screenshot(driver, name):
    time.sleep(0.3)
    driver.save_screenshot(os.path.join(SCREEN_DIR, name))
    print(f"[✔] Screenshot saved: {name}")

def create_driver(visible=True):
    opt = Options()
    if not visible:
        opt.add_argument("--headless=new")

    opt.add_experimental_option("excludeSwitches", ["enable-automation"])
    opt.add_experimental_option("useAutomationExtension", False)

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=opt)
    driver.set_window_size(1200, 900)
    return driver

def open_app(driver):
    driver.get(APP_URL)
    print("Opened:", driver.current_url)

def fill_common(driver):
    Select(driver.find_element(By.ID, "country")).select_by_value("IN")
    time.sleep(0.2)
    Select(driver.find_element(By.ID, "state")).select_by_visible_text("Telangana")
    Select(driver.find_element(By.ID, "city")).select_by_visible_text("Hyderabad")
    driver.find_element(By.ID, "email").send_keys("dev@example.com")
    driver.find_element(By.ID, "phone").send_keys("+919876543210")
    driver.find_element(By.CSS_SELECTOR, 'input[name="gender"][value="Male"]').click()
    driver.find_element(By.ID, "address").send_keys("Gachibowli, Hyderabad")

# -------------------------- FLOWS --------------------------

def flow_negative(driver):
    print("\n[Flow A] NEGATIVE TEST")
    try:
        driver.find_element(By.ID, "firstName").send_keys("Anurag")
        fill_common(driver)
        driver.find_element(By.ID, "password").send_keys("Test@1234")
        driver.find_element(By.ID, "confirm").send_keys("Test@1234")
        driver.find_element(By.ID, "terms").click()

        driver.find_element(By.ID, "submitBtn").click()
        screenshot(driver, "error-state.png")

        assert driver.find_element(By.ID, "topError").is_displayed()
        print("[✔] Flow A passed")
    except Exception as e:
        print("[!] Flow A FAILED:", e)
        screenshot(driver, "error-flow-failed.png")

def flow_positive(driver):
    print("\n[Flow B] POSITIVE TEST")
    try:
        driver.find_element(By.ID, "resetBtn").click()
        driver.find_element(By.ID, "firstName").send_keys("Anurag")
        driver.find_element(By.ID, "lastName").send_keys("Singh")
        fill_common(driver)

        driver.find_element(By.ID, "password").send_keys("Abc@12345")
        driver.find_element(By.ID, "confirm").send_keys("Abc@12345")
        driver.find_element(By.ID, "terms").click()

        WebDriverWait(driver, 5).until(lambda d: d.find_element(By.ID, "submitBtn").is_enabled())
        driver.find_element(By.ID, "submitBtn").click()
        screenshot(driver, "success-state.png")

        assert driver.find_element(By.ID, "topSuccess").is_displayed()
        print("[✔] Flow B passed")
    except Exception as e:
        print("[!] Flow B FAILED:", e)
        screenshot(driver, "success-flow-failed.png")

def flow_logic(driver):
    print("\n[Flow C] LOGIC VALIDATION")
    try:
        driver.find_element(By.ID, "resetBtn").click()

        Select(driver.find_element(By.ID, "country")).select_by_value("US")
        time.sleep(0.2)
        Select(driver.find_element(By.ID, "state")).select_by_visible_text("Texas")
        Select(driver.find_element(By.ID, "city")).select_by_visible_text("Austin")

        driver.find_element(By.ID, "firstName").send_keys("A")
        driver.find_element(By.ID, "lastName").send_keys("B")
        driver.find_element(By.ID, "email").send_keys("logic@example.com")
        driver.find_element(By.ID, "phone").send_keys("+11234567890")
        driver.find_element(By.CSS_SELECTOR, 'input[name=\"gender\"][value=\"Other\"]').click()

        driver.find_element(By.ID, "password").send_keys("Strong1!")
        driver.find_element(By.ID, "confirm").send_keys("Mismatch!")
        driver.find_element(By.ID, "terms").click()

        # Submit must be disabled
        if driver.find_element(By.ID, "submitBtn").is_enabled():
            raise Exception("Submit enabled unexpectedly!")

        screenshot(driver, "logic-validation.png")
        print("[✔] Flow C passed")

    except Exception as e:
        print("[!] Flow C FAILED:", e)
        screenshot(driver, "logic-flow-failed.png")

# ----------------------- MAIN -------------------------

def main():
    driver = create_driver(visible=True)
    try:
        open_app(driver)
        flow_negative(driver)
        flow_positive(driver)
        flow_logic(driver)
        print("\n🔥 ALL FLOWS FINISHED. CHECK SCREENSHOTS FOLDER.")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()

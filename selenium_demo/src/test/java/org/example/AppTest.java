package org.example;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.time.Duration;

/**
 * SkillBridge – TestNG Linear Test
 *
 * Flow (sequential, dependsOnMethods chained):
 *   1. Worker Registration  →  lands directly on /home
 *   2. Navigate to /workers (Worker Registration page)
 *   3. Register Worker Profile (fill modal, submit)
 *   4. Logout via sidebar  →  lands on /worker-login
 *   5. Seeker Registration  →  lands directly on /home
 *   6. Post a Job on /jobs
 *
 * Add to pom.xml:
 *   <dependency>
 *     <groupId>org.testng</groupId>
 *     <artifactId>testng</artifactId>
 *     <version>7.9.0</version>
 *     <scope>test</scope>
 *   </dependency>
 *   <dependency>
 *     <groupId>org.seleniumhq.selenium</groupId>
 *     <artifactId>selenium-java</artifactId>
 *     <version>4.18.1</version>
 *   </dependency>
 */
public class AppTest {

    // ── Config ───────────────────────────────────────────────────────────────────
    private static final String BASE_URL = "http://localhost:4200";
    private static final int    WAIT_SEC = 10;

    // Worker test data
    private static final String WORKER_NAME  = "Ravi Kumar";
    private static final String WORKER_EMAIL = "ravi15.test@skillbridge.com";
    private static final String WORKER_PASS  = "Test@1234";
    private static final String WORKER_PHONE = "9876543210";
    private static final String WORKER_LOC   = "Anna Nagar, Chennai";
    private static final String WORKER_EXP   = "3";
    private static final String WORKER_DESC  = "Expert plumber with 3 years of experience.";

    // Seeker test data
    private static final String SEEKER_NAME  = "Priya Sharma";
    private static final String SEEKER_EMAIL = "priya5.test@skillbridge.com";
    private static final String SEEKER_PASS  = "Test@5678";
    private static final String SEEKER_PHONE = "9123456780";

    // Job post data
    private static final String JOB_TITLE    = "Fix kitchen sink";
    private static final String JOB_LOCATION = "T Nagar";
    private static final String JOB_PINCODE  = "600017";
    private static final String JOB_BUDGET   = "300-500";

    // ── Shared driver & wait ─────────────────────────────────────────────────────
    private WebDriver     driver;
    private WebDriverWait wait;

    // ════════════════════════════════════════════════════════════════════════════
    //  SETUP & TEARDOWN
    // ════════════════════════════════════════════════════════════════════════════

    @BeforeClass
    public void setup() {
        // Uncomment if ChromeDriver is NOT on PATH:
        // System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");

        ChromeOptions options = new ChromeOptions();
        // options.addArguments("--headless");   // uncomment for headless / CI
        options.addArguments("--start-maximized");
        options.addArguments("--disable-notifications");

        driver = new ChromeDriver(options);
        wait   = new WebDriverWait(driver, Duration.ofSeconds(WAIT_SEC));
        System.out.println("Browser launched.");
    }

    @AfterClass
    public void teardown() {
        if (driver != null) {
            driver.quit();
            System.out.println("Browser closed.");
        }
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  STEP 1 – Worker Registration  (goes directly to /home after register)
    // ════════════════════════════════════════════════════════════════════════════

    @Test(priority = 1, description = "Register a new Worker account and verify redirect to /home")
    public void step1_WorkerRegistration() {
        driver.get(BASE_URL + "/worker-register");

        waitVisible(By.cssSelector("input[placeholder='Ravi Kumar']"))
                .sendKeys(WORKER_NAME);

        waitVisible(By.cssSelector("input[type='email']"))
                .sendKeys(WORKER_EMAIL);

        waitVisible(By.cssSelector("input[type='password']"))
                .sendKeys(WORKER_PASS);

        waitVisible(By.xpath("//button[contains(text(),'Register as worker')]"))
                .click();

        // Registration saves session and navigates directly to /home
        wait.until(ExpectedConditions.urlContains("home"));
        System.out.println("  ✔ Worker registered – landed on /home.");
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  STEP 2 – Navigate to Worker Registration page (/workers) via sidebar
    // ════════════════════════════════════════════════════════════════════════════

    @Test(priority = 2,
            dependsOnMethods = "step1_WorkerRegistration",
            description = "Navigate to /workers page via sidebar link")
    public void step2_NavigateToWorkersPage() {
        waitVisible(By.xpath("//span[@class='nav-label' and text()='Worker Registration']"))
                .click();

        wait.until(ExpectedConditions.urlContains("workers"));
        System.out.println("  ✔ On /workers page.");
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  STEP 3 – Register Worker Profile (fill and submit the modal)
    // ════════════════════════════════════════════════════════════════════════════

    @Test(priority = 3,
            dependsOnMethods = "step2_NavigateToWorkersPage",
            description = "Fill and submit the Register for a Job modal")
    public void step3_WorkerProfileRegistration() {
        // Click "+ Register for a Job" button (visible to WORKER role)
        waitVisible(By.xpath("//button[contains(text(),'Register for a Job')]"))
                .click();

        // Modal opens – fill all fields
        waitVisible(By.cssSelector("input[formControlName='fullName']"))
                .sendKeys(WORKER_NAME);

        waitVisible(By.cssSelector("input[formControlName='phone']"))
                .sendKeys(WORKER_PHONE);

        waitVisible(By.cssSelector("input[formControlName='email']"))
                .sendKeys(WORKER_EMAIL);

        waitVisible(By.cssSelector("input[formControlName='location']"))
                .sendKeys(WORKER_LOC);

        // Job Type dropdown
        new Select(waitVisible(By.cssSelector("select[formControlName='jobType']")))
                .selectByValue("plumbing");

        waitVisible(By.cssSelector("input[formControlName='experience']"))
                .sendKeys(WORKER_EXP);

        waitVisible(By.cssSelector("textarea[formControlName='description']"))
                .sendKeys(WORKER_DESC);

        // Submit
        waitVisible(By.cssSelector("button[type='submit']")).click();

        // Success alert appears on the page
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".alert-success")));
        System.out.println("  ✔ Worker profile registered – success alert shown.");
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  STEP 4 – Logout via sidebar Logout button
    // ════════════════════════════════════════════════════════════════════════════

    @Test(priority = 4,
            dependsOnMethods = "step3_WorkerProfileRegistration",
            description = "Click sidebar Logout and verify redirect to /worker-login")
    public void step4_Logout() {
        // Sidebar: <a class="nav-item logout" (click)="logout()">Logout</a>
        waitVisible(By.xpath("//a[contains(@class,'logout')]")).click();

        // After logout, app redirects to /worker-login
        wait.until(ExpectedConditions.urlContains("worker-login"));
        System.out.println("  ✔ Logged out – on /worker-login.");
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  STEP 5 – Seeker Registration  (goes directly to /home after register)
    // ════════════════════════════════════════════════════════════════════════════

    @Test(priority = 5,
            dependsOnMethods = "step4_Logout",
            description = "Register a new Seeker account and verify redirect to /home")
    public void step5_SeekerRegistration() {
        driver.get(BASE_URL + "/seeker-register");

        waitVisible(By.cssSelector("input[placeholder='Priya Sharma']"))
                .sendKeys(SEEKER_NAME);

        waitVisible(By.cssSelector("input[type='email']"))
                .sendKeys(SEEKER_EMAIL);

        waitVisible(By.cssSelector("input[type='password']"))
                .sendKeys(SEEKER_PASS);

        waitVisible(By.xpath("//button[contains(text(),'Register as seeker')]"))
                .click();

        // Registration saves session and navigates directly to /home
        wait.until(ExpectedConditions.urlContains("home"));
        System.out.println("  ✔ Seeker registered – landed on /home.");
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  STEP 6 – Post a Job on /jobs (Seeker)
    // ════════════════════════════════════════════════════════════════════════════

    @Test(priority = 6,
            dependsOnMethods = "step5_SeekerRegistration",
            description = "Navigate to /jobs, fill the Post a Job form and verify job card appears")
    public void step6_PostJob() {
        // Navigate to Job Registration via sidebar
        waitVisible(By.xpath("//span[@class='nav-label' and text()='Job Registration']"))
                .click();

        wait.until(ExpectedConditions.urlContains("jobs"));

        // Click "+ Post a Job" (only visible to SEEKER role)
        waitVisible(By.xpath("//button[contains(text(),'Post a Job')]")).click();

        // Fill the post-job form
        waitVisible(By.cssSelector("input[placeholder='e.g. Fix kitchen sink']"))
                .sendKeys(JOB_TITLE);

        new Select(waitVisible(By.cssSelector(".form-card select")))
                .selectByVisibleText("Plumber");

        waitVisible(By.cssSelector("input[placeholder='e.g. Anna Nagar']"))
                .sendKeys(JOB_LOCATION);

        waitVisible(By.cssSelector("input[placeholder='600001']"))
                .sendKeys(JOB_PINCODE);

        waitVisible(By.cssSelector("input[placeholder='e.g. ₹300-500']"))
                .sendKeys(JOB_BUDGET);

        waitVisible(By.cssSelector("input[placeholder='Your name']"))
                .sendKeys(SEEKER_NAME);

        waitVisible(By.cssSelector("input[placeholder='Your phone number']"))
                .sendKeys(SEEKER_PHONE);

        // Scroll "Post Job" into view and click via JS to avoid interception
        WebElement postJobBtn = waitVisible(
                By.xpath("//button[contains(text(),'Post Job')]"));
        jsClick(postJobBtn);

        // Form closes and new job card appears in the list
        wait.until(ExpectedConditions.invisibilityOfElementLocated(
                By.xpath("//h3[text()='Post a new job']")));

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[contains(text(),'" + JOB_TITLE + "')]")));

        System.out.println("  ✔ Job posted – card visible in job list.");
    }

    // ════════════════════════════════════════════════════════════════════════════
    //  Helpers
    // ════════════════════════════════════════════════════════════════════════════

    private WebElement waitVisible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    /** Scroll element into view then click via JS – avoids interception by overlays. */
    private void jsClick(WebElement element) {
        org.openqa.selenium.JavascriptExecutor js =
                (org.openqa.selenium.JavascriptExecutor) driver;
        js.executeScript("arguments[0].scrollIntoView({block:'center'});", element);
        js.executeScript("arguments[0].click();", element);
    }
}
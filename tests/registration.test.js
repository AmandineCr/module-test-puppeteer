const timeout = 15000;
const $username = "testsignup";
const $password = 'test';
const $email = 'test@test.test';

// série de tests sur la registration
describe("Tests registration", () => {
    let page;

    test('home', async () => {
        /*
         * Step 1
         *
         * Action :
         * Load the following URL: "http://polr.campus-grenoble.fr"
         *
         * Expected result :
         * Le titre "Polr du campus" sauvage apparait !
        */
        await page.goto('http://polr.campus-grenoble.fr');
        await page.waitForSelector('h1.title');

        let html = await page.$eval('body', e => e.innerHTML);
        expect(html).toContain("Polr du campus");
        await page.screenshot({path: './tests/img/registration/home.png'});

        /*
         * Step 2
         *
         * Action :
         * Cliquer sur "Sign Up"
         *
         * Expected result :
         * Le titre de la page est "Register"
         * Affiche formulaire avec 3 inputs ("Username","Password","Email")
         * Un boutton "Register"
         */
        await clickOnNavbar(page, "Sign Up");
        await page.waitForSelector('form[action="/signup"]');
        await page.screenshot({path: './tests/img/registration/pageSignUp.png'});

        const usernameSelector = 'form[action="/signup"] *:nth-child(1)';
        const passwordSelector = 'form[action="/signup"] *:nth-child(2)';
        const emailSelector = 'form[action="/signup"] *:nth-child(3)';
        const btnRegisterSelector = 'form[action="/signup"] *:nth-child(5)';

        const pageTitle = await page.$eval('h2.title', e => e.innerHTML);
        const username = await page.$eval(usernameSelector, e => e.name);
        const password = await page.$eval(passwordSelector, e => e.name);
        const email = await page.$eval(emailSelector, e => e.name);
        const btnRegister = await page.$eval(btnRegisterSelector, e => e.value);

        expect(pageTitle.toLowerCase()).toEqual("register");
        expect(username.toLowerCase()).toEqual('username');
        expect(password.toLowerCase()).toEqual('password');
        expect(email.toLowerCase()).toEqual('email');
        expect(btnRegister.toLowerCase()).toEqual('register');

        /*
         * Step 3
         *
         * Action :
         * Remplir les 3 inputs et cliquer sur le boutton "Register"
         *
         * Expected result :
         * Redirection vers "http://polr.campus-grenoble.fr/login"
         * Affichage du formulaire de login - Inputs : "username", "password"
         * Un boutton "Login"
         */
        await page.type(usernameSelector, $username);
        await page.type(passwordSelector, $password);
        await page.type(emailSelector, $email);
        await page.screenshot({path: './tests/img/registration/sign-up-form-complete.png'});
        await page.click(btnRegisterSelector);
        await page.screenshot({path: './tests/img/registration/click-register-button.png'});

        await page.waitFor(2000);

        html = await page.$eval('body', e => e.innerHTML);
        expect(html).toContain('Login');
        expect(html).toContain('name="username');
        expect(html).toContain('name="password');
        expect(html).toContain('value="Login"');


        /*
         * Step 4
         *
         * Action :
         * Remplir ces 2 inputs et cliquer sur le boutton "Login"
         *
         * Expected result :
         * Redirection vers "http://polr.campus-grenoble.fr"
         * Le titre "Polr du campus"
         * Session active
         */
        await page.type('.container input[name="username"]', $username);
        await page.type('.container input[name="password"]', $password);
        await page.screenshot({path: './tests/img/registration/login-form-complete.png'});
        await page.click('.container input[value="Login"]');
        await page.waitForSelector('.login-name');
        await page.screenshot({path: './tests/img/registration/click-login-button.png'});

        const logged = await page.$eval('.login-name', e => e.innerText);

        expect(logged.trim().toLocaleLowerCase()).toEqual($username.toLocaleLowerCase())

    }, timeout);

    // cette fonction est lancée avant chaque test de cette
    // série de tests
    beforeAll(async () => {
        page = await global.__BROWSER__.newPage();
        // Accepte toutes les alertes
        page.on('dialog', async dialog => {
            await dialog.accept();
        });
        await page.goto('http://polr.campus-grenoble.fr');
        await page.waitForSelector('body');
        await clickOnNavbar(page, 'Sign In ');
        await page.screenshot({path: './tests/img/registration/click-sign-in.png'});
        await page.waitForSelector('.login-form-field');
        await page.type('.login-form-field[name="username"]', 'admin');
        await page.type('.login-form-field[name="password"]', 'campus');
        await page.click('.login-form-submit');
        await page.waitForSelector('nav[role="navigation"] a.login-name');
        await page.click('nav[role="navigation"] a.login-name');
        await clickOnNavbar(page, 'Settings');
        await page.waitForSelector('[href="#admin"]');
        await page.screenshot({path: './tests/img/registration/click-settings.png'});
        await page.click('[href="#admin"]');
        await page.waitForSelector('input[aria-controls="admin_users_table"]');
        await page.type('input[aria-controls="admin_users_table"]', $username);
        await page.waitFor(1000);
        const user = await page.$eval("#admin_users_table tr:first-child td:first-child", el => el.innerHTML);
        if (user === $username) {
            await page.click("#admin_users_table tr:first-child a.btn-danger");
            await page.waitFor(1000)
        }
        await clickOnNavbar(page, 'logout');
        await page.waitForSelector('#shorten');
        await page.screenshot({path: './tests/img/registration/click-logout.png'});
    }, timeout)
});

async function clickOnNavbar($page, textContent) {
    await $page.evaluate((textContent) => {
        let f = () => el => el.textContent.toLowerCase() === textContent.toLowerCase();
        Array
            .from(document.querySelectorAll('nav[role="navigation"] a'))
            .filter(f())[0].click()
    }, textContent);
}


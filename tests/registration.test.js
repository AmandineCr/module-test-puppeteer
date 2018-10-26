const timeout = 15000
const $username = "testsignup"

// série de tests sur la page d'accueil
describe("Tests registration", () => {
    let page

    // vérification du chargement de la page d'accueil
    test('home', async () => {
        // charger la page d'accueil
        await page.goto('http://polr.campus-grenoble.fr')
        // attendre que l'élément <body> soit chargé
        await page.waitForSelector('body')
        // récupérer le contenu de l'élément <body>
        let html = await page.$eval('body', e => e.innerHTML)
        expect(html).toContain("Polr du campus")
        await clickOnNavbar(page, "Sign Up")
        await page.waitForNavigation()
        await page.screenshot({path: './tests/img/pageSignUp.png'});

        const usernameSelector = 'form[action="/signup"] *:nth-child(1)';
        const passwordSelector = 'form[action="/signup"] *:nth-child(2)';
        const emailSelector = 'form[action="/signup"] *:nth-child(3)';
        const btnRegisterSelector = 'form[action="/signup"] *:nth-child(5)';

        const pageTitle = await page.$eval('h2.title', e => e.innerHTML)
        expect(pageTitle.toLowerCase()).toEqual("register")

        const username = await page.$eval(usernameSelector, e => e.name)
        expect(username.toLowerCase()).toEqual('username')

        const password = await page.$eval(passwordSelector, e => e.name)
        expect(password.toLowerCase()).toEqual('password')

        const email = await page.$eval(emailSelector, e => e.name)
        expect(email.toLowerCase()).toEqual('email')

        const btnRegister = await page.$eval(btnRegisterSelector, e => e.value)
        expect(btnRegister.toLowerCase()).toEqual('register')

        await page.screenshot({path: './tests/img/pg-register.png'});
        await page.waitForSelector('.form-field')
        await page.type(usernameSelector, $username)
        await page.type(passwordSelector, 'test')
        await page.type(emailSelector, 'test@test.test')
        await page.screenshot({path: './tests/img/signupformcomplete.png'});
        await page.click(btnRegisterSelector);
        await page.screenshot({path: './tests/img/clickregisterbutton.png'});

        html = await page.$eval('body', e => e.innerHTML)
        expect(html).toContain("Login")




    }, timeout)

    // cette fonction est lancée avant chaque test de cette
    // série de tests
    beforeAll(async () => {
        page = await global.__BROWSER__.newPage()
        page.on('dialog', async dialog => {
            await dialog.accept();
        });
        await page.goto('http://polr.campus-grenoble.fr')
        await page.waitForSelector('body')
        await clickOnNavbar(page, 'Sign In ')
        await page.waitForSelector('.login-form-field')
        await page.type('.login-form-field[name="username"]', 'admin')
        await page.type('.login-form-field[name="password"]', 'campus')
        await page.click('.login-form-submit');
        await page.click('#navbar li a.login-name');
        await clickOnNavbar(page, 'Settings')
        await page.waitForSelector('[href="#admin"]')
        await page.click('[href="#admin"]')
        await page.waitForSelector('input[aria-controls="admin_users_table"]')
        await page.type('input[aria-controls="admin_users_table"]', $username)
        await page.waitFor(1000)
        const user = await page.$eval("#admin_users_table tr:first-child td:first-child", el => el.innerHTML);
        if (user === $username)
            await page.click("#admin_users_table tr:first-child a.btn-danger")
        await clickOnNavbar(page, 'logout')
        await page.waitForSelector('body')
    }, timeout)
})

async function clickOnNavbar($page, textContent) {
    await $page.evaluate((textContent) => {
        let f = () => el => el.textContent.toLowerCase() === textContent.toLowerCase()
        Array
            .from(document.querySelectorAll('#navbar li a'))
            .filter(f())[0].click()
    }, textContent);
}


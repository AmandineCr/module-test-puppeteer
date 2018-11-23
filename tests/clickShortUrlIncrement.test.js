const timeout = 15000;
const $username = "Amandine";

// série de tests sur la page d'accueil
describe("Tests username with a percent", () => {
    let page;

    // vérification du chargement de la page d'accueil
    test('home', async () => {
        // charger la page d'accueil
        await page.goto('http://localhost:8000');
        // attendre que l'élément <body> soit chargé
        await page.waitForSelector('body');
        // récupérer le contenu de l'élément <body>
        let html = await page.$eval('body', e => e.innerHTML);
        expect(html).toContain("Polr dev")
        await clickOnNavbar(page, 'Sign In ')
        await page.waitForSelector('.login-form-field')
        await page.type('.login-form-field[name="username"]', 'Amandine')
        await page.type('.login-form-field[name="password"]', 'coucou')
        await page.click('.login-form-submit');
        await page.waitForSelector('#navbar li a.login-name');
        await page.click('#navbar li a.login-name');
        await clickOnNavbar(page, 'Settings')
        await page.waitForSelector('[href="#links"]')
        await page.click('[href="#links"]')
        await page.waitForSelector('#user_links_table')
        await page.screenshot({path: './tests/img/click_links.png'});
        await page.waitFor(1000)
        let clicks = await page.$eval("#user_links_table tbody tr:first-child td:nth-child(3)", el => el.innerHTML);
        const linkEnding = await page.$eval("#user_links_table tbody tr:first-child td:nth-child(1)", el => el.innerHTML)
        newPage = await global.__BROWSER__.newPage()
        await newPage.goto(`http://localhost:8000/${linkEnding}`);
        await page.reload();
        await page.waitForSelector('#user_links_table tbody tr:first-child td')
        await page.screenshot({path: './tests/img/reload.png'});
        const newClicks = await page.$eval("#user_links_table tbody tr:first-child td:nth-child(3)", el => el.innerHTML);
        await newPage.screenshot({path: './tests/img/new_click.png'});
        expect(Number(newClicks)).toBe(++clicks);

    }, timeout)

    // cette fonction est lancée avant chaque test de cette
    // série de tests
    beforeAll(async () => {
        page = await global.__BROWSER__.newPage()

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


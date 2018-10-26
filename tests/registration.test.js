const timeout = 15000

// série de tests sur la page d'accueil
describe("Tests registration", () => {
    let page

    // vérification du chargement de la page d'accueil
    test('home', async () => {
        // charger la page d'accueil
        await page.goto('http://polr.campus-grenoble.fr/signup')
        // attendre que l'élément <body> soit chargé
        await page.waitForSelector('body')
        // récupérer le contenu de l'élément <body>
        const html = await page.$eval('body', e => e.innerHTML)
        // vérifier que dans cet élément Body on trouve "Polr du campus"
        expect(html).toContain("Polr du campus")
    }, timeout)

    // cette fonction est lancée avant chaque test de cette
    // série de tests
    beforeAll(async () => {
        // ouvrir un onglet dans le navigateur
        page = await global.__BROWSER__.newPage()
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
        await page.type('input[aria-controls="admin_users_table"]', 'blob13')
        await page.waitFor(2000)
        await page.evaluate(() => {
            window.scrollTo(0, document.getElementById('admin_links_table_wrapper').offsetHeight)
        });

        await page.evaluate(() => {
            let btns = document.querySelectorAll("#admin_users_table tr:first-child a")
            btns[btns.length-1].click()
        });

        await page.waitFor(2000)

        await page.screenshot({path: './tests/img/hahahah.png'})
    }, timeout)
})

async function clickOnNavbar($page, textContent) {
    await $page.evaluate((textContent) => {
        let f = () => el => el.textContent === textContent
        Array
            .from(document.querySelectorAll('#navbar li a'))
            .filter(f())[0].click()
    }, textContent);
}


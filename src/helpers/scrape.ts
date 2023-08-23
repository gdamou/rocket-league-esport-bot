import puppeteer from 'puppeteer';

export const scrapeMatchups = async (): Promise<{ [header: string]: string[] }> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(process.env.SCRAPE_URL);

    // Extracting all matchups
    const allMatchups = await page.$$eval('.brkts-match', (matches) =>
        matches.map((match) => {
            const teams = Array.from(match.querySelectorAll('.brkts-opponent-entry'));

            return teams
                .map((team) => {
                    const teamNameNode = team.querySelector('.block-team .name');
                    if (teamNameNode) {
                        return teamNameNode.textContent!.trim();
                    }

                    const noOpponentNode = team.querySelector('.brkts-opponent-block-literal');
                    if (noOpponentNode) {
                        return '???';
                    }

                    return 'unknown';
                })
                .join(' VS ');
        })
    );

    if (allMatchups.length !== 7) throw new Error('Unexpected number of matchups');

    const groupedMatchups: { [header: string]: string[] } = {};

    groupedMatchups['Quarterfinals'] = [...allMatchups.slice(0, 2), ...allMatchups.slice(3, 5)];
    groupedMatchups['Semifinals'] = [allMatchups[2], allMatchups[5]];
    groupedMatchups['Finals'] = [allMatchups[6]];

    await browser.close();
    return groupedMatchups;
};

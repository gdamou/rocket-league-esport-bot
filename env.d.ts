declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            SCRAPE_URL: string;
            CHANNEL_ID: string;
        }
    }
}

export {};

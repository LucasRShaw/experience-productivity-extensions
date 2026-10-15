import ENGLISH_TRANSLATION from '../i18n/en.json';

export const getMessages = async (userLocale) => {
    const { messages: baseMessages } = ENGLISH_TRANSLATION;


    try {
        const { messages: localeMessages } = await import(`../i18n/${userLocale}.json`);
        if (localeMessages) {
            return Object.assign({}, baseMessages, localeMessages);
        }
    } catch (e) {
        // fall through
        console.log("Error: "+e);
        // return baseMessages;
    }

    try {
        const actionLanguage = userLocale.split(/[-_]/)[0];
        const { messages: localeMessages } = await import(`../i18n/${actionLanguage}.json`);
        return Object.assign({}, baseMessages, localeMessages);
    } catch (e) {
        // fallback to English
        console.log("Error: "+e);
        return baseMessages;
    }
};
/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

/**
 * Google reCAPTCHA simplified interface
 */
interface Recaptcha
{
    ready (callback: () => void): void;

    execute (siteKey: string, props: { action: string }): Promise<string>;
}

/**
 * Function for requiring valid recaptcha client token
 */
export default function useRecaptcha (recaptchaPublicToken: string, action = "login"): Promise<string> {
    const recaptcha = (window as any).grecaptcha as Recaptcha;

    return new Promise((resolve, reject) => {
        if (!recaptchaPublicToken)
            return reject("Cannot find recaptcha public key. Does ControlPanel context provided?");

        // Check if recaptcha instance exist.
        let iterations = 0;
        const interval = setInterval(() => {
            if (iterations > 100) {
                clearInterval(interval);
                return reject("Can not find recaptcha instance");
            }

            if (!recaptcha) {
                iterations += 1;
                return;
            }

            clearInterval(interval);
            recaptcha.ready(() => {
                // Check if recaptcha instance has an execute method.
                if (!("execute" in recaptcha)) return reject("Invalid recaptcha instance registered");

                // Get client token.
                recaptcha.execute(recaptchaPublicToken, { action })
                    .then(token => resolve(token));
            });
        }, 100);
    });
}

/* eslint-disable prettier/prettier */


/**
 * Formats a phone number with a country code.
 *
 * @param payload - An object containing the phone number and country code.
 * @param payload.phoneNumber - The phone number to format.
 * @param payload.countryCode - The country code to use.
 * @returns The formatted phone number with the country code.
 */
export function phoneNumberWithCountryCode(payload: {
    phoneNumber: string;
    countryCode: string;
}): string {
    const { phoneNumber, countryCode } = payload;
    return formatPhoneNumber({ phone: phoneNumber, countryCode });
}


function formatPhoneNumber(payload: { phone: string, countryCode: string }): string {
    const { phone, countryCode } = payload;
    let code = countryCode;
    if (code.startsWith('+')) {
        code = code.replace('+', '');
    }

    let mobile: string = phone.toString().replace(/\s+/g, ''); // Remove spaces

    if (mobile.startsWith('0')) {
        mobile = `${code}${mobile.slice(1)}`;
    } else if (mobile.startsWith('+')) {
        mobile = mobile.replace('+', '');
    } else {
        mobile = `${code}${mobile}`;
    }
    return mobile;
}

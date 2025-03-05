/* eslint-disable prettier/prettier */
import { LANCOLA_SMS_apiKey, LANCOLA_SMS_APIURL, LANCOLA_SMS_partnerID, LANCOLA_SMS_shortCode } from "src/INTEGRATIONS/lancola-sms/lancola-sms.config";
import { SMSInterface } from "src/shared/interfaces/sms.interface";

export function prepareMessage(payload: SMSInterface) {
    const { phone, message } = payload;
    const preparedMessage = `${LANCOLA_SMS_APIURL}${LANCOLA_SMS_apiKey}&partnerID=${LANCOLA_SMS_partnerID}&message=${encodeURIComponent(message)}&shortcode=${LANCOLA_SMS_shortCode}&mobile=${phone}`;
    return preparedMessage;
}
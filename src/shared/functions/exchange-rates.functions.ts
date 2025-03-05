import { cloneDeep } from 'lodash';
import {
  CurrencyConversionInterface,
  CurrencyInterface,
} from '../interfaces/exchange-rates.interface';

/**
 * Converts an amount in one currency to an amount in a specified currency,
 * using provided exchange rates and the convertToUSD function.
 *
 * @param data - The currency conversion data containing the amount to convert,
 * the currency to convert from, and the specified currency to convert to.
 * @param exchangeRates - The exchange rates to use for the currency conversion.
 * @returns The converted amount in the specified currency.
 */
export function convertToSpecifiedCurrency(
  conversion: CurrencyConversionInterface,
  exchangeRates: any,
): CurrencyInterface {
  const data = cloneDeep(conversion);
  const amountInDollars = convertToUSD(
    // extractNumbers(data.amount),

    data.amount,
    data.currencyToConvert,
    exchangeRates,
  );
  if (isNaN(amountInDollars)) {
    console.error('Invalid amount to convert');
  }
  const currencyRate = exchangeRates[getCurrency(data.specifiedCurrency)];

  const amount = amountInDollars * Number(currencyRate);

  // const amount = data.amount

  return {
    currency: data.specifiedCurrency,
    amount: formatNumberWithTwoDecimalPlaces(amount),
  };
}

function extractNumbers(str: string | number): number {
  return Number(str.toString().replace(/[^0-9]/g, ''));
}

/**
 * Converts an amount in a specified currency to an amount in USD,
 * using provided exchange rates.
 *
 * @param amount - The amount to convert.
 * @param currencyToConvert - The currency of the amount to convert.
 * @param exchangeRates - The exchange rates to use for conversion.
 * @returns The amount converted to USD.
 */
function convertToUSD(
  amount: number,
  currencyToConvert: string,
  exchangeRates: any,
): number {
  const currencyRate = exchangeRates[getCurrency(currencyToConvert)];

  if (!currencyRate) {
    throw new Error('Currency not found');
  } else {
    const amountInDollars = amount / Number(currencyRate);
    return amountInDollars;
  }
}

function formatNumberWithTwoDecimalPlaces(number: number): number {
  return Number(number.toFixed(2));
}

function getCurrency(currency: string) {
  const swappedCurrencies: any[] = [
    {
      currency: 'MRO',
      swap: 'MRU',
    },
  ];
  const find = swappedCurrencies.find((s) => s.currency === currency);
  if (find) {
    return find.swap;
  }
  return currency;
}

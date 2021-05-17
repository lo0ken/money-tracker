import { func } from 'prop-types';

type CurrencyT = {
  name: string;
  symbol: string;
  exp: number;
  flag?: string;
};

type AvailableCurrencyT = {
  [code: string]: CurrencyT;
};


let CURRENCY: AvailableCurrencyT = { }

loadCurrencies()

function loadCurrencies() {
  return fetch("http://localhost:8080/currencies")
    .then(res => res.json())
    .then(res => res.reduce(function(acc: { [x: string]: {}; }, obj: any) {
        acc[obj.code] = {
          name: obj.name,
          symbol: obj.symbol,
          exp: obj.exp,
          flag: obj.flag
        }
        return acc
      }, {}))
    .then(res => setCur(res))

}

function setCur(obj: AvailableCurrencyT) {
  CURRENCY = obj
}

export interface ExchangeRateT {
  [code: string]: number;
}

type CurrencyOptionT = {
  key: string;
  value: string;
  text: string;
  flag?: string;
};

const Currency = {
  defaultBase: 'USD',
  options(): CurrencyOptionT[] {
    return Object.keys(CURRENCY).map(code => ({
      key: code,
      value: code,
      flag: CURRENCY[code].flag,
      text: `${code}, ${CURRENCY[code].name}`
    }));
  },
  name(code: string) {
    return CURRENCY[code].name;
  },
  symbol(code: string) {
    return CURRENCY[code].symbol;
  },
  minAmount(code: string) {
    return Number(`1e-${CURRENCY[code].exp}`);
  },
  /**
   * Convert value to currency's subunit (e.g. cents for USD).
   * Subunit is the minimal currency unit and it is always whole integer.
   */
  numberToCents(value: string | number, code: string) {
    return Math.round(parseFloat(`${value}e${CURRENCY[code].exp}`));
  },
  /**
   * Convert value from subunit back to float representation with formatting.
   * For example 199001 USD becomes 1,990.01 USD
   */
  centsToNumber(value: number, code: string): number {
    const exp = CURRENCY[code].exp;
    const num = Number(`${value}e-${exp}`);

    return num;
  },
  centsToString(value: number, code: string, format: boolean = true): string {
    const exp = CURRENCY[code].exp;
    const num = Number(`${value}e-${exp}`);

    return format
      ? num.toLocaleString(undefined, {
          minimumFractionDigits: exp,
          maximumFractionDigits: exp
        })
      : num.toString();
  },
  centsToDollar(value: number, code: string): string {
    const exp = CURRENCY[code].exp;
    const num = Number(`${value}e-${exp}`);

    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  },
  convert(value: number, rate: number, from: string, to: string) {
    return (value / rate) * Math.pow(10, CURRENCY[from].exp - CURRENCY[to].exp);
  }
};

export default Currency;

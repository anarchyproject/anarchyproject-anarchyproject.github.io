import {formatUnits, parseUnits} from "viem";


class Unit {
  #stringAmount;
  #uint256Amount;
  constructor(name, decimals, value) {
    this.name = name;
    this.decimals = decimals;
    this.#stringAmount = value;
    this.#uint256Amount = parseUnits(value, decimals);
  }

  get stringAmount() {
    return this.#stringAmount;
  }

  get uint256Amount() {
    return this.#uint256Amount;
  }

  get floatValue() {
    return parseFloat(this.#stringAmount);
  }

  toString() {
    return this.#stringAmount;
  }
}

export class TBTC extends Unit {
  static decimals = 18

  constructor(stringAmount) {
    super('tBTC', TBTC.decimals, stringAmount);
  }

  static fromBigInt(uint256Amount) {
    return new TBTC(formatUnits(uint256Amount, TBTC.decimals));
  }
}

export class XAC extends Unit {
  static decimals = 4;

  constructor(stringAmount) {
    super('xAC', XAC.decimals, stringAmount);
  }

  static fromBigInt(uint256Amount) {
    return new XAC(formatUnits(uint256Amount, XAC.decimals));
  }
}

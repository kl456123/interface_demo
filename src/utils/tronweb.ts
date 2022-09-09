import { ethers } from "ethers";
import { Buffer } from "buffer";
import axios, { AxiosInstance } from "axios";
import validator from "validator";
import * as bs58 from "bs58";

export function toHex(tronAddr: string) {
  if (!tronAddr.length || tronAddr === "0x") {
    return "";
  }
  return Buffer.from(bs58.decode(tronAddr).slice(0, -4))
    .toString("hex")
    .replace("41", "0x");
}

const BASE = 58;
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export const getUrl = function (network: string) {
  if (network == "main") {
    return "https://api.trongrid.io";
  } else if (network == "dev") {
    return "https://api.shasta.trongrid.io";
  }
  return null;
};

export function encode58(buffer: number[]) {
  if (buffer.length === 0) return "";

  let i;
  let j;

  const digits = [0];

  for (i = 0; i < buffer.length; i++) {
    for (j = 0; j < digits.length; j++) digits[j] <<= 8;

    digits[0] += buffer[i];
    let carry = 0;

    for (j = 0; j < digits.length; ++j) {
      digits[j] += carry;
      carry = (digits[j] / BASE) | 0;
      digits[j] %= BASE;
    }

    while (carry) {
      digits.push(carry % BASE);
      carry = (carry / BASE) | 0;
    }
  }

  for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) digits.push(0);

  return digits
    .reverse()
    .map((digit) => ALPHABET[digit])
    .join("");
}

export function byte2hexStr(byte: number) {
  if (typeof byte !== "number") throw new Error("Input must be a number");

  if (byte < 0 || byte > 255) throw new Error("Input must be a byte");

  const hexByteMap = "0123456789ABCDEF";

  let str = "";
  str += hexByteMap.charAt(byte >> 4);
  str += hexByteMap.charAt(byte & 0x0f);

  return str;
}

export function byteArray2hexStr(byteArray: number[]) {
  let str = "";

  for (let i = 0; i < byteArray.length; i++) str += byte2hexStr(byteArray[i]);

  return str;
}

export function SHA256(msgBytes: number[]) {
  const msgHex = byteArray2hexStr(msgBytes);
  const hashHex = ethers.utils.sha256("0x" + msgHex).replace(/^0x/, "");
  return hexStr2byteArray(hashHex);
}

function getBase58CheckAddress(addressBytes: number[]) {
  const hash0 = SHA256(addressBytes);
  const hash1 = SHA256(hash0);

  let checkSum = hash1.slice(0, 4);
  checkSum = addressBytes.concat(checkSum);

  return encode58(checkSum);
}

export function fromHex(ethAddr: string) {
  if (!ethAddr.length || ethAddr === "0x") {
    return "";
  }
  return getBase58CheckAddress(hexStr2byteArray(ethAddr.replace(/^0x/, "41")));
}

export function isHexChar(c: string) {
  if (
    (c >= "A" && c <= "F") ||
    (c >= "a" && c <= "f") ||
    (c >= "0" && c <= "9")
  ) {
    return 1;
  }

  return 0;
}

export function hexChar2byte(c: string) {
  let d;

  if (c >= "A" && c <= "F") d = c.charCodeAt(0) - "A".charCodeAt(0) + 10;
  else if (c >= "a" && c <= "f") d = c.charCodeAt(0) - "a".charCodeAt(0) + 10;
  else if (c >= "0" && c <= "9") d = c.charCodeAt(0) - "0".charCodeAt(0);

  if (typeof d === "number") return d;
  else throw new Error("The passed hex char is not a valid hex char");
}

// set strict as true: if the length of str is odd, add 0 before the str to make its length as even
export function hexStr2byteArray(str: string, strict = false) {
  if (typeof str !== "string")
    throw new Error("The passed string is not a string");

  let len = str.length;

  if (strict) {
    if (len % 2) {
      str = `0${str}`;
      len++;
    }
  }
  const byteArray = [];
  let d = 0;
  let j = 0;
  let k = 0;

  for (let i = 0; i < len; i++) {
    const c = str.charAt(i);

    if (isHexChar(c)) {
      d <<= 4;
      d += hexChar2byte(c);
      j++;

      if (0 === j % 2) {
        byteArray[k++] = d;
        d = 0;
      }
    } else throw new Error("The passed hex char is not a valid hex string");
  }

  return byteArray;
}

//////////////////// provider

const utils = {
  isValidURL(url: string) {
    if (typeof url !== "string") return false;
    return validator.isURL(url.toString(), {
      protocols: ["http", "https"],
      require_tld: false,
    });
  },

  isObject(obj: any) {
    return (
      obj === Object(obj) &&
      Object.prototype.toString.call(obj) !== "[object Array]"
    );
  },

  isArray(array: any) {
    return Array.isArray(array);
  },

  isJson(string: any) {
    try {
      return !!JSON.parse(string);
    } catch (ex) {
      return false;
    }
  },

  isBoolean(bool: any) {
    return typeof bool === "boolean";
  },

  isString(string: any) {
    return (
      typeof string === "string" ||
      (string && string.constructor && string.constructor.name === "String")
    );
  },

  isFunction(obj: any) {
    return typeof obj === "function";
  },

  isHex(string: any) {
    return (
      typeof string === "string" &&
      !isNaN(parseInt(string, 16)) &&
      /^(0x|)[a-fA-F0-9]+$/.test(string)
    );
  },

  isInteger(number: any) {
    if (number === null) return false;
    return Number.isInteger(Number(number));
  },

  hasProperty(obj: any, property: string) {
    return Object.prototype.hasOwnProperty.call(obj, property);
  },

  hasProperties(obj: any, ...properties: string[]) {
    return (
      properties.length &&
      !properties
        .map((property) => {
          return this.hasProperty(obj, property);
        })
        .includes(false)
    );
  },
};

export class HttpProvider {
  protected host: string;
  protected instance: AxiosInstance;

  constructor(
    host: string,
    protected timeout = 30000,
    protected user = false,
    protected password = false,
    protected headers = {},
    protected statusPage = "/"
  ) {
    if (!utils.isValidURL(host))
      throw new Error("Invalid URL provided to HttpProvider");

    if (isNaN(timeout) || timeout < 0)
      throw new Error("Invalid timeout duration provided");

    if (!utils.isObject(headers))
      throw new Error("Invalid headers object provided");

    host = host.replace(/\/+$/, "");

    this.host = host;

    this.instance = axios.create({
      baseURL: host,
      timeout: timeout,
      headers: headers,
    });
  }

  setStatusPage(statusPage = "/") {
    this.statusPage = statusPage;
  }

  async isConnected(statusPage = this.statusPage) {
    return this.request(statusPage)
      .then((data) => {
        return utils.hasProperties(data, "blockID", "block_header");
      })
      .catch(() => false);
  }

  request(url: string, payload = {}, method = "get") {
    method = method.toLowerCase();

    return this.instance
      .request({
        data: method == "post" && Object.keys(payload).length ? payload : null,
        params: method == "get" && payload,
        url,
        method,
      })
      .then(({ data }) => data);
  }
}

export function getTransactionInfo(node: HttpProvider, transactionID: string) {
  return node.request(
    `walletsolidity/gettransactioninfobyid`,
    {
      value: transactionID,
    },
    "post"
  );
}

export function toUtf8(hex: string) {
  if (utils.isHex(hex)) {
    hex = hex.replace(/^0x/, "");
    return Buffer.from(hex, "hex").toString("utf8");
  } else {
    throw new Error("The passed value is not a valid hex string");
  }
}

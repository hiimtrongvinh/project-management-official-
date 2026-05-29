/**
 * Helper to convert numeric amount to Vietnamese and English words.
 */

function readGroup3(group, showZeroHundred) {
    const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    let hundred = Math.floor(group / 100);
    let ten = Math.floor((group % 100) / 10);
    let unit = group % 10;
    let res = "";

    if (hundred > 0 || showZeroHundred) {
        res += units[hundred] + " trăm ";
    }

    if (ten > 0) {
        if (ten === 1) {
            res += "mười ";
        } else {
            res += units[ten] + " mươi ";
        }
    } else if (hundred > 0 && unit > 0) {
        res += "linh ";
    }

    if (unit > 0) {
        if (unit === 1 && ten > 1) {
            res += "mốt";
        } else if (unit === 5 && ten > 0) {
            res += "lăm";
        } else {
            res += units[unit];
        }
    }
    return res.trim();
}

function convertVNDToWords(amount) {
    if (amount === 0) return "Không đồng";
    
    const units = ["", " nghìn", " triệu", " tỷ"];
    let str = "";
    let temp = Math.round(amount);
    let groups = [];
    
    while (temp > 0) {
        groups.push(temp % 1000);
        temp = Math.floor(temp / 1000);
    }
    
    for (let i = groups.length - 1; i >= 0; i--) {
        let group = groups[i];
        if (group === 0) continue;
        
        let showZeroHundred = (i < groups.length - 1);
        let groupStr = readGroup3(group, showZeroHundred);
        
        let unitIdx = i % 4;
        let suffix = units[unitIdx];
        
        if (i >= 4) {
            let cycles = Math.floor(i / 3);
            for(let c = 0; c < cycles; c++) suffix += " tỷ";
        }
        
        str += groupStr + suffix + " ";
    }
    
    str = str.trim();
    if (str.length > 0) {
        str = str.charAt(0).toUpperCase() + str.slice(1) + " đồng";
    }
    return str.replace(/\s+/g, ' ');
}

const englishUnits = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const englishTeens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const englishTens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const englishScales = ["", "thousand", "million", "billion"];

function readGroup3En(group) {
    let hundred = Math.floor(group / 100);
    let ten = Math.floor((group % 100) / 10);
    let unit = group % 10;
    let res = "";

    if (hundred > 0) {
        res += englishUnits[hundred] + " hundred";
        if (ten > 0 || unit > 0) {
            res += " and ";
        }
    }

    if (ten > 0) {
        if (ten === 1) {
            res += englishTeens[unit];
            return res.trim();
        } else {
            res += englishTens[ten];
            if (unit > 0) res += "-" + englishUnits[unit];
        }
    } else if (unit > 0) {
        res += englishUnits[unit];
    }
    return res.trim();
}

function convertVNDToWordsEn(amount) {
    if (amount === 0) return "Zero";
    let temp = Math.round(amount);
    let groups = [];
    while (temp > 0) {
        groups.push(temp % 1000);
        temp = Math.floor(temp / 1000);
    }
    let str = "";
    for (let i = groups.length - 1; i >= 0; i--) {
        let group = groups[i];
        if (group === 0) continue;
        let groupStr = readGroup3En(group);
        let suffix = englishScales[i];
        str += groupStr + (suffix ? " " + suffix : "") + ", ";
    }
    str = str.trim();
    if (str.endsWith(",")) str = str.slice(0, -1);
    
    if (str.length > 0) {
        str = str.charAt(0).toUpperCase() + str.slice(1) + " Vietnam Dong";
    }
    return str.replace(/\s+/g, ' ');
}

module.exports = {
    convertVNDToWords,
    convertVNDToWordsEn
};

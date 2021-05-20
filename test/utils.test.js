/*
 * @Date: 2020-08-24 09:57:54
 * @LastEditors: Neal
 * @LastEditTime: 2020-09-17 19:32:50
 * @Email: feng.chen@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
const levenshtein = require('fast-levenshtein');

console.log(levenshtein.get('back', 'book')); // 2
console.log(levenshtein.get('back', 'abcback')); // 2
console.log(levenshtein.get('back', 'backabc')); // 2
console.log(levenshtein.get('back', 'dddd')); // 2
console.log(levenshtein.get('back', 'back')); // 2

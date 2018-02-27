"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
exports.Bootstrap = (App) => {
    const a = typedi_1.default.get(App);
    console.log(a);
    if (a.start) {
        console.log('111');
        a.start().then(data => console.log(data)).catch(e => console.log(e));
    }
    else {
        throw new Error('Missing start method');
    }
    return App;
};

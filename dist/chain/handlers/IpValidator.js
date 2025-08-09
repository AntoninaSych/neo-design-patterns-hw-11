"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpValidator = void 0;
const AbstractHandler_1 = require("../AbstractHandler");
const IPv4 = /^(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})$/;
class IpValidator extends AbstractHandler_1.AbstractHandler {
    process(record) {
        const { ip } = record;
        if (typeof ip !== "string" || !IPv4.test(ip)) {
            throw new Error("Invalid ip");
        }
        return record;
    }
}
exports.IpValidator = IpValidator;

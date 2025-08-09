"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAccessLogChain = buildAccessLogChain;
const TimestampParser_1 = require("../handlers/TimestampParser");
const UserIdValidator_1 = require("../handlers/UserIdValidator");
const IpValidator_1 = require("../handlers/IpValidator");
function buildAccessLogChain() {
    // Align handler generics across the chain via a safe upcast.
    const ts = new TimestampParser_1.TimestampParser();
    const user = new UserIdValidator_1.UserIdValidator();
    const ip = new IpValidator_1.IpValidator();
    ts.setNext(user).setNext(ip);
    return ts;
}

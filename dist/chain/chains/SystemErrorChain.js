"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSystemErrorChain = buildSystemErrorChain;
const TimestampParser_1 = require("../handlers/TimestampParser");
const LevelValidator_1 = require("../handlers/LevelValidator");
const MessageTrimmer_1 = require("../handlers/MessageTrimmer");
function buildSystemErrorChain() {
    // Validate timestamp -> level -> trim message
    const ts = new TimestampParser_1.TimestampParser();
    const level = new LevelValidator_1.LevelValidator();
    const msg = new MessageTrimmer_1.MessageTrimmer();
    ts.setNext(level).setNext(msg);
    return ts;
}

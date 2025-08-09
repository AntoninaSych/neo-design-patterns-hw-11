"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractHandler = void 0;
class AbstractHandler {
    constructor() {
        this.next = null;
    }
    setNext(handler) {
        this.next = handler;
        return handler;
    }
    handle(record) {
        const processed = this.process(record);
        if (this.next) {
            return this.next.handle(processed);
        }
        return processed;
    }
}
exports.AbstractHandler = AbstractHandler;

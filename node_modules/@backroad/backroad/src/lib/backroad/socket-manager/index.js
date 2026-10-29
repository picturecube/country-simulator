"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const sessionToSocketMapping = {};
class SocketManager {
    static getSocket(sessionId) {
        if (sessionId in sessionToSocketMapping)
            return sessionToSocketMapping[sessionId];
        else
            throw new Error(`No socket found for session ${sessionId}`);
    }
    static register(sessionId, socket) {
        sessionToSocketMapping[sessionId] = socket;
    }
}
exports.SocketManager = SocketManager;
//# sourceMappingURL=index.js.map
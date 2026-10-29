import type { ServerSocketType } from '@backroad/core';
export declare class SocketManager {
    static getSocket(sessionId: string): ServerSocketType;
    static register(sessionId: string, socket: ServerSocketType): void;
}

import { Resolve } from './DavinciResolve';

export namespace ResolveWorkerHandler {
    let _worker = new Worker('../src/Lib/ResolveWebWorker.js');

    export function Init() {
        _worker.postMessage({ type: MessageType.Resolve, data: Resolve });
    }

    export function ResolveWorkerHandler() {
        _worker.postMessage('Hello World');
    }
}

export const MessageType = {
    Resolve: 'Resolve',
} as const;

export type Message = {
    type: typeof MessageType[keyof typeof MessageType];
    data: any;
}
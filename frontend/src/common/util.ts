
export function sleep(ms: number): Promise<void> {
    // msミリ秒後に解決されるPromiseを返す
    return new Promise(resolve => setTimeout(resolve, ms));
}
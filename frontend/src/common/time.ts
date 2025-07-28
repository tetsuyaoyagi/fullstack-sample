
export function toTimestampFormat(time: Date): string{
    const year = time.getFullYear();
    const month = (time.getMonth() + 1).toString().padStart(2, '0'); //NOTE:getMonth()は0から11までの値を返すため、1を加える
    const day = time.getDate().toString().padStart(2, '0');
    const hours = time.getHours().toString().padStart(2, '0');
    const minites = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minites}:${seconds}`;
}

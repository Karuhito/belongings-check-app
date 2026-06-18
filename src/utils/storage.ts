// localStorage への保存を共通化するヘルパー
// 容量超過(QuotaExceededError)やプライベートブラウジングなどで
// setItem が例外を投げても、呼び出し側で成否を判定できるようにする

/**
 * 値を JSON 文字列化して localStorage に保存する。
 * @returns 保存に成功したら true、例外が発生したら false
 */
export function saveToStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`localStorage への保存に失敗しました (key: ${key})`, e);
    return false;
  }
}
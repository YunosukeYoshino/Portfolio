# Universal Code Review Guidelines

> Geminiの標準レビュー（正確性・効率性・保守性・セキュリティ）を補完する、
> 言語・フレームワーク非依存のコードレビュー原則
>
> 基盤: リーダブルコード + クリーンコード + SOLID原則

---

## 📢 レビューコメントの言語設定

**すべてのコードレビューコメントは日本語で記述してください。**

- 指摘内容は具体的で分かりやすい日本語で説明する
- 改善提案には「なぜそうすべきか」の理由を含める
- コード例は英語のままでOK（変数名・関数名）
- 技術用語は適切に日本語化（例: "magic number" → "マジックナンバー"）

**コメント例:**

```
❌ 悪い例:
This function has too many responsibilities. Consider splitting it.

✅ 良い例:
この関数は複数の責任を持っています。単一責任原則に従い、
バリデーション・データベース更新・メール送信をそれぞれ別の関数に分割することを推奨します。
```

---

## 🔴 Security First (CRITICAL)

【重要度: CRITICAL】

### ❌ 絶対に指摘すべき問題

```
❌ 悪い例:
const API_KEY = "sk-1234567890abcdef"; // ハードコード
const query = `SELECT * FROM users WHERE id = ${userId}`; // SQLインジェクション
```

```
✅ 良い例:
const API_KEY = process.env.API_KEY; // 環境変数
const query = db.prepare("SELECT * FROM users WHERE id = ?").bind(userId); // パラメータ化
```

**レビューポイント:**
- APIキー、パスワード、トークンのハードコード
- 未検証のユーザー入力（SQLインジェクション、XSS）
- エラーメッセージでの内部情報漏洩（スタックトレース、ファイルパス）
- 認証・認可のバイパス可能性

---

## 🟡 Readability & Clean Code (HIGH)

【重要度: HIGH】

### 1. 意図を伝える命名

```
❌ 悪い例:
const d = new Date(); // dって何？
const tmp = data.filter(x => x.active); // tmpは一時変数？
function proc(x) { ... } // procって何をする？
```

```
✅ 良い例:
const currentDate = new Date();
const activeUsers = data.filter(user => user.active);
function calculateTotalPrice(items) { ... }
```

**レビューポイント:**
- 変数名が意図を表現しているか
- 1文字変数（ループカウンタ以外）
- 省略しすぎた名前（`calc`, `proc`, `tmp`）
- 型情報を名前に含める必要性（`userArray` → `users`）

### 2. 関数は小さく、1つのことだけ

```
❌ 悪い例:
function handleUserData(user) {
  // バリデーション
  if (!user.email) throw new Error("email required");

  // データベース更新
  db.update("users", user);

  // メール送信
  sendEmail(user.email, "Welcome!");

  // ログ記録
  logger.info(`User ${user.id} updated`);
}
```

```
✅ 良い例:
function handleUserData(user) {
  validateUser(user);
  updateUserInDatabase(user);
  sendWelcomeEmail(user);
  logUserUpdate(user);
}
```

**レビューポイント:**
- 関数が50行を超えている
- 複数の責任を持っている（単一責任原則違反）
- 関数名と実装が一致していない
- 副作用が隠れている（関数名から予測できない変更）

### 3. ネストは浅く

```
❌ 悪い例:
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      if (user.subscription) {
        // 深すぎる...
      }
    }
  }
}
```

```
✅ 良い例:
if (!user) return;
if (!user.isActive) return;
if (!user.hasPermission) return;
if (!user.subscription) return;

// フラットなロジック
```

**レビューポイント:**
- ネストが3階層を超えている
- 早期リターン（ガード節）で改善できる
- 条件ロジックを関数に抽出できる

### 4. マジックナンバー・マジックストリング

```
❌ 悪い例:
if (status === 1) { ... } // 1って何？
setTimeout(callback, 86400000); // この数字は？
```

```
✅ 良い例:
const STATUS_ACTIVE = 1;
if (status === STATUS_ACTIVE) { ... }

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
setTimeout(callback, ONE_DAY_MS);
```

**レビューポイント:**
- 意味不明な数値リテラル
- 複数箇所で使われる定数が定義されていない
- ビジネスルールが数値として埋め込まれている

---

## 🟡 品質保証（HIGH）

【重要度: HIGH】

> "テストのないコードはレガシーコード" - Michael Feathers

### 1. テストの存在と実行

```
❌ 悪い例:
function calculateDiscount(price, coupon) {
  return price * (1 - coupon); // テストが存在しない
}
```

```
✅ 良い例:
function calculateDiscount(price, coupon) {
  if (typeof price !== 'number' || typeof coupon !== 'number') {
    throw new Error('Invalid input');
  }
  return price * (1 - coupon);
}

// test/calculateDiscount.test.js
describe('calculateDiscount', () => {
  it('正常系: 10%割引を正しく計算', () => {
    expect(calculateDiscount(1000, 0.1)).toBe(900);
  });

  it('境界値: ゼロ価格', () => {
    expect(calculateDiscount(0, 0.1)).toBe(0);
  });

  it('境界値: クーポンなし', () => {
    expect(calculateDiscount(1000, 0)).toBe(1000);
  });

  it('境界値: 100%割引', () => {
    expect(calculateDiscount(1000, 1)).toBe(0);
  });

  it('異常系: 無効な入力', () => {
    expect(() => calculateDiscount('abc', 0.1)).toThrow();
  });
});
```

**レビューポイント:**
- 主要な関数・クラスにユニットテストが存在するか
- 正常系だけでなく異常系のテストがあるか
- エッジケース（null、undefined、空配列、境界値）がカバーされているか
- CI/CDでテストが自動実行されているか
- コミット前に `bun test` を実行しているか
- テストが最新のコードに対して通過しているか

### 2. 実装と仕様の一致

```
❌ 悪い例:
// 要件: ユーザーが18歳以上であることを確認
function checkAge(age) {
  return age > 17; // 境界値が曖昧（17.5歳は？）
}
```

```
✅ 良い例:
// 受入基準: age >= 18 で true を返す（小数点は切り捨て）
function isAdult(age) {
  if (typeof age !== 'number' || age < 0) {
    return false;
  }
  return Math.floor(age) >= 18;
}

// test
it('受入基準: 18歳ちょうどは成人', () => {
  expect(isAdult(18)).toBe(true);
});

it('受入基準: 17.9歳は未成年', () => {
  expect(isAdult(17.9)).toBe(false);
});

it('受入基準: 18.1歳は成人', () => {
  expect(isAdult(18.1)).toBe(true);
});
```

**レビューポイント:**
- 要件定義（Issue、仕様書、PRD）と実装が一致しているか
- 受入基準が明確で検証可能か
- 境界値の扱いが仕様通りか（以上/超える、以下/未満の区別）
- 必須機能がすべて実装されているか
- ビジネスルールが正確にコード化されているか

### 3. 境界値と異常系の処理

```
❌ 悪い例:
function getFirstUser(users) {
  return users[0].name; // usersがnull/空配列でクラッシュ
}

function divide(a, b) {
  return a / b; // ゼロ除算でInfinity
}
```

```
✅ 良い例:
function getFirstUser(users) {
  if (!Array.isArray(users) || users.length === 0) {
    return null;
  }
  return users[0]?.name ?? 'Unknown';
}

function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('引数は数値である必要があります');
  }
  if (b === 0) {
    throw new Error('ゼロ除算はできません');
  }
  return a / b;
}
```

**レビューポイント:**
- null/undefined の処理が適切か
- 空配列・空オブジェクト・空文字列の処理
- 境界値（0、最大値、最小値、負の数）の処理
- 型の不一致への対応（防御的プログラミング）
- ゼロ除算、配列外アクセス、オーバーフローなどの防止
- 想定外の入力に対するガード節の設置

---

## 🟢 Best Practices (MEDIUM)

【重要度: MEDIUM】

### 1. コメントの質

```
❌ 悪いコメント（何をするか）:
// iを1増やす
i++;

// ユーザーをループ
for (const user of users) { ... }
```

```
✅ 良いコメント（なぜそうするか）:
// APIレート制限対応のため1秒待機
await sleep(1000);

// レガシーシステムとの互換性のため日付をUTCに変換
const utcDate = convertToUTC(date);
```

**レビューポイント:**
- コードを読めばわかることをコメントしている
- 複雑なロジックに「なぜ」の説明がない
- コメントアウトされたコードが残っている
- TODOコメントが放置されている

### 2. エラーハンドリング

```
❌ 悪い例:
try {
  await fetchData();
} catch (e) {
  console.log(e); // ログ出力だけ
}

try {
  await processPayment();
} catch {
  // エラー無視
}
```

```
✅ 良い例:
try {
  await fetchData();
} catch (error) {
  logger.error("Failed to fetch data", { error, context });
  throw new DataFetchError("Data retrieval failed", { cause: error });
}
```

**レビューポイント:**
- エラーを握りつぶしている（catch後に何もしない）
- エラー情報が失われている（再スロー時）
- ユーザーに内部エラー詳細を返している
- 回復可能なエラーと致命的なエラーの区別がない

### 3. DRY原則（Don't Repeat Yourself）

```
❌ 悪い例:
const userEmail = user.email?.toLowerCase().trim();
const adminEmail = admin.email?.toLowerCase().trim();
const supportEmail = support.email?.toLowerCase().trim();
```

```
✅ 良い例:
function normalizeEmail(email) {
  return email?.toLowerCase().trim();
}

const userEmail = normalizeEmail(user.email);
const adminEmail = normalizeEmail(admin.email);
const supportEmail = normalizeEmail(support.email);
```

**レビューポイント:**
- 同じロジックが3回以上出現
- コピペコード（変数名だけ違う）
- 抽象化可能なパターンの重複

### 4. 型安全性（型システムがある言語）

```
❌ 悪い例（TypeScript）:
function process(data: any) { ... } // anyは型安全性を破壊
const result = JSON.parse(response) as User; // 無検証の型アサーション
```

```
✅ 良い例:
function process(data: User) { ... }

function parseUser(response: string): User {
  const parsed = JSON.parse(response);
  return UserSchema.parse(parsed); // ランタイムバリデーション
}
```

**レビューポイント:**
- `any`型の使用（TypeScript/型付き言語）
- unknown型、型アサーション（`as`）の乱用
- 型ガードなしのナローイング
- ランタイム検証の欠如

---

## 🎯 SOLID原則の適用

【重要度: MEDIUM】

### S - 単一責任原則（Single Responsibility）
クラス/関数は1つの責任のみを持つ

### O - 開放閉鎖原則（Open/Closed）
拡張に対して開いていて、修正に対して閉じている

### L - リスコフの置換原則（Liskov Substitution）
派生クラスは基底クラスと置換可能

### I - インターフェース分離原則（Interface Segregation）
使わないメソッドへの依存を強制しない

### D - 依存性逆転原則（Dependency Inversion）
具象ではなく抽象に依存する

**レビューポイント:**
- 巨大なクラス/関数（God Object）
- ハードコードされた依存関係
- 継承の誤用（is-a関係でないのに継承）

---

## 🧪 テスタビリティ

【重要度: MEDIUM】

```
❌ テストしにくい例:
function processOrder() {
  const now = new Date(); // 現在時刻に依存
  const user = fetchCurrentUser(); // グローバル状態
  database.save(order); // 外部依存の直接呼び出し
}
```

```
✅ テストしやすい例:
function processOrder(order, currentTime, user, database) {
  // 依存性が外部から注入される
  database.save({ ...order, processedAt: currentTime });
}
```

**レビューポイント:**
- グローバル状態への依存
- 時刻・乱数への直接依存
- ハードコードされた外部サービス呼び出し
- 副作用が分離されていない

---

## ⚡ パフォーマンス（必要な場合のみ）

【重要度: LOW - ただし計測結果がある場合はHIGH】

**早すぎる最適化は諸悪の根源** - まず動くコード、次に正しいコード、最後に速いコード

```
⚠️ 指摘すべき明らかなパフォーマンス問題:
- ループ内での不要なAPI呼び出し
- O(n²)以上のアルゴリズム（大量データ処理時）
- メモリリーク（イベントリスナーの未解放）
- 不要な再レンダリング（フロントエンド）
```

**レビューポイント:**
- ループ内でのネットワーク/DB呼び出し
- 不要な配列コピー・変換のチェーン
- キャッシュ可能な計算の繰り返し
- ただし、**計測データなしのパフォーマンス指摘は避ける**

---

## 📋 レビューチェックリスト

コードレビュー時にこの順序で確認：

### 1️⃣ セキュリティ（最優先）
- [ ] シークレット漏洩なし
- [ ] 入力検証あり
- [ ] エラー情報漏洩なし

### 2️⃣ 可読性
- [ ] 意図が伝わる命名
- [ ] 適切な関数サイズ
- [ ] 浅いネスト

### 3️⃣ 品質保証
- [ ] テストが存在し、通過している
- [ ] 実装が仕様・受入基準と一致
- [ ] 境界値・異常系が処理されている

### 4️⃣ 保守性
- [ ] 単一責任
- [ ] DRY原則
- [ ] 適切なエラーハンドリング

### 5️⃣ その他品質
- [ ] 型安全性（該当言語）
- [ ] テスタビリティ
- [ ] ドキュメント

---

## 🎓 参考文献

- **リーダブルコード** - Dustin Boswell, Trevor Foucher
- **Clean Code** - Robert C. Martin
- **リファクタリング** - Martin Fowler
- **OWASP Top 10** - https://owasp.org/www-project-top-ten/

---

## 💡 レビューの心構え

1. **理解しやすさ > 賢さ** - clever code より clear code
2. **コードは書く時間より読む時間が長い** - 読み手に優しく
3. **ボーイスカウトルール** - 来た時よりきれいに
4. **早すぎる最適化は悪** - まず動作、次に正確性、最後に速度
5. **完璧を求めすぎない** - 改善は継続的に

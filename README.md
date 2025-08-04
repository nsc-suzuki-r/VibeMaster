# ライブコーディング・ロードマップ

ライブコーディングスキル向上のための7レベル管理システムとスケジューリング機能を持つ個人用Web管理アプリケーションです。

## 概要

このアプリケーションは、プログラミング初心者から上級者まで段階的にスキルアップできるように設計された学習管理システムです。7つのレベルに分かれており、各レベルでチェックボックス形式でタスクの完了状況を管理できます。また、週次・月次のスケジュール管理機能と学習メモ機能も搭載しています。

## 主な機能

### ✅ 7段階のレベルシステム
1. **1枚ページの作成** - HTML/CSSでシンプルなウェブページを作成
2. **オフィスツールの自動化** - PythonでExcelやPDF処理を自動化
3. **Webサービス開発** - JavaScriptでWebアプリケーションを開発
4. **自分PCで独自プログラム** - デスクトップアプリケーションの開発
5. **開発環境とWebサービスを連携** - API連携とクラウドサービス活用
6. **コードをGit管理** - バージョン管理とチーム開発
7. **Copilot & コーディングエージェント活用** - AI支援によるコーディング効率化

### 📋 タスク管理
- 各レベルごとに具体的なタスクを設定
- チェックボックスで完了状況を管理
- リアルタイムでの進捗更新

### 📅 スケジュール管理
- 週次・月次の目標設定
- カレンダー表示での予定確認
- 期限管理とステータス表示

### 📝 学習メモ機能
- 学習内容の記録
- レベル別のメモ管理
- 振り返り用の履歴保存

### 📊 進捗可視化
- 全体進捗の円グラフ表示
- レベル別進捗バー
- 学習継続日数の追跡

## 技術スタック

### フロントエンド
- **React 18** with TypeScript
- **Vite** - 高速なビルドツール
- **Tailwind CSS** - ユーティリティファーストCSS
- **shadcn/ui** - モダンなコンポーネントライブラリ
- **TanStack Query** - サーバーステート管理
- **Wouter** - 軽量ルーティング
- **React Hook Form** + **Zod** - フォーム管理と検証

### バックエンド
- **Node.js** + **Express.js**
- **TypeScript** - 型安全な開発
- **Drizzle ORM** - データベースアクセス
- **PostgreSQL** - リレーショナルデータベース
- インメモリストレージ（開発用）

### UI/UX
- **Radix UI** - アクセシブルなプリミティブコンポーネント
- **Lucide React** - 一貫したアイコンライブラリ
- **Framer Motion** - スムーズなアニメーション
- レスポンシブデザイン対応

## セットアップ

### 必要な環境
- Node.js 20.x以上
- npm または yarn

### インストール手順

1. リポジトリをクローン
```bash
git clone [repository-url]
cd live-coding-roadmap
```

2. 依存関係をインストール
```bash
npm install
```

3. 開発サーバーを起動
```bash
npm run dev
```

4. ブラウザで http://localhost:5000 にアクセス

## 使い方

### 基本的な使い方

1. **ダッシュボード**でレベル一覧と全体進捗を確認
2. **レベルカード**をクリックしてタスク詳細を表示
3. **チェックボックス**をクリックしてタスク完了をマーク
4. **週間目標**で短期的な目標を設定
5. **学習メモ**で気づきや学習内容を記録

### 進捗管理のコツ

- 毎日少しずつでもタスクを進める
- 週間目標を現実的な範囲で設定する
- 学習メモで振り返りを習慣化する
- レベル完了時に次のレベルの計画を立てる

## プロジェクト構造

```
├── client/                 # フロントエンドコード
│   ├── src/
│   │   ├── components/     # UIコンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   └── lib/           # ユーティリティ
├── server/                # バックエンドコード
│   ├── index.ts          # サーバーエントリーポイント
│   ├── routes.ts         # APIルート定義
│   └── storage.ts        # データストレージ
├── shared/               # 共通型定義
│   └── schema.ts        # データベーススキーマ
└── README.md
```

## API エンドポイント

### レベル管理
- `GET /api/levels` - レベル一覧取得
- `GET /api/levels/:id` - レベル詳細取得

### タスク管理
- `GET /api/tasks` - タスク一覧取得
- `POST /api/tasks` - タスク作成
- `PATCH /api/tasks/:id` - タスク更新
- `DELETE /api/tasks/:id` - タスク削除

### スケジュール管理
- `GET /api/schedules` - スケジュール一覧取得
- `POST /api/schedules` - スケジュール作成
- `PATCH /api/schedules/:id` - スケジュール更新
- `DELETE /api/schedules/:id` - スケジュール削除

### 学習メモ
- `GET /api/learning-notes` - メモ一覧取得
- `POST /api/learning-notes` - メモ作成
- `PATCH /api/learning-notes/:id` - メモ更新
- `DELETE /api/learning-notes/:id` - メモ削除

### ユーザー統計
- `GET /api/user-stats` - 統計情報取得
- `PATCH /api/user-stats` - 統計情報更新

## カスタマイズ

### レベル・タスクの追加

`server/storage.ts`の`initializeDefaultData()`メソッドでレベルとタスクをカスタマイズできます。

### スタイルの変更

`client/src/index.css`でカラーテーマや`tailwind.config.ts`でTailwindの設定を変更できます。

## 貢献

1. フォークする
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 今後の予定

- [ ] データベース永続化の実装
- [ ] ユーザー認証システム
- [ ] 学習統計の詳細分析
- [ ] エクスポート/インポート機能
- [ ] モバイルアプリ版の開発
- [ ] 多言語対応

---

**Happy Learning & Coding! 🚀**
import { 
  type Level, type Task, type Schedule, type LearningNote, type UserStats,
  type InsertLevel, type InsertTask, type InsertSchedule, type InsertLearningNote, type InsertUserStats
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Levels
  getLevels(): Promise<Level[]>;
  getLevel(id: string): Promise<Level | undefined>;
  createLevel(level: InsertLevel): Promise<Level>;
  updateLevel(id: string, level: Partial<Level>): Promise<Level | undefined>;
  deleteLevel(id: string): Promise<boolean>;

  // Tasks
  getTasks(): Promise<Task[]>;
  getTasksByLevel(levelId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // Schedules
  getSchedules(): Promise<Schedule[]>;
  getSchedulesByDateRange(startDate: Date, endDate: Date): Promise<Schedule[]>;
  getSchedule(id: string): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: string, schedule: Partial<Schedule>): Promise<Schedule | undefined>;
  deleteSchedule(id: string): Promise<boolean>;

  // Learning Notes
  getLearningNotes(): Promise<LearningNote[]>;
  getLearningNote(id: string): Promise<LearningNote | undefined>;
  createLearningNote(note: InsertLearningNote): Promise<LearningNote>;
  updateLearningNote(id: string, note: Partial<LearningNote>): Promise<LearningNote | undefined>;
  deleteLearningNote(id: string): Promise<boolean>;

  // User Stats
  getUserStats(): Promise<UserStats | undefined>;
  updateUserStats(stats: Partial<UserStats>): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private levels: Map<string, Level> = new Map();
  private tasks: Map<string, Task> = new Map();
  private schedules: Map<string, Schedule> = new Map();
  private learningNotes: Map<string, LearningNote> = new Map();
  private userStats: UserStats | undefined;

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize 7 levels with Japanese titles
    const defaultLevels = [
      { levelNumber: 1, title: "1枚ページの作成", color: "success", description: "HTML/CSSでシンプルなウェブページを作成" },
      { levelNumber: 2, title: "オフィスツールの自動化", color: "secondary", description: "PythonでExcelやPDF処理を自動化" },
      { levelNumber: 3, title: "Webサービス開発", color: "primary", description: "JavaScriptでWebアプリケーションを開発" },
      { levelNumber: 4, title: "自分PCで独自プログラム", color: "accent", description: "デスクトップアプリケーションの開発" },
      { levelNumber: 5, title: "開発環境とWebサービスを連携", color: "warning", description: "API連携とクラウドサービス活用" },
      { levelNumber: 6, title: "コードをGit管理", color: "danger", description: "バージョン管理とチーム開発" },
      { levelNumber: 7, title: "Copilot & コーディングエージェント活用", color: "purple", description: "AI支援によるコーディング効率化" }
    ];

    defaultLevels.forEach((levelData, index) => {
      const level: Level = {
        id: randomUUID(),
        ...levelData,
        isCompleted: false,
        progress: 0,
        createdAt: new Date(),
      };
      this.levels.set(level.id, level);

      // Add tasks for each level
      this.addDefaultTasks(level.id, index + 1);
    });

    // Initialize user stats
    this.userStats = {
      id: randomUUID(),
      streakDays: 0,
      lastActivityDate: new Date(),
      totalTasksCompleted: 0,
      overallProgress: 0,
      updatedAt: new Date(),
    };
  }

  private addDefaultTasks(levelId: string, levelNumber: number) {
    const tasksByLevel = {
      1: [
        "HTML基本構造の理解",
        "CSS基本スタイリング",
        "レスポンシブデザインの実装"
      ],
      2: [
        "Python基礎学習",
        "Excel自動化スクリプト作成",
        "PDFファイル処理自動化",
        "メール送信自動化",
        "データ収集・分析自動化"
      ],
      3: [
        "JavaScript基礎学習",
        "Node.js環境構築",
        "データベース設計・接続",
        "API開発",
        "フロントエンド統合"
      ],
      4: [
        "デスクトップアプリ開発環境構築",
        "GUI フレームワーク学習",
        "ファイルシステム操作",
        "外部ライブラリ活用",
        "アプリケーション配布"
      ],
      5: [
        "クラウドサービス基礎",
        "API設計・実装",
        "認証・認可システム",
        "データベース連携",
        "デプロイメント自動化"
      ],
      6: [
        "Git基本操作",
        "ブランチ戦略",
        "コードレビュー",
        "CI/CD構築",
        "チーム開発フロー"
      ],
      7: [
        "GitHub Copilot活用",
        "コード生成AI活用",
        "プロンプトエンジニアリング",
        "AI支援デバッグ",
        "効率的な開発フロー確立"
      ]
    };

    const levelTasks = tasksByLevel[levelNumber as keyof typeof tasksByLevel] || [];
    
    levelTasks.forEach((title, index) => {
      const task: Task = {
        id: randomUUID(),
        levelId,
        title,
        description: "",
        isCompleted: false,
        order: index,
        createdAt: new Date(),
      };
      this.tasks.set(task.id, task);
    });
  }

  // Level methods
  async getLevels(): Promise<Level[]> {
    return Array.from(this.levels.values()).sort((a, b) => a.levelNumber - b.levelNumber);
  }

  async getLevel(id: string): Promise<Level | undefined> {
    return this.levels.get(id);
  }

  async createLevel(insertLevel: InsertLevel): Promise<Level> {
    const level: Level = {
      id: randomUUID(),
      ...insertLevel,
      createdAt: new Date(),
    };
    this.levels.set(level.id, level);
    return level;
  }

  async updateLevel(id: string, updates: Partial<Level>): Promise<Level | undefined> {
    const level = this.levels.get(id);
    if (!level) return undefined;
    
    const updatedLevel = { ...level, ...updates };
    this.levels.set(id, updatedLevel);
    return updatedLevel;
  }

  async deleteLevel(id: string): Promise<boolean> {
    return this.levels.delete(id);
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => a.order - b.order);
  }

  async getTasksByLevel(levelId: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.levelId === levelId)
      .sort((a, b) => a.order - b.order);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const task: Task = {
      id: randomUUID(),
      ...insertTask,
      createdAt: new Date(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    
    // Update level progress when task is completed
    if ('isCompleted' in updates) {
      await this.updateLevelProgress(task.levelId);
    }
    
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  private async updateLevelProgress(levelId: string) {
    const levelTasks = await this.getTasksByLevel(levelId);
    const completedTasks = levelTasks.filter(task => task.isCompleted);
    const progress = levelTasks.length > 0 ? Math.round((completedTasks.length / levelTasks.length) * 100) : 0;
    
    await this.updateLevel(levelId, { 
      progress,
      isCompleted: progress === 100
    });
  }

  // Schedule methods
  async getSchedules(): Promise<Schedule[]> {
    return Array.from(this.schedules.values()).sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());
  }

  async getSchedulesByDateRange(startDate: Date, endDate: Date): Promise<Schedule[]> {
    return Array.from(this.schedules.values())
      .filter(schedule => schedule.targetDate >= startDate && schedule.targetDate <= endDate)
      .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());
  }

  async getSchedule(id: string): Promise<Schedule | undefined> {
    return this.schedules.get(id);
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const schedule: Schedule = {
      id: randomUUID(),
      ...insertSchedule,
      createdAt: new Date(),
    };
    this.schedules.set(schedule.id, schedule);
    return schedule;
  }

  async updateSchedule(id: string, updates: Partial<Schedule>): Promise<Schedule | undefined> {
    const schedule = this.schedules.get(id);
    if (!schedule) return undefined;
    
    const updatedSchedule = { ...schedule, ...updates };
    this.schedules.set(id, updatedSchedule);
    return updatedSchedule;
  }

  async deleteSchedule(id: string): Promise<boolean> {
    return this.schedules.delete(id);
  }

  // Learning Notes methods
  async getLearningNotes(): Promise<LearningNote[]> {
    return Array.from(this.learningNotes.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getLearningNote(id: string): Promise<LearningNote | undefined> {
    return this.learningNotes.get(id);
  }

  async createLearningNote(insertNote: InsertLearningNote): Promise<LearningNote> {
    const note: LearningNote = {
      id: randomUUID(),
      ...insertNote,
      createdAt: new Date(),
    };
    this.learningNotes.set(note.id, note);
    return note;
  }

  async updateLearningNote(id: string, updates: Partial<LearningNote>): Promise<LearningNote | undefined> {
    const note = this.learningNotes.get(id);
    if (!note) return undefined;
    
    const updatedNote = { ...note, ...updates };
    this.learningNotes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteLearningNote(id: string): Promise<boolean> {
    return this.learningNotes.delete(id);
  }

  // User Stats methods
  async getUserStats(): Promise<UserStats | undefined> {
    return this.userStats;
  }

  async updateUserStats(updates: Partial<UserStats>): Promise<UserStats> {
    if (!this.userStats) {
      this.userStats = {
        id: randomUUID(),
        streakDays: 0,
        lastActivityDate: new Date(),
        totalTasksCompleted: 0,
        overallProgress: 0,
        updatedAt: new Date(),
      };
    }
    
    this.userStats = { ...this.userStats, ...updates, updatedAt: new Date() };
    return this.userStats;
  }
}

export const storage = new MemStorage();

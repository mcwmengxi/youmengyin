# 实现并发任务控制器

`npx tsx superTask.ts` 运行

```tavascript
export interface Task<T> {
  task: () => Promise<T>;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

/**
 * 并发任务控制器
 */
export default class SuperTask<T> {
  private parallelCount: number; // 并发数

  private runningCount: number; // 当前正在运行的任务数

  private tasks: Task<T>[]; // 待执行的任务队列

  private allTasksCompletedResolver: (() => void) | undefined;

  private allTasksCompletedPromise: Promise<void>;

  constructor(parallelCount: number = 2) {
    this.parallelCount = parallelCount;
    this.runningCount = 0;
    this.tasks = [];
    this.allTasksCompletedResolver = undefined;
    this.allTasksCompletedPromise = new Promise<void>((resolve) => {
      this.allTasksCompletedResolver = resolve;
    });
  }

  public add(task: () => Promise<T>) {
    return new Promise((resolve, reject) => {
      this.tasks.push({ task, resolve, reject });
      this.run();
    });
  }

  private run() {
    while (this.runningCount < this.parallelCount && this.tasks.length > 0) {
      const nextTask = this.tasks.shift();
      const { task, resolve, reject } = nextTask!;
      this.runningCount++;
      task()
        .then(resolve, reject)
        .finally(() => {
          this.runningCount--;
          this.run();
          if (this.tasks.length === 0 && this.runningCount === 0) {
            this.allTasksCompletedResolver?.();
          }
        });
    }
  }

  // 等待所有任务完成
  public waitAll() {
    return this.allTasksCompletedPromise;
  }
}

function timeout(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
}

const superTask = new SuperTask();

function addTask(time: number, name: string) {
  superTask
    .add(() => timeout(time))
    .then(() => {
      console.log(`任务${name}完成`);
    });
}

addTask(10000, '1');
addTask(2000, '2');
addTask(5000, '3');
addTask(1000, '4');
addTask(7000, '5');
addTask(3000, '6');

superTask.waitAll().then(() => {
  console.log('所有任务完成');
});

```

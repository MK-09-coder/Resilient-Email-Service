export default class Queue {
  #tasks = [];
  push(task) { this.#tasks.push(task); }
  pop() { return this.#tasks.shift(); }
  get length() { return this.#tasks.length; }
}

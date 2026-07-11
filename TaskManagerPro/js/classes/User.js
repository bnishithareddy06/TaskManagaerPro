// Session 3 & 6 - User class demonstrating `this` and bind
export class User {
  constructor(name = 'Guest') {
    this.name = name;
    this.createdAt = new Date().toISOString();
  }
  greet() { return `Hi ${this.name}, ready to conquer your tasks?`; }
}

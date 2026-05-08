export class RPGEngine {
  static calculateDamage(isCorrect, currentHP) {
    if (!isCorrect) {
      return Math.max(0, currentHP - 5);
    }
    return currentHP;
  }

  static gainMana(isCorrect, currentMana) {
    if (isCorrect) {
      return Math.min(100, currentMana + 2);
    }
    return currentMana;
  }
}
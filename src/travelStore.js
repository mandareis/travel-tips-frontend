import { nanoid } from "nanoid";

export function createTravelStore() {
  return {
    tips: [],
    addTips(text) {
      this.tips.push({
        text,
        id: nanoid(),
      });
    },
    removeTips(id) {
      this.tips = this.tips.filter((tip) => tip.id !== id);
    },
  };
}

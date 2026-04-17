export const safariFunFacts = [
  "Lions can see six times better in the dark than humans, making the Serengeti nights their ultimate hunting ground.",
  "The Great Migration sees over 1.5 million wildebeest travel 1,000 miles across the Serengeti every single year.",
  "Hippos secrete a natural, red-colored fluid that acts as both a sunscreen and an antibiotic.",
  "Giraffes only need 5 to 30 minutes of sleep in a 24-hour period, often taken in quick 1-2 minute naps.",
  "The Ngorongoro Crater is the world's largest unbroken volcanic caldera and home to over 25,000 large animals.",
  "Cheetahs can accelerate from 0 to 60 mph in just 3 seconds, faster than most supercars.",
  "An elephant's trunk has around 40,000 muscles. The entire human body rests at roughly 600.",
  "Tanzania has dedicated nearly 30% of its landmass strictly to wildlife conservation and national parks.",
  "Mount Kilimanjaro has five distinct climate zones, ranging from tropical rainforests at the base to arctic conditions at the summit.",
  "A zebra's stripes are as unique as a human fingerprint; no two zebras have the exact same pattern.",
  "Leopards are incredibly strong and often drag prey twice their own weight high into the branches of Acacia trees to protect it from scavengers."
];

export function getRandomFunFact() {
  const index = Math.floor(Math.random() * safariFunFacts.length);
  return safariFunFacts[index];
}

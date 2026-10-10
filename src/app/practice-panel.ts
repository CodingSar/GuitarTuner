// Practice panel helpers: the song cards and the hit, miss and streak tally.
// Plain DOM only. Text goes in with textContent, never with markup strings.
import type { Song, Tally } from "../modules/practice";

const CARD_CLASS = "song-card";
const CHOSEN_CLASS = "chosen";

// The three readouts the tally writes into.
export interface TallyElements {
  readonly hits: HTMLElement;
  readonly missed: HTMLElement;
  readonly streak: HTMLElement;
}

// Adds one card button per song to the container. Each card shows the title and
// the tempo. A click calls onPick with the song's index. The returned function
// marks the card at that index as chosen and sets aria-pressed on every card.
export function mountSongCards(
  container: HTMLElement,
  songs: readonly Song[],
  onPick: (index: number) => void,
): (index: number) => void {
  const cards = songs.map((song, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = CARD_CLASS;
    card.setAttribute("aria-pressed", "false");

    const tempo = document.createElement("span");
    tempo.textContent = `${song.tempo} BPM`;

    card.append(song.title, tempo);
    card.addEventListener("click", () => onPick(index));
    container.append(card);
    return card;
  });

  return (index: number) => {
    cards.forEach((card, position) => {
      const chosen = position === index;
      card.classList.toggle(CHOSEN_CLASS, chosen);
      card.setAttribute("aria-pressed", chosen ? "true" : "false");
    });
  };
}

// Writes the hit, miss and streak counts into their readouts as plain numbers.
export function showTally(elements: TallyElements, tally: Tally): void {
  elements.hits.textContent = String(tally.hits);
  elements.missed.textContent = String(tally.missed);
  elements.streak.textContent = String(tally.streak);
}

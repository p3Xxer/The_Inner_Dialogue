import type { CollectionEntry } from "astro:content";

type Note = CollectionEntry<"notes">;

/**
 * Display-label overrides for topic path segments that shouldn't be
 * title-cased (acronyms, mostly). Add more as topics accumulate.
 */
export const TOPIC_LABEL_OVERRIDES: Record<string, string> = {
  dsa: "DSA",
};

/** First segment of a topic path: "dsa/graphs" → "dsa". */
export const topicParent = (topic: string): string => topic.split("/")[0];

/** Rest of a topic path after the parent, or null: "dsa/graphs" → "graphs". */
export const topicChild = (topic: string): string | null => {
  const idx = topic.indexOf("/");
  return idx === -1 ? null : topic.slice(idx + 1);
};

/** "system-design" → "System Design", "dsa" → "DSA" (via overrides). */
export const formatTopicSegment = (segment: string): string =>
  TOPIC_LABEL_OVERRIDES[segment] ??
  segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export interface TopicSubGroup {
  child: string;
  notes: Note[];
}

export interface TopicGroup {
  parent: string;
  label: string;
  /** Rolled-up count: direct notes plus every sub-group's notes. */
  count: number;
  /** Notes filed directly on the parent topic (e.g. topic: "dsa"). */
  directNotes: Note[];
  subGroups: TopicSubGroup[];
}

const noteTime = (note: Note): number =>
  new Date(note.data.modDatetime ?? note.data.pubDatetime).getTime();

/**
 * Build the ordered outline for the notes index.
 *
 * Top-level groups are ordered by their most recent note's
 * (modDatetime ?? pubDatetime) descending. Within a group: notes filed
 * directly on the parent topic first, then sub-groups — each ordered by
 * its most recent note, notes within each newest-first.
 */
export const buildTopicOutline = (notes: Note[]): TopicGroup[] => {
  const sorted = [...notes].sort((a, b) => noteTime(b) - noteTime(a));

  // Maps preserve insertion order, and we insert newest-first — so group
  // order and sub-group order both fall out of the iteration for free.
  const groups = new Map<
    string,
    { directNotes: Note[]; subGroups: Map<string, Note[]> }
  >();

  for (const note of sorted) {
    const parent = topicParent(note.data.topic);
    const child = topicChild(note.data.topic);

    let group = groups.get(parent);
    if (!group) {
      group = { directNotes: [], subGroups: new Map() };
      groups.set(parent, group);
    }

    if (child === null) {
      group.directNotes.push(note);
    } else {
      const subNotes = group.subGroups.get(child);
      if (subNotes) {
        subNotes.push(note);
      } else {
        group.subGroups.set(child, [note]);
      }
    }
  }

  return [...groups.entries()].map(([parent, group]) => {
    const subGroups = [...group.subGroups.entries()].map(([child, notes]) => ({
      child,
      notes,
    }));
    return {
      parent,
      label: formatTopicSegment(parent),
      count:
        group.directNotes.length +
        subGroups.reduce((sum, sub) => sum + sub.notes.length, 0),
      directNotes: group.directNotes,
      subGroups,
    };
  });
};

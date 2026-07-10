---
title: "Dijkstra is just BFS with a priority queue"
description: The moment weighted edges stopped being scary.
topic: dsa/graphs
pubDatetime: 2026-03-11T10:00:00Z
modDatetime: 2026-06-02T10:00:00Z
draft: true
---

It finally clicked when I stopped treating the priority queue as a clever trick and started seeing it as the whole idea. BFS explores in order of _hop count_ because a plain queue hands nodes back in the order they were discovered. Dijkstra explores in order of _total cost_ — and the only change needed to make that happen is swapping the queue for a min-heap keyed on distance.

Everything else is the same loop: pop the closest frontier node, relax its edges, push anything that got closer. If every edge has weight 1, the heap degenerates into FIFO order and you are literally running BFS again.

```text
BFS:       queue.pop()      → nearest by hops
Dijkstra:  heap.pop_min()   → nearest by cost
```

The part that used to trip me up — why can't Dijkstra handle negative edges? — also falls out of this framing. The algorithm commits to a node the moment it pops it, on the assumption that nothing later can be cheaper. A negative edge breaks that promise; a priority queue can't un-pop.

---
title: "Monotonic stacks — when to reach for one"
description: Next-greater-element problems hide everywhere once you see the shape.
topic: dsa/stacks
pubDatetime: 2026-06-14T10:00:00Z
draft: true
---

The tell is the question "for each element, what is the nearest element to the left/right that is bigger/smaller than it?" Temperatures until a warmer day, stock spans, largest rectangle in a histogram, trapping rain water — different costumes, same skeleton.

The invariant does all the work: keep the stack sorted (say, decreasing), and every time a new element violates the order, the elements it pops have just found their answer — the new element _is_ their next greater. Each index is pushed once and popped at most once, so the whole scan is O(n) even though the inner while-loop looks quadratic.

What I keep forgetting: decide up front whether the stack stores _values_ or _indices_. Indices are almost always the right call — you can recover the value, but not the distance.

---
title: "Backpressure — queues are not buffers"
description: An unbounded queue is a promise you can't keep.
topic: system-design
pubDatetime: 2026-05-20T10:00:00Z
draft: true
---

An unbounded queue isn't generosity, it's a deferred failure. Every message accepted without a limit is a promise to process it eventually — and when the consumer falls behind, "eventually" arrives all at once as memory pressure, timeout storms, and a queue full of requests whose callers gave up minutes ago.

A queue's real job is to absorb _variance_, not _sustained overload_. If arrival rate exceeds service rate for longer than the queue can smooth over, the only honest moves are to slow the producer down (blocking, windowing), shed load explicitly (reject early, when it's cheapest), or drop by policy instead of by accident.

The reframe that stuck: backpressure isn't a failure mode, it's _information_ — the system telling the truth about its capacity upstream, while it still has options.

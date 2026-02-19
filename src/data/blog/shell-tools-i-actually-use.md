---
title: Shell Tools I Actually Use
pubDatetime: 2026-02-10T10:00:00Z
description: A short list of command-line tools that have genuinely stuck around in my workflow.
tags:
  - tools
  - cli
  - productivity
---

There are a lot of "awesome lists" for command-line tools. Most of the things on them I install once, forget about, and uninstall six months later during a disk cleanup. These are the tools that survived that process — the ones I reach for without thinking.

## File Navigation

### `zoxide`

`zoxide` is a smarter `cd`. It learns which directories you visit most often and lets you jump to them with partial matches.

```bash
# First visit
cd ~/projects/my-long-project-name

# Every subsequent visit
z my-long
```

After a week of use, I stopped thinking about where my directories actually live on disk.

### `fd`

`fd` is a friendlier alternative to `find`. The defaults are sensible — it ignores hidden files and respects `.gitignore` — and the syntax is much easier to remember.

```bash
# Find all TypeScript files modified in the last day
fd --extension ts --changed-within 1d

# Find files matching a pattern
fd "config" src/
```

The output is coloured and the speed is noticeably faster on large trees.

## Viewing and Searching

### `bat`

`bat` is `cat` with syntax highlighting, line numbers, and git diff markers. I aliased `cat` to `bat` and haven't looked back.

```bash
# View a file with syntax highlighting
bat src/config.ts

# Pass to other tools (plain output, no decorations)
bat --plain src/config.ts | pbcopy
```

The git integration is the detail I didn't know I needed: changed lines are marked in the gutter so you can see at a glance what's new.

### `ripgrep`

`ripgrep` (`rg`) is fast grep with sane defaults. It skips hidden files and `.gitignore` entries automatically.

```bash
# Search for a string across the project
rg "pubDatetime"

# Search with file type filter
rg "export default" --type ts

# Search with context lines
rg "TODO" -C 2
```

The speed difference over `grep` becomes obvious on large repos. Searching a 50,000-file monorepo takes under a second.

## JSON and Data

### `jq`

`jq` is the standard tool for processing JSON on the command line. The syntax takes a little getting used to, but it's worth it.

```bash
# Pretty-print JSON
curl -s https://api.example.com/data | jq '.'

# Extract a specific field
curl -s https://api.example.com/users | jq '.[0].name'

# Filter and transform
jq '[.[] | select(.active == true) | {id, name}]' users.json
```

I use it constantly when working with APIs.

## Git

### `lazygit`

`lazygit` is a terminal UI for git. I still use plain git commands for most things, but `lazygit` is genuinely useful for interactive rebases and reviewing diffs before committing.

```bash
lazygit
```

It has a steep learning curve for about twenty minutes, and then it becomes second nature.

---

None of these tools are secrets. Most of them have been around for years and come up in every "modern CLI tools" article. The reason I'm writing about them is that I installed all of them at various points, and these are the ones that actually stayed. That's a different kind of endorsement.

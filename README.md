# TODO
- feat: chromium compatibility; chrome inserts div as child in p element

- Saving and loading of pages (using the existing export and import hooks)
- slash commands (also @ inline blocks, like mentions etc. and lists)
- Undo and redo
  - add a `changemap` to allow moving forwards and backwards
  - listen to input events releted to this in editor
- Formatting
  - Allow modifying style on input nodes
  - Listen for shortcuts
- Copy and pasting

- Improve block title and descriptions

# Blocks

# Inline blocks
All inline blocks expect for the text count as a single token/character.

- text (noss-text-node)
- equation (noss-equation-node)
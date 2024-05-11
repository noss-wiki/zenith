# TODO
- feat: chromium compatibility; chrome inserts div as child in p element

- Forward input events to the focussed block
- Saving and loading of pages (using the existing export and import hooks)
- slash commands (also @ inline blocks, like mentions etc. and lists)
- Undo and redo
  - add a `changemap` to allow moving forwards and backwards
  - listen to input events releted to this in editor
- Formatting
  - Allow modifying style on input nodes
  - Listen on shortcuts
- Shortcuts
  - Event handler
- Copy and pasting
  - Markdown compatibility; change to correct format of nodes upon pasting
  - Notion compatibility (https://evercoder.github.io/clipboard-inspector/, to view all types notion uses)
    - Keep correct formatting (blocks, style)
    - Keep blame, notion gives the last edited timestamp and the user id
      - Get email adress of user id by using notion api; and check if same email is used by a user in the workspace, otherwise give option to transfer ownership to user who pasted it or just show the notion name of the user
- Add option to reduce motion (add [data-reduced-motion] to html or body)

- Improve block title and descriptions

# Blocks

# Inline blocks
All inline blocks expect for the text count as a single token/character.

- text (noss-text-node)
- equation (noss-equation-node)
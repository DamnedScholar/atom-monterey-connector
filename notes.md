1. Atom starts.
  a. Package activates.
  b. Package starts listening for a cue from Monterey.
2. Monterey sends signal asking for control.
  a. Signal includes JSON with the opened project path, the results of `screen.getDisplayNearestPoint({BrowserWindow.x, BrowserWindow.y})`, and the width Monterey requires when fully compressed.
    * http://electron.atom.io/docs/api/screen/
    * http://electron.atom.io/docs/api/browser-window/
    * For testing purposes, this can be emulated with a JSON file pre-seeded with the correct values.
  b. Atom checks to make sure it's on the same monitor as Monterey and that the project path open in Monterey is also open in Atom.
  c. If everything matches up, Atom positions itself so that Monterey fits snugly on the left (or right) side and Atom takes up the rest of the screen.

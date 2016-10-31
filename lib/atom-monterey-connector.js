'use babel';

import { CompositeDisposable } from 'atom';
import { Emitter } from 'atom';
const electron = require('electron');
const util = require('util');

export default {

  atomMontereyConnectorView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command to emulate a signal from Monterey
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-monterey-connector:signal': () => this.signal()
    }));

    console.log("Monterey connector package activated.");

    this.emitter = new Emitter

    this.emitter.on('resize-signal', this.resize)
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return { };
  },

  signal() {
    // Function to emulate a signal from outside the program. This function should emit an object containing the opened project path, the results of `screen.getDisplayNearestPoint({BrowserWindow.x, BrowserWindow.y})`, and the width Monterey requires when fully compressed.
    let position = atom.getPosition();

    let display = electron.screen.getDisplayNearestPoint(position);

    display['monterey'] = {width: 200, height: 0}

    console.log("I see that the position is ")
    console.log(util.inspect(position))
    console.log("The display is ")
    console.log(util.inspect(display))

    // https://nodejs.org/api/util.html#util_util_inspect_object_options
    this.emitter.emit('resize-signal', display)
  },

  resize: function(display) {
    console.log("Resize function here and the display is ")
    console.log(util.inspect(display))

    width = display.workAreaSize.width - display.monterey.width
    height = display.workAreaSize.height - display.monterey.height

    atom.setPosition(display.monterey.width, display.monterey.height)
    atom.setSize(width, height)
  }

};

'use babel';

import { CompositeDisposable } from 'atom';
import { Emitter } from 'atom';
const electron = require('electron');
const util = require('util');
atomPlacement = {}

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
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-monterey-connector:return-size': () => this.returnSize()
    }));

    this.emitter = new Emitter

    this.emitter.on('resize-signal', this.resize)
  },

  consumeToolbar: function(toolbar) {
    signalTile = toolbar.addRightTile({item: myElement, priority: 100})
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

    let signalData = electron.screen.getDisplayNearestPoint(position);

    signalData['monterey'] = {width: 200, height: 0, project: 'path/to/project'}

    console.log("I see that the position is ") // Test
    console.log(util.inspect(position)) // Test
    console.log("The display is ") // Test
    console.log(util.inspect(signalData)) // Test

    // https://nodejs.org/api/util.html#util_util_inspect_object_options
    this.emitter.emit('resize-signal', signalData)
  },

  resize: function(signalData) {
    console.log("Resize function here and the display is ") // Test
    console.log(util.inspect(signalData)) // Test

    atomPlacement = {
      position: atom.getPosition(),
      size: atom.getSize(),
      maximized: atom.isMaximized(),
      fullscreen: atom.isFullScreen()
    }

    console.log("The Atom window's starting conditions are ") // Test
    console.log(util.inspect(atomPlacement)) // Test

    projectPath = 'path/to/project'

    if (signalData.monterey.project === projectPath) {
      width = signalData.workAreaSize.width - signalData.monterey.width
      height = signalData.workAreaSize.height - signalData.monterey.height

      atom.setPosition(signalData.monterey.width, signalData.monterey.height)
      atom.setSize(width, height)
    }
    else {
      console.log("The active project is not the one open in Monterey.")
    }
  },

  returnSize() {
    if (atomPlacement) {
      atom.setPosition(atomPlacement.position.x, atomPlacement.position.y)

      if (atomPlacement.maximized) {
        atom.maximize()
      }
      else if (atomPlacement.fullscreen) {
        atom.setFullScreen()
      }
      else {
        atom.setSize(atomPlacement.size.width, atomPlacement.size.height)
      }

      console.log("Atom has been returned to its prior state.") // Test
    }
    else {
      console.log("Previous placement data not found.")
    }
  }

};

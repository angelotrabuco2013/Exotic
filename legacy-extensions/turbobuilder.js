(function(Scratch) {
  const variables = {};

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("TurboBuilder must run unsandboxed");
  }

  class Extension {
      getInfo() {
          return {
              id: "Turbobuilder",
              name: "TurboBuilder",
              color1: "#ff6680",
              blocks: [
                  {
                    func: 'JScodeClipboard',
                    blockType: Scratch.BlockType.BUTTON,
                    text: 'copy extension code to clipboard'
                  },
                  {
                    opcode: 'TurboBuilder_Setup',
                    func: 'Setup',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set up extension [ID] [NAME] [COLOR1]',
                    arguments: {
                      ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'ID'
                      },
                      NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'EXTENSION NAME'
                      },
                      COLOR1: {
                        type: Scratch.ArgumentType.COLOR,
                        defaultValue: '#000000'
                      },
                    }
                  },
                  {
                    opcode: 'TurboBuilder_JScode',
                    func: 'JScode',
                    text: 'extension code',
                    blockType: Scratch.BlockType.REPORTER,
                  },
                  {
                    opcode: 'TurboBuilder_createblock',
                    func: 'createblock',
                    text: 'create block / id [ID] text [TEXT] blockType: [BLOCKTYPE_MENU]',
                    blockType: Scratch.BlockType.COMMAND,
                    arguments: {
                      ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "ID"
                      },
                      TEXT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'text'
                      },
                      BLOCKTYPE_MENU: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'BLOCKTYPE_MENU'
                      },
                    },
                  },
                  {
                    opcode: 'TurboBuilder_addFunctionality',
                    func: 'addFunctionality',
                    text: 'add function [FUNCTIONALITY] / BlockID [BLOCKID]',
                    blockType: Scratch.BlockType.COMMAND,
                    hideFromPalette: true,
                    arguments: {
                      FUNCTIONALITY: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'return true;',
                      },
                      BLOCKID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'ID'
                      },
                    },
                  },
                  {
                    opcode: 'TurboBuilder_addInput',
                    func: 'addInput',
                    text: 'add Input / Parent: [BlockID], ID: [ID] DefaultValue: [TEXT] / ArgumentType: [ARGUMENU]',
                    blockType: Scratch.BlockType.COMMAND,
                    hideFromPalette: true,
                    arguments: {
                      BlockID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'ID'
                      },
                      ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'ID'
                      },
                      TEXT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'text'
                      },
                      ARGUMENU: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'ARGUMENU'
                      },
                    }
                  },
              ],
              menus: {
                ARGUMENU: {
                  acceptReporters: false,
                  items: [
                    { text: "string", value: "STRING" },
                    { text: "number", value: "NUMBER" },
                    { text: "boolean", value: "BOOLEAN" },
                    { text: "empty", value: "EMPTY" },
                    { text: "color", value: "COLOR" },
                  ]
                },
                BLOCKTYPE_MENU: {
                  acceptReporters: false,
                  items: [
                    { text: "command", value: "COMMAND" },
                    { text: "reporter", value: "REPORTER" },
                    { text: "boolean", value: "BOOLEAN" },
                    { text: "hat", value: "HAT" },
                  ]
                },
              }
          };
      }
      _Clear() {
        localStorage.setItem("SAVE-EXT-" + "LatestInputID", 'Blank');
        localStorage.setItem("SAVE-EXT-" + "LatestInputArgument", 'Blank');
        localStorage.setItem("SAVE-EXT-" + "LatestInputText", 'Blank');
      }
      Setup(args, util) {
        this._Clear()
        const ID = args.ID;
        const ExtName = args.NAME;
        const color1 = args.COLOR1;
        localStorage.setItem("SAVE-EXT-" + "ID", ID)
        localStorage.setItem("SAVE-EXT-" + "ExtName", ExtName)
        localStorage.setItem("SAVE-EXT-" + "color1", color1)
        const Script = `(function(Scratch) {
          const variables = {};
          const blocks = [];
          const menus = [];
      
          class Extension {
              getInfo() {
                  return {
                      "id": "${ID}",
                      "name": "${ExtName}",
                      "color1": "${color1}",
                      "blocks": blocks
                  }
              }   
      }
      `;
      localStorage.setItem("SAVE-EXT-" + "JS", Script)
        
      }
      JScode(args, util){
        return localStorage.getItem("SAVE-EXT-" + "JS") + `Scratch.extensions.register(new Extension());
})(Scratch);`
      }
      JScodeClipboard() {
        let JScode = localStorage.getItem("SAVE-EXT-" + "JS") + `Scratch.extensions.register(new Extension());
      })(Scratch);`
        navigator.clipboard.writeText(JScode);
      }
      createblock(args, util) {
        const BlockID = args.ID;
        const BlockText = args.TEXT;
        const BlockType = args.BLOCKTYPE_MENU;

        const Script = `blocks.push({
        blockType: Scratch.BlockType.${BlockType},
        text: '${BlockText}',
        opcode: '${BlockID}',
        arguments: {}
      });
      Extension.prototype['${BlockID}'] = (args, util) => {
        
      };
      `;
      const LocalStorage_JS = localStorage.getItem("SAVE-EXT-" + "JS");
      localStorage.setItem("SAVE-EXT-" + "JS", LocalStorage_JS + Script);
      }
      addFunctionality(args, util){
        let LocalStorage_JS = localStorage.getItem("SAVE-EXT-" + "JS");
        let BlockID = args.BLOCKID;
        let Function = args.FUNCTIONALITY;
        let { constant1, constant2 } = this._splitString(LocalStorage_JS, `Extension.prototype['${BlockID}'] = (args, util) => {
          `, `};`)
        let AfterMath = (constant1 + Function + constant2)
        localStorage.setItem("SAVE-EXT-" + "JS", AfterMath);
      }
      addInput(args, util) {
        let InputID = args.ID;
        let InputTEXT = args.TEXT;
        let InputArgument = args.ARGUMENU;
        let BlockID = args.BlockID;
        let LocalStorage_JS = localStorage.getItem("SAVE-EXT-" + "JS");
        let LatestInputID = localStorage.getItem("SAVE-EXT-" + "LatestInputID");
        let LatestInputArgument = localStorage.getItem("SAVE-EXT-" + "LatestInputArgument");
        let LatestInputText = localStorage.getItem("SAVE-EXT-" + "LatestInputText");
        let Split1 = '';
        if (LatestInputID === 'Blank', LatestInputArgument === 'Blank', LatestInputText === 'Blank') {
          Split1 = `'${BlockID}',
          arguments: {`;
          // localStorage.setItem("SAVE-EXT-" + "SPLIT", Split1);
          localStorage.setItem("SAVE-EXT-" + "LatestInputID", InputID);
        localStorage.setItem("SAVE-EXT-" + "LatestInputArgument", InputArgument);
        localStorage.setItem("SAVE-EXT-" + "LatestInputText", InputTEXT);
        let Script = `"${InputID}": {
          type: Scratch.ArgumentType.${InputArgument},
          defaultValue: '${InputTEXT}',
        },
      `;
        let { constant1, constant2 } = this._splitString(LocalStorage_JS, Split1, `}
    });`);
        let JS = (constant1 + Script + constant2);
        localStorage.setItem("SAVE-EXT-" + "JS", JS);
        } else {
          Split1 = `"${LatestInputID}": {
            type: Scratch.ArgumentType.${LatestInputArgument},
            defaultValue: '${LatestInputText}',
          },
        `;
        
        localStorage.setItem("SAVE-EXT-" + "LatestInputID", InputID);
        localStorage.setItem("SAVE-EXT-" + "LatestInputArgument", InputArgument);
        localStorage.setItem("SAVE-EXT-" + "LatestInputText", InputTEXT);
        let Script = `"${InputID}": {
          type: Scratch.ArgumentType.${InputArgument},
          defaultValue: '${InputTEXT}',
        },
      `;
        let { constant1, constant2 } = this._splitString(LocalStorage_JS, Split1, `}
    });`);
        let JS = (constant1 + Script + constant2);
        localStorage.setItem("SAVE-EXT-" + "JS", JS);
        };
        /*
        localStorage.setItem("SAVE-EXT-" + "LatestInputID", InputID);
        localStorage.setItem("SAVE-EXT-" + "LatestInputArgument", InputArgument);
        localStorage.setItem("SAVE-EXT-" + "LatestInputText", InputTEXT);
        let Script = `"${InputID}": {
          type: Scratch.ArgumentType.${InputArgument},
          defaultValue: '${InputTEXT}',
        },
      `;
        let { constant1, constant2 } = this._splitString(LocalStorage_JS, Split1, `}
    });`);
        let JS = (constant1 + Script + constant2);
        localStorage.setItem("SAVE-EXT-" + "JS", JS);
        */
      }
      _splitString(majorString, substring1, substring2) {
          const index1 = majorString.indexOf(substring1);
          const index2 = majorString.indexOf(substring2);
        
          if (index1 !== -1 && index2 !== -1) {
            let constant1 = majorString.slice(0, index1 + substring1.length);
            let constant2 = majorString.slice(index2 + substring2.length);
        
            return { constant1, constant2 };
          } else {
            console.error('One or both substrings not found in the major string.');
            return null;
          }
      }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
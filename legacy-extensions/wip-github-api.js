(function(Scratch) {
    const variables = {};
    
    let LISTMENU = [
      'Repo ID',
      'Node ID',
      'Description',
      'Created at',
      'Most Used Language'
    ];
    let COUNTMENU = [
      'Watchers',
      'Stargazers',
      'Size',
      'Open Issues'
    ];
    class Extension {
        getInfo() {
            return {
              id: "GithubAPI",
              name: "GitHub API",
              blocks: [
                {
                  opcode: 'GithubAPI_Fetch',
                  text: 'fetch [LIST] from org. [ORG] repo. [REPO]',
                  blockType: Scratch.BlockType.REPORTER,
                  arguments: {
                    LIST: {
                      type: Scratch.ArgumentType.STRING,
                      menu: 'LIST'
                    },
                    ORG: {
                      type: Scratch.ArgumentType.STRING,
                      defaultValue: 'Dinosaurmod'
                    },
                    REPO: {
                      type: Scratch.ArgumentType.STRING,
                      defaultValue: 'dinosaurmod.github.io'
                    },
                  }
                },
                {
                  opcode: 'GithubAPI_FetchCount',
                  text: 'fetch [COUNT] count from org. [ORG] repo. [REPO]',
                  blockType: Scratch.BlockType.REPORTER,
                  arguments: {
                    COUNT: {
                      type: Scratch.ArgumentType.STRING,
                      menu: 'COUNT'
                    },
                    ORG: {
                      type: Scratch.ArgumentType.STRING,
                      defaultValue: 'DinosaurMod'
                    },
                    REPO: {
                      type: Scratch.ArgumentType.STRING,
                      defaultValue: 'dinosaurmod.github.io'
                    },
                  }
                },
                {
                  opcode: 'd',
                  text: 'hat',
                  blockType: Scratch.BlockType.HAT,
                  arguments: {}
                },
              ],
              menus: {
                LIST: {
                  acceptReporters: true,
                  items: LISTMENU
                },
                COUNT: {
                  acceptReporters: true,
                  items: COUNTMENU
                },
              }
            }
        }
        GithubAPI_Fetch(args, util) {
          let api_url = 'https://api.github.com/repos/' + args.ORG + '/' + args.REPO
          if (args.LIST === 'Repo ID') {
            return Scratch.fetch(api_url)
            .then( res => res.json())
            .then(data => (data.id))
            .catch(() => "");
          } else if (args.LIST === 'Node ID') {
            return Scratch.fetch(api_url)
            .then( res => res.json())
            .then(data => (data.node_id))
            .catch(() => "");
          } else if (args.LIST === 'Description') {
            return Scratch.fetch(api_url)
            .then( res => res.json())
            .then(data => (data.description))
            .catch(() => "");
          } else if (args.LIST === 'Created at') {
            return Scratch.fetch(api_url)
            .then( res => res.json())
            .then(data => (data.created_at))
            .catch(() => "");
          } else if (args.LIST === 'Most Used Language') {
            return Scratch.fetch(api_url)
            .then( res => res.json())
            .then(data => (data.language))
            .catch(() => "");
          }
          
        }
        GithubAPI_FetchCount(args) {
          
        }
        d() {
          return true
        }
        _GithubAPI_FetchURL() {
          
        }

    }

    Scratch.extensions.register(new Extension());
})(Scratch);
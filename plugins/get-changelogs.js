const fs = require('fs')
const path = require('path');

module.exports = async function getChangelogs(context, options) {
    return {
      name: 'changelog-data',
      async loadContent() {
        // get changelog files & sort desc
        const dirPath = path.resolve('docs/guides/references/_changelogs');
        try {
          const changelogs = await fs.promises.readdir(dirPath);
          const sortedChangelogs = changelogs.sort((a, b) => {
            return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
          })
         // read each changlelog file to get contents & store for consumption
         const data = []
          for (const file of sortedChangelogs) {
            const filePath = path.join(dirPath, file);
            const contents = await fs.promises.readFile(filePath, { encoding: 'utf8' })
            data.push(contents)
          }
          return data;
        } catch (err) {
          console.error(err);
        }
      },
      async contentLoaded({content, actions}) {
        const {setGlobalData} = actions;
        setGlobalData({changelogs: content});
      },
    };
  }

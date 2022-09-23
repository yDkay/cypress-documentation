const fs = require('fs')
const path = require('path');

module.exports = async function getChangelogs(context, options) {
    return {
      name: 'changelog-data',
      async loadContent() {
        const changelogDir = path.resolve('docs/guides/references/_changelogs');
        const changelogListFile = path.resolve('docs/guides/references/_changelog-list.mdx');

        // get changelog files & sort desc
        try {
          const changelogs = await fs.promises.readdir(changelogDir);
          const sortedChangelogs = changelogs.sort((a, b) => {
            return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
          })

          const data = []
            for (const file of sortedChangelogs) {
              // populate changelog list for TOC hack
              // TODO: add logic to check file contents before writing
              // const releaseNumHeader = `## ${file.slice(0, -3)}`+'\n';
              // const toc = await fs.promises.appendFile(changelogListFile, releaseNumHeader)

              // read each changlelog file to get contents & store for consumption
              const changelogFile = path.join(changelogDir, file);
              const contents = await fs.promises.readFile(changelogFile, { encoding: 'utf8' })
              data.push(contents)
            }
          return data;
        } catch (err) {
          console.error(err);
        }
      },
      // pass sorted changelog data for storage & consumption by <Changelog />
      async contentLoaded({content, actions}) {
        const {setGlobalData} = actions;
        setGlobalData({changelogs: content});
      },
    };
  }

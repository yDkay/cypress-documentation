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
          
          // TODO: add logic to check file contents before writing
          const latestRelease = fs.readFileSync(changelogListFile,
          {encoding:'utf8'},
          (err, data) => {
            if (err)
                console.log(err);
            else {
              const x = parseFloat(data.toString().slice(2, 10))
              console.log(x)
              // return x
            }
        });

          // console.log('latestRelease', latestRelease)

          const data = []
            for (const file of sortedChangelogs) {
              // populate changelog list for TOC hack
              const releaseNumHeader = `## ${file.slice(0, -3)}`+'\n';

              if (latestRelease < '10.9.0') {
                const toc = await fs.promises.prependFile(changelogListFile, '## 10.9.0')
              }

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

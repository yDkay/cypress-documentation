import React from 'react'
import {usePluginData} from '@docusaurus/useGlobalData';
const md = require('markdown-it')();

export default function Changelog() {
  const {changelogs} = usePluginData('changelog-data');  
  return changelogs.map((changelog, idx) => {  
    const parsedMarkdown = md.render(changelog);
    return (
      <div key={idx} dangerouslySetInnerHTML={{__html: parsedMarkdown}} />
    );
  })
}

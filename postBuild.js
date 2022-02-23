const path = require('path')
const fs = require('fs')

const copyRecursiveSync = (src, dest) => {
  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
    console.log(`Copying file ${src} to ${dest}`)
  }
};

copyRecursiveSync('templates', 'dist/templates');
fs.unlinkSync('dist/postBuild.js');
fs.unlinkSync('dist/clean.js');

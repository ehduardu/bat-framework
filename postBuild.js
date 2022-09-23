const path = require('path')
const fs = require('fs')

const copyRecursiveSync = (src, dest) => {
  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();
  if (isDirectory) {
    try {
      fs.mkdirSync(dest);
    } catch (error) {
      if (!error.message.includes('EEXIST: file already exists')) throw error;
    }

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

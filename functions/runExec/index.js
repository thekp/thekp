const { exec } = require('child_process');

const runExec = ({ command, dir }) => {
  console.log(`* Running "${command}"${dir ? ` in dir "${dir}"` : ''}`);
  return new Promise((resolve, reject) => {
    exec(
      command,
      dir
        ? {
            cwd: dir,
          }
        : {},
      (error, stdout, stderr) => {
        if (error) {
          console.error(stdout);
          console.error(stderr);
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });
};

module.exports = runExec;

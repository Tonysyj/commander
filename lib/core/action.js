import fs from "node:fs"
import path from "node:path"
import {exec} from "node:child_process" 

function commanderCreate(projectName, args){
  fs.stat(path.join(projectName),(err, stats) => {
    if(err){
      if(err.errno === -2) {
        createProject(projectName)
      } else {
        console.log('ERROR: ', err);
      }
    } else {
      if(stats.isDirectory()){
        console.log('Already have this project dir name, Please change other one.');
      } else {
        createProject(projectName)
      }
    }
  })
}

function commandOpen(dirPath, args){
  fs.opendir(dirPath, (err, dir) => {
    if(err){
      console.log('ERROR', err);
    } else {
      console.log('Path of the directory:', dir.path);
      exec(`open ${dir.path}`)
      console.log('Closing the directory');
      dir.closeSync
    }
  })
}

function createProject(projectName){
  fs.mkdir(path.join(projectName), (err) => {
    !err ? console.log(`mkdir ${projectName} success`) : console.log('ERROR:', err);
  })

  fs.writeFile(path.join(projectName, '.gitignore'), `.vscode\n.DS_store\nnode_modules`, (err) => {
    !err ? console.log(`create .gitignore success`) : console.log('ERROR:', err);
  })

  fs.writeFile(path.join(projectName, 'README.md'), `# ${projectName}`, (err) => {
    !err ? console.log(`create readme success`) : console.log('ERROR:', err);
  })  
  exec(`cd ${projectName} \n git init \n npm init -y \n yarn add -D @types/node`)
  exec(`code ${projectName}`)
}

export {commanderCreate, commandOpen}
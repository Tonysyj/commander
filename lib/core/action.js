import fs from "node:fs"
import path from "node:path"
import {exec} from "node:child_process" 
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function commanderCreate(projectName, args, cmd){
  fs.stat(path.join(projectName),(err, stats) => {
    if(err){
      if(err.errno === -2) {
        createProject(projectName, cmd)
      } else {
        console.log('ERROR: ', err);
      }
    } else {
      if(stats.isDirectory()){
        console.log('Already have this project dir name, Please change other one.');
      } else {
        createProject(projectName, cmd)
      }
    }
  })
}

function createProject(projectName, cmd){
  basicWork(projectName)
  let execString = `cd ${projectName} \n git init \n npm init -y \n yarn add -D @types/node\n`
  if(cmd.node){
    execString += `yarn add express minimist ip cors nodemon\n`
    execString += `yarn add -D @types/express @types/minimist @types/ip @types/cors\n`
  }
  exec(execString, (err) => {
    !err ? console.log('create git and package.json success.') : console.log('ERROR:', err);  
    if(cmd.node){
      const pathPackage = path.join(projectName, 'package.json')
      fs.readFile(pathPackage, (err, data) => {
        if(err) return console.log('ERROR:', err);
        const dataString = data.toString() // 把文件变成字符串
        const content = {...JSON.parse(dataString)} // 用JSON去解析这个字符串，是的文件变成一个真正可以读的JSON文件
        /**
         * 这里用...展开是因为我们需要对JSON文件做修改
         * 由于JSON文件不存在链式结构，所以只需要展开一层就可以对其进行修改
         */
        content.type = 'module'
        content.scripts.start = 'nodemon server.js'
        const newDataString = JSON.stringify(content, '', '\t')
        fs.writeFile(pathPackage, newDataString, (err) => {
          !err ? console.log('add package.json module success.') : console.log('ERROR:', err);
        })
        /**
         * writeFile的一个特性是：
         * 如果它发现了这个文件，并且这个文件里面有内容，那么在我们什么都不设置的情况下
         * 它不会报错，而是会重新写一份并且直接把原有的东西给覆盖掉
         */
      })
      const pathLocalServer = path.join(__dirname, '../file', 'server.js')
      const pathServer = path.join(projectName, 'server.js')
      fs.readFile(pathLocalServer, (err, data) => {
        if(err) return console.log('ERROR:', err);
        fs.writeFile(pathServer, data, (err) => {
          !err ? console.log('add server.js success.') : console.log('ERROR:', err);
        })
      })
    }
    exec(`code ${projectName}`)
  })
}

function basicWork(projectName){
  fs.mkdir(path.join(projectName), (err) => {
    !err ? console.log(`mkdir ${projectName} success`) : console.log('ERROR:', err);
  })

  fs.writeFile(path.join(projectName, '.gitignore'), `.vscode\n.DS_store\nnode_modules`, (err) => {
    !err ? console.log(`create .gitignore success`) : console.log('ERROR:', err);
  })

  fs.writeFile(path.join(projectName, 'README.md'), `# ${projectName}`, (err) => {
    !err ? console.log(`create readme success`) : console.log('ERROR:', err);
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

export {commanderCreate, commandOpen}
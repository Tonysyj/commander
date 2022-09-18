#! /usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import {exec} from "node:child_process" // exec()是异步函数
import { Command } from "commander"
const program = new Command();
// 设置
program.option('-f --framework <framework>', '设置框架') // 代表 -f和 --framework事一个意思
program.command('create <project> [other...]') // 此处是一个小bug，不加次代码，cli打印不出来
  .alias('crt') // 链式处理，就是处理完了上面的代码之后此条代码接着上面代码的基础上来执行。手动保存时会自动退格
  .description('创建项目')
  .action((projectName, args) => {
    /** stat 的作用是检查
     * err 是检查是否有错误
     * stats 是检查file path的详细信息的
     */
    fs.stat(path.join(projectName),(err, stats) => {
      if(err){
        // 规定常识问题，err.errno === -2 说明我们要创造的这个东西是不存在的。这样我们才可以创造
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
  })

  function createProject(projectName){
    //   exec(`mkdir ${projectName}`, (err) => {
    //     !err ? console.log(`mkdir ${projectName} success`) : console.log('ERROR:', err);
    //   }) 此方法需要借助系统的力量，如果操作系统没有mkdir的命令则无法执行

    /**fs.mkdirSync() 也是异步函数
   * 作用跟exec一样.但是好处是不需要借助系统力量,一定有mkdir这个命令
   * 不推荐在此步骤使用异步函数，因为需要保证前面的操作完成才能进行这步 
   */
  
    fs.mkdir(path.join(projectName), (err) => {
      !err ? console.log(`mkdir ${projectName} success`) : console.log('ERROR:', err);
    }) // fs.mkdir是同步函数

    fs.writeFile(path.join(projectName, '.gitignore'), `.vscode\n.DS_store\nnode_modules`, (err) => {
      !err ? console.log(`create .gitignore success`) : console.log('ERROR:', err);
    })

    fs.writeFile(path.join(projectName, 'README.md'), `# ${projectName}`, (err) => {
      !err ? console.log(`create readme success`) : console.log('ERROR:', err);
    })  
    exec(`cd ${projectName} \n git init \n npm init -y \n yarn add -D @types/node`)
    exec(`code ${projectName}`)
  }

// 解析
program.parse(process.argv)
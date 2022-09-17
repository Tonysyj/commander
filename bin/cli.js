#! /usr/bin/env node
import fs from "node:fs"
import path from "node:path"
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
    console.log('mkdir:', projectName);
  }

// 解析
program.parse(process.argv)
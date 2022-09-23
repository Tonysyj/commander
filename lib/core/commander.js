import { commanderCreate, commandOpen } from "./action.js"

function commander(program) {
  program.command('create <project> [other...]')
    .alias('crt')
    .description('创建项目')
    .option('-n, --node', 'node server necessary tools')
    .action((projectName, args, cmd) => commanderCreate(projectName, args, cmd))
    /**
     * projectName: 你创造的东西
     * args: 你东西的参数
     * cmd: option
     */

  program.command('open <path> [other...]')
    .alias('o')
    .description('打开文件夹')
    .action((dirPath, args) => commandOpen(dirPath, args))
}

export { commander }
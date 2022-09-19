import { commanderCreate, commandOpen } from "./action.js"

function commander(program) {
  program.command('create <project> [other...]')
    .alias('crt')
    .description('创建项目')
    .action((projectName, args) => commanderCreate(projectName, args))

  program.command('open <path> [other...]')
    .alias('o')
    .description('打开文件夹')
    .action((dirPath, args) => commandOpen(dirPath, args))
}

export { commander }
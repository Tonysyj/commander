#! /usr/bin/env node

import { Command } from "commander"
const program = new Command();
// 设置
import {help} from '../lib/core/help.js'
help(program)
import {commander} from '../lib/core/commander.js'
commander(program)

// 解析
program.parse(process.argv)
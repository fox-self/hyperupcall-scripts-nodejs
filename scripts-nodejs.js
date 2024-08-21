#!/usr/bin/env node
import * as util from 'node:util'
import { spawn } from 'child_process'

const { values, positionals } = util.parseArgs({
	args: process.argv.slice(2),
	allowPositionals: true,
	options: {
		level: {
			type: 'string',
		},
		help: {
			type: 'boolean',
		},
	},
})

// TODO: --verbose
const helpText = `hyperupcall-scripts-nodejs <SUBCOMMAND> [--help]
SUBCOMMANDS:
  format [check|fix]

  lint [check|fix] --level none|dev|commit|release
`

if (!positionals[0] || !positionals[1]) {
	process.stdout.write(helpText)
	process.exit(1)
}

if (positionals[0] === 'format') {
	if (positionals[1] == 'check') {
		run(['prettier', '--check', '--ignore-unknown', '.'])
	} else if (positionals[1] === 'fix') {
		run(['prettier', '--write', '--ignore-unknown', '.'])
	} else {
		throw new Error(`Invalid: ${positionals[1]}`)
	}
} else if (positionals[0] === 'lint') {
} else {
	throw new Error(`Invalid: ${positionals[0]}`)
}

async function run(/** @type {string[]} */ command) {
	const child = spawn(command[0], command.slice(1), {
		env: {
			...process.env,
			HYPERUPCALL_FORMAT_LEVEL: values.level ?? 'dev',
		},
	})
	child.stdout.pipe(process.stdout)
	child.stderr.pipe(process.stderr)
}
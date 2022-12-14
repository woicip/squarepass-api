const chalk = require('chalk');

function started({ port }){
    console.log(`
You now can access ${chalk.green.bold('SquarePass')} API

    Local:              http://localhost:${chalk.cyan.bold(port)}/
    On Your Network:    http://192.168.0.101:${chalk.cyan.bold(port)}/

    Endpoints:   /login   /register   /check-email   /change-email
                 /get-security-question   /find-user   

Note that you can access it via Browser / HTTP Client.
`);
}

module.exports = started;
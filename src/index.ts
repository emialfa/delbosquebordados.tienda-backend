import dotenv from 'dotenv'
dotenv.config()

const app = require('./app')
import './database'

function main() {
    app.listen(app.get('port'));
    console.log('Server on port '+app.get('port'))
}

main();
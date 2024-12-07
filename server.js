const fs = require('fs')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const pg = require('pg')

let config = JSON.parse(fs.readFileSync('config.json'))

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message })
})

app.use(express.static(config.frontend))

let pgClient = null
const api = '/api/'

app.get(api + ':table', (req, res) => {
    const selection = `WHERE ${req.params.table}::text ILIKE`
    pgClient.query(`SELECT COUNT(*) FROM ${req.params.table} ${selection} $1`, [ `%${req.query.search || ''}%` ], (err, data) => {
        if(err) {
            res.status(400).json({ error: err.message })
            return
        }
        const total = parseInt(data.rows[0].count)
        let query = `SELECT * FROM ${req.params.table}`
        const parameters = [ req.query.offset, req.query.limit ]
        if(req.query.search) {
            query += ` ${selection} $3`
            parameters.push(`%${req.query.search}%`)
        }
        if(req.query.sort && ['ASC', 'DESC'].includes(req.query.order.toUpperCase())) {
            query += ` ORDER BY ${req.query.sort} ${req.query.order}`
        }
        query += ' OFFSET $1 LIMIT $2'
        pgClient.query(query, parameters, (err, data) => {
            if(err) {
                res.status(400).json({ error: err.message })
            } else {
                res.json({ total, data: data.rows })
            }
        })
    })
})

app.listen(config.port, () => {
    pgClient = new pg.Client(config.db)
    pgClient.connect().catch(err => {
        console.error(err)
        process.exit(0)
    })
    console.log('DB connected, backend is listening on port', config.port)
})
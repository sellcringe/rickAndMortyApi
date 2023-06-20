"use strict"


const fs = require('fs');
const pg = require("pg");
const plumbus = require('rickmortyapi')

const config = {
    connectionString:
        "postgres://candidate:62I8anq3cFq5GYh2u4Lh@rc1b-" +
        "r21uoagjy1t7k77h.mdb.yandexcloud.net:6432/db1",
    autocomplete: true,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync("/home/rar/.postgresql/root.crt").toString()
    }

}



const conn = new pg.Client(config)
conn.connect((err) => {
    if(err) throw err


})
createTable()
characters(1)

async function createTable(){
    const createTable = "CREATE TABLE IF NOT EXISTS sellcringe (id serial PRIMARY KEY, name text, data jsonb) "
    return await conn.query(createTable)
}


async function characters(page){
    console.log("process.")
    let character = await plumbus.getCharacters({
        page: page
    })
    if (character['status'] == 404){ return {
        message: 'Такой страницы не существуте, конец цикла' +  conn.end(),
        messageLog: console.log('Такой страницы не существуте, конец цикла')
    }}
    else{const listPage = character['data']['results']
        console.log('process..')
        for(let i of listPage){
            //check valid
            let query = " SELECT * FROM sellcringe WHERE name = $1 "
            let values = [i['name']]
            let res = await conn.query(query, values)
            if (res.rows[0] === undefined){
                query = " INSERT INTO sellcringe VALUES ($1, $2, $3) "
                values = [i['id'], i['name'], i]
                res = await conn.query(query, values)



            }
        }
        console.log("process... ")
        page++
        characters(page)

    }
}



//



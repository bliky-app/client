const fs = require('fs')

let content = fs.readFileSync('/var/home/kirill/Projects/bliky/client/apps/web/src/lib/api/mockData.ts', 'utf8')

// We will use regex to find each appointment and sum its stage durations
const aptRegex = /\{\s*id:\s*"apt-\d+",\s*startDateTime:.*?isConfirmed:\s*(true|false)\s*\}/gs

content = content.replace(aptRegex, (match) => {
    // find all durationMinutes: X
    let sum = 0
    const durationRegex = /durationMinutes:\s*(\d+)/g
    let m
    while ((m = durationRegex.exec(match)) !== null) {
        sum += parseInt(m[1], 10)
    }
    
    // inject totalDurationMinutes
    const injectStr = `\n    totalDurationMinutes: ${sum},`
    
    // inject after startDateTime
    return match.replace(/(startDateTime:\s*makeISO[^,]+,)/, `$1${injectStr}`)
})

fs.writeFileSync('/var/home/kirill/Projects/bliky/client/apps/web/src/lib/api/mockData.ts', content)

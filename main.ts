import * as readline from 'readline'
import * as fs from 'fs'
import ytdl from 'ytdl-core'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

rl.question('Input youtube link: ', (answer) => {
    main(answer)
    rl.close()
})

async function getBasicInfor(link: string) {
    const infor = await ytdl.getBasicInfo(link)
    const { title } = infor.videoDetails
    return title
}

function display(line: string) {
    if (line.length > 150) line = 'Downloading'
    line = `${line}+`
    console.log(`${line}`)
    return line
}

async function downloadVideo(link: string, title: string) {
    const file = ytdl(link, { quality: 'highestvideo' })
    file.pipe(fs.createWriteStream(`./download/1.mp4`))
    file.on('data', () => {
        // console.clear()
    })
    file.on('data', () => {
        let line = 'Downloading'
        console.clear()
        line = display(line)
    })
    file.once('end', () => {
        console.log(`Downloaded Video`)
        downloadAudio(link, title)
    })
    file.on('error', (err) => console.log(err))
}

async function downloadAudio(link: string, title: string) {
    const file = ytdl(link, { quality: 'highestaudio' })
    file.pipe(fs.createWriteStream(`./download/1.mp3`))
    file.on('data', () => {
        // console.clear()
    })
    let line = 'Downloading'
    file.on('data', () => {
        let line = 'Downloading'
        console.clear()
        line = display(line)
    })
    file.once('end', () => {
        console.log(`Downloaded Audio`)
        convert(title)
    })
    file.on('error', (err) => console.log(err))
}

async function convert(title: string) {
    const cmd = require('node-cmd')
    console.log(title)
    cmd.runSync(
        `ffmpeg.exe -i download/1.mp4 -i download/1.mp3 -c copy "convert/${title}.mp4" -y`
    )
    cmd.runSync(`del download /q`)
    console.clear()
    console.log(`DONE`)
}

async function main(link: string) {
    const realTitle = await getBasicInfor(link)
    await downloadVideo(link, realTitle)
}

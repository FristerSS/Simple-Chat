import { io } from "../node_modules/socket.io-client/build/esm/index"
import Server from "./server"
import ServerChat from "./server_chat"

import { IApp, ICircle, IServer, IServerChat} from "./interfaces"


const startContainer: HTMLElement = document.querySelector('#start_container')
const startInputElement: HTMLInputElement = document.querySelector('#start_container-name')
const startButtonElement: HTMLButtonElement = document.querySelector('#start_container-button')
const startBlockElement: HTMLElement = document.querySelector('#start_block')

let name = ''

let messages: number = 0

const canvas: HTMLCanvasElement = document.querySelector('canvas')
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight


startInputElement.addEventListener('input', (e: any) =>
{
    name = e.target.value
})

startButtonElement.addEventListener('click', () =>
{
    if(name.length > 1)
    {
        startBlockElement.remove()
        startContainer.remove()
        Start()
    }
})


function Start()
{

    const server = io('http://localhost:3000', {
        transports: ["websocket"]
    })




class App implements IApp
{
    private server: any
    private ServerSocket: IServer
    private ServerForChat: IServerChat
    public circles: any[]
    public name: string

    constructor(server: any, name: string)
    {
        this.name = name // User name
        this.circles = []
        this.server = server
        this.ServerSocket = new Server(this, server)
        this.ServerForChat = new ServerChat(this, server)
    }

    public update(): void
    {
        this.circles.forEach((user: ICircle) =>
        {
            user.update()
        })
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        this.circles = this.circles.sort((a, b) => a.y - b.y)

        this.circles.forEach((user: ICircle) =>
        {
            user.draw(ctx)
        })
    }
}

const app = new App(server, name)



function Loop(): void
{
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    app.update()
    app.draw(ctx)
   
    requestAnimationFrame(Loop)
}

Loop()


}



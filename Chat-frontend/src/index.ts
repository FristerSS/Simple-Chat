import { io } from "../node_modules/socket.io-client/build/esm/index"
import Server from "./server"
import ServerChat from "./server_chat"
import { URL } from "./config"
import gsap from "gsap"

import { IApp, ICircle, IServer, IServerChat} from "./interfaces"

const timeline = gsap.timeline()
const startContainer: HTMLElement = document.querySelector('#start_container')
const startInputElement: HTMLInputElement = document.querySelector('#start_container-name')
const startButtonElement: HTMLButtonElement = document.querySelector('#start_container-button')
const startBlockElement: HTMLElement = document.querySelector('#start_block')

const loadingElement: HTMLElement = document.querySelector('#loading')

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

function ShowLoadingElement() {
    loadingElement.classList.remove('display-none')
    loadingElement.classList.add('display-flex')
    timeline.fromTo(loadingElement, {opacity: 0, x: '-100%'}, {opacity: 1, x: '-50%', duration: .2})
}

function HideLoadingElement(){

        timeline.fromTo(loadingElement, {opacity: 1, x: '-50%'}, {opacity: 0, x: '0%', duration: .2})
                .add(() =>
                {
                    loadingElement.classList.add('display-none')
                    loadingElement.classList.remove('display-flex')
                })
}

startButtonElement.addEventListener('click', () =>
{
    if(name.length > 1)
    {
        // Show loading element when start
        ShowLoadingElement()

        startBlockElement.remove()
        startContainer.remove()
        Start()
    }
})


function Start()
{

    const server = io(URL, {
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

export {canvas, HideLoadingElement}



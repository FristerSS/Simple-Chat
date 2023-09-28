import { ICircle } from "./interfaces"

const keysPressed: string[] = []


export default class Circle implements ICircle
{
    private app: any
    private x: number
    private y: number
    private color: string
    private id: string
    private speed: number
    private name: string

    static Create(app: any, x: number, y: number, color: string, id: string, name: string): void
    {
        console.log(app.circles);
        
        app.circles.push(new Circle(app, x, y, color, id, name))
    }

    constructor(app: any, x: number, y: number, color: string, id: string, name: string)
    {
        this.app = app
        this.x = x
        this.y = y
        this.color = color
        this.id = id
        this.speed = 3
        this.name = name

        window.addEventListener('keypress', (e) =>
        {
            if(!keysPressed.includes(e.key))
                keysPressed.push(e.key)

        })

        window.addEventListener('keyup', (e) =>
        {
            if(keysPressed.includes(e.key))
            {
                keysPressed.splice(keysPressed.indexOf(e.key), 1)
            }
        })
    }

    public GetColor(): string
    {
        return this.color
    }

    public EmitChangePosition(): void
    {
        this.app.ServerSocket.MovePayer(this.id, this.x, this.y)
    }


    public draw(ctx: CanvasRenderingContext2D): void
    {

        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, 50, 50)
        ctx.fill()

        if(this.app.server.id == this.id)
        {
            ctx.lineWidth = 2
            ctx.strokeStyle = 'white'
            ctx.strokeRect(this.x, this.y, 50, 50)
            ctx.stroke()
        }
           
        ctx.fillStyle = 'white'
        ctx.font = '25px Arial'
        ctx.fillText(this.name, this.x + 25 - this.name.length * 7, this.y - 10)
        ctx.fill()
        
            
    }

    public update(): void
    {
        this.Move()
    }

    public Move(): void
    {
        if(this.app.server.id != this.id )
        return

        if(keysPressed.includes('d'))
        {
            this.x += this.speed
            this.EmitChangePosition()
        }

        if(keysPressed.includes('a'))
        {
            this.x -= this.speed
            this.EmitChangePosition()
        }

        if(keysPressed.includes('w'))
        {
            this.y -= this.speed
            this.EmitChangePosition()
        }

        if(keysPressed.includes('s'))
        {
            this.y += this.speed
            this.EmitChangePosition()
        }
    }
}



import { ICircle } from "./interfaces"
import { canvas } from "./index"

const keysPressed: string[] = []

function CreateAngle(x1: number, y1: number, x2: number, y2: number)
{
    const angle = Math.atan2(y1 - y2 ,x1 - x2)

    return angle
}

function CreateVelocity(angle: number, speed: number = 1)
{
    const velocity = {
        x: Math.cos(angle) * -speed,
        y: Math.sin(angle) * -speed,
    }

    return velocity
}

function Distance(obj1: {position: {x: number, y: number}}, obj2: {position: {x: number, y: number}})
{
    return Math.sqrt((obj1.position.x - obj2.position.x) * (obj1.position.x - obj2.position.x) + (obj1.position.y - obj2.position.y) * (obj1.position.y - obj2.position.y) );
}



export default class Circle implements ICircle
{
    private app: any
    private x: number
    private y: number
    private color: string
    private id: string
    private speed: number
    private name: string
    private size: {width: number, height: number}
    private target: {x: number, y: number}
    private velocity: {x: number, y: number}

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
        this.size = {
            width: window.innerWidth * 0.02,
            height: window.innerWidth * 0.02
        }

        this.target = {
            x: this.x, 
            y: this.y
        }

        this.velocity = {x: 0, y: 0}

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

        window.addEventListener('click', (e) =>
        {
            this.target.x = e.x - canvas.getBoundingClientRect().x
            this.target.y = e.y - canvas.getBoundingClientRect().y

            this.velocity = CreateVelocity(CreateAngle(this.x, this.y, this.target.x, this.target.y), this.speed)
            
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
        ctx.fillRect(this.x, this.y, this.size.width, this.size.height)
        ctx.fill()

        if(this.app.server.id == this.id)
        {
            ctx.lineWidth = 2
            ctx.strokeStyle = 'white'
            ctx.strokeRect(this.x, this.y, this.size.width, this.size.height)
            ctx.stroke()
        }
           
        ctx.fillStyle = 'white'
        ctx.font = `${this.size.width/2}px Arial`
        ctx.fillText(this.name, this.x + this.size.width/2 - this.name.length * this.size.width/10, this.y - this.size.height/5)
        ctx.fill()
        
            
    }

    public update(): void
    {
        this.Move()

      //  console.log(Distance({position: {x: this.x, y: this.y}}, {position: {x: this.target.x, y: this.target.y}}));
        

        // if(Distance({position: {x: this.x, y: this.y}}, {position: {x: this.target.x, y: this.target.y}}) > this.size.width/10)
        // {
        //     this.x = this.x + this.velocity.x
        //     this.y = this.y + this.velocity.y
        // }

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



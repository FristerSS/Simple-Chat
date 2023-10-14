import Circle from "./circles"
import { IServer } from "./interfaces"
import { TCircle } from "./types"
import { HideLoadingElement } from "./index"

const colors: string[] = ['red', 'green', 'blue']

class Server implements IServer
{
    private app: any
    private server: any

    constructor(app: any, server: any)
    {
        this.app = app
        this.server = server
        this.Init()
    }

    public Init(): void
    {
        this.Connection()
        this.DeletePlayer()
        this.GetPlayers()
        this.ChangePlayerPosition()
    }

    public Connection(): void
    {
        this.server.on('connect', () =>
        {   
              console.log(`Started ${this.app.name}`);
            console.log('socket connection: ' + this.server.id);

            let x = Math.random() * (window.innerWidth/2 - 0) + 0
            let y = Math.random() * (window.innerHeight/2 - 0) + 0
            let color = colors[Math.floor(Math.random() * (colors.length - 0) + 0)]
        
            Circle.Create(this.app, x, y, color, this.server.id, this.app.name)
        
            this.server.emit('newPlayer', {color, position: {x, y}, id: this.server.id, name: this.app.name})
            
            // Hide loading element when app is loaded
            HideLoadingElement()
        })
    }

    public GetPlayers(): void
    {
        this.server.on('newPlayer', ({users}: any) =>
        {
            console.log(users);
            console.log('This id: ' + this.server.id);
            
            
            for(let user of users)
            {
                if(this.app.circles.find((c: TCircle) => c.id == user.id) || user.id == this.server.id)
                    continue

                    Circle.Create(this.app, user.position.x, user.position.y, user.color, user.id, user.name)
            }
        
        })
        
    }

    public DeletePlayer(): void
    {
        
        this.server.on('deletePlayer', ({id}: {id: string}) =>
        {
            this.app.circles = this.app.circles.filter((circle: TCircle) => circle.id != id)
            console.log(this.app.circles);
            
        })
    }

    public ChangePlayerPosition(): void
    {   
        this.server.on('changePosition', ({player}: any) =>
        {
            let find = this.app.circles.find((user: TCircle) => user.id == player.id)
            

            if(!find)
                return

            find.x = player.x
            find.y = player.y
        })
    }

    public MovePayer(id: string, x: number, y: number): void
    {
        this.server.emit('changePosition', {id, x, y})
    }



}

export default Server
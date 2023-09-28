interface ICircle
{
    GetColor(): string
    EmitChangePosition(): void
    draw(ctx: CanvasRenderingContext2D): void
    update(): void
    Move(): void
}


interface IServerChat
{
    CreateMessage(name: string, text: string): void
    CheckMessagesLength(): void
    ReloadMessagesInChat(): void
    GetMessages(): void
    GetAllMessages(): void
}


interface IServer
{
    Init(): void
    Connection(): void
    GetPlayers(): void
    DeletePlayer(): void
    ChangePlayerPosition(): void
    MovePayer(id: string, x: number, y: number): void
}

interface IApp
{
    update(): void
    draw(ctx: CanvasRenderingContext2D): void
}



export {ICircle, IServerChat, IServer, IApp}
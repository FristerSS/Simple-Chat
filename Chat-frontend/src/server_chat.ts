import { IServerChat } from "./interfaces"

class ServerChat implements IServerChat 
{
    private app: any
    private server: any
    private chatElementContainer: HTMLElement
    private messagesElementContainer: HTMLElement
    private chatInput: HTMLInputElement
    private chatButtonSend: HTMLButtonElement
    private messages: {name: string, text: string}[]
    private maxMessages: number
    private actuallyMessage: string

    constructor(app: any, server: any)
    {
        this.app = app
        this.server = server
        this.chatElementContainer = document.querySelector('#chat_container')
        this.messagesElementContainer = document.querySelector('#chat_container-messages')
        this.chatInput = document.querySelector('#chat_container-message')
        this.chatButtonSend = document.querySelector('#chat_container-send')
        this.maxMessages = 25
        this.messages = []  
        this.actuallyMessage = ''

        this.chatInput.addEventListener('input', (e: any) =>
        {
            let message = e.target.value
            this.actuallyMessage = message

            console.log(message);
            
        })

        this.chatButtonSend.addEventListener('click', () =>
        {
            if(this.actuallyMessage.length < 1)
                return

            this.server.emit('newMessage', {name: this.app.name, text: this.actuallyMessage})
            this.CreateMessage(this.app.name, this.actuallyMessage)
            this.actuallyMessage = ''
            this.chatInput.value = ''

        })

        this.GetMessages()
        this.GetAllMessages()
    }

    public CreateMessage(name: string, text: string)
    {

        this.messages.push({name, text})
        this.CheckMessagesLength()
        this.ReloadMessagesInChat()
    }

    public CheckMessagesLength(): void
    {
        if(this.messages.length > this.maxMessages)
        {
            this.messages.splice(0, 1)
            this.ReloadMessagesInChat()
        }
    }

    public ReloadMessagesInChat(): void
    {
        [...this.messagesElementContainer.children].forEach(child =>
            {
                child.remove()
            })

        

        this.messages.forEach((message, i) =>
            {
                let div = document.createElement('div')
                div.classList.add('message')
                
                if(message.name === this.app.name)
                    div.style.color = 'lime'

                if(i == this.messages.length - 1)
                    div.style.animation = 'ShowMessage 0.2s ease-in'
        
                div.textContent = `${message.name}: ${message.text}`

                this.messagesElementContainer.appendChild(div)
            })
    }

    public GetMessages(): void
    {

        this.server.on('newMessage', (message: any) =>
        {
            console.log('received new message');
            console.log(message);
            
            
            this.CreateMessage(message.name, message.text)
        })
    }

    public GetAllMessages(): void
    {
        this.server.on('getMessages',({messages}: any) =>
        {
    
            this.messages = messages.map((message: any) => message)
            console.log(this.messages);

            this.ReloadMessagesInChat()
        })
        
    }
}


export default ServerChat
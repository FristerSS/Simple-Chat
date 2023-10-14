import { IServerChat } from "./interfaces"

class ServerChat implements IServerChat 
{
    private app: any
    private server: any
    private chatElementContainer: HTMLElement
    private messagesElementContainer: HTMLElement
    private chatResizeElement: HTMLElement
    private chatInput: HTMLInputElement
    private chatButtonSend: HTMLButtonElement
    private messages: {name: string, text: string}[]
    private maxMessages: number
    private actuallyMessage: string

    private resized: boolean

    private renewMessagesTimer: number
    private renewMessagesReloaded: boolean

    constructor(app: any, server: any)
    {
        this.app = app
        this.server = server
        this.chatElementContainer = document.querySelector('#chat_container')
        this.messagesElementContainer = document.querySelector('#chat_container-messages')
        this.chatResizeElement = document.querySelector('#chat_container-resize')
        this.chatInput = document.querySelector('#chat_container-message')
        this.chatButtonSend = document.querySelector('#chat_container-send')
        this.maxMessages = 13
        this.messages = []  
        this.actuallyMessage = ''

        this.resized = false

        this.renewMessagesTimer = 1000
        this.renewMessagesReloaded = false

        setTimeout(() =>
        {
            this.renewMessagesReloaded = true
        }, this.renewMessagesTimer)

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

        this.messagesElementContainer.addEventListener('scroll', (e: MessageEvent) =>
        {
            if(!(e.target instanceof HTMLElement) || !(e.target.children[0] instanceof HTMLElement))
                return

            if(!this.renewMessagesReloaded)
                return
            
            if(this.maxMessages >= this.messages.length)
                return

            if(e.target.scrollTop < e.target.children[0].offsetTop)
            {
                this.maxMessages +=  this.maxMessages + 4
                this.ReloadMessagesInChat(true)
                this.renewMessagesReloaded = false

                setTimeout(() =>
                {
                    this.renewMessagesReloaded = true
                }, this.renewMessagesTimer)
            }
            
        })

        this.chatResizeElement.addEventListener('click', () =>
        {
            if(this.resized)
            {
                this.chatElementContainer.style.height = '30vh'
                this.chatResizeElement.textContent = 'Down'
            }else
            {
                this.chatElementContainer.style.height = '20vh'
                this.chatResizeElement.textContent = 'Up'
            }

            this.resized = !this.resized
            
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

    public ReloadMessagesInChat(increaseMessages: boolean = false): void
    {
        [...this.messagesElementContainer.children].forEach(child =>
            {
                child.remove()
            })

        

        this.messages.forEach((message, i) =>
            {
                if(i < this.messages.length - this.maxMessages)
                    return


                let div = document.createElement('div')
                div.classList.add('message')
                
                if(message.name === this.app.name)
                    div.style.color = 'lime'

                if(i == this.messages.length - 1)
                    div.style.animation = 'ShowMessage 0.2s ease-in'
        
                div.textContent = `${message.name}: ${message.text}`

                this.messagesElementContainer.appendChild(div)
                
                
            })

            console.log(this.messages);
            
          if(!increaseMessages)
            this.messagesElementContainer.scrollTo({behavior: 'smooth', top: this.messagesElementContainer.offsetTop + this.messagesElementContainer.offsetHeight * 3})

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
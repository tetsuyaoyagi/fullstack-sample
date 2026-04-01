
import { useLayoutEffect, useRef, useState, memo } from 'react';
import { toTimestampFormat } from 'common/time';
import { v4 as  uuidv4} from 'uuid';
import { type MonoProperty } from './util'
import clsx from 'clsx';
import { sleep } from 'common/util';

export default function ChatArea(){
    const [msg, changeMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    const appendMessage = (message: Message) => setMessages((prev)=>[...prev, message]);

    function sendMessage(msg: string){
        console.log("send message - " + msg);
        changeMessage("");
        appendMessage(Message.my(msg));
        sleep(1000);
        //バックエンドAPI接続
        fetch("http://localhost:8080/send/text", {
            method: "POST",
            body: msg
        })
        .then((res)=>res.text().then((reply)=>appendMessage(Message.other(reply))))
        .catch(()=>appendMessage(Message.other("送信に失敗しました。")));
    }

    return (
        <div className="chat-area w-96 bg-slate-50 ">
            <ChatHistory messages={messages}/>
            <hr></hr>
            <footer className="p-4 flex items-center space-x-2">
                <input
                    className={clsx("flex-1", "border", "border-gray-300", "rounded-full", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "focus:ring-lime-500")}
                    placeholder='message' value={msg} onChange={(e)=>changeMessage(e.target.value)}
                />
                <button className={clsx(msg.trim() === "" && "hidden", "bg-lime-500", "text-white", "px-4", "py-2", "rounded-full", "hover:bg-lime-600")} onClick={()=>sendMessage(msg)}>Send</button>
            </footer>
        </div>    
    );
}

function ChatHistory({messages}: MonoProperty<'messages', Message[]>){
    const scrollBottomRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(()=>{
        scrollBottomRef?.current?.scrollIntoView();
    });
    return (
        <section className='chat-history p-2 h-96 overflow-y-auto'>
            {messages.map(msg => (<MessageItem key={msg.id} message={msg}/>))}
            <div ref={scrollBottomRef}></div>
        </section>
    )
}

class Message {
    private _id: string;
    private _text: string;
    private _createdAt: string;
    private _updatedAt: string;
    private _isMine: boolean;
    constructor(
        id: string,
        text: string,
        createdAt: string,
        updatedAt: string,
        isMine: boolean
    ) {
        this._id = id;
        this._text = text;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._isMine = isMine;
    }
    static my(text: string): Message{
        const timestamp: string = toTimestampFormat(new Date());
        return Message.from(uuidv4(), text, timestamp, timestamp, true);
    }
    static other(text: string): Message{
        const timestamp: string = toTimestampFormat(new Date());
        return Message.from(uuidv4(), text, timestamp, timestamp, false);
    }
    static from(id: string, text: string, createdAt: string, updatedAt: string, isMine: boolean): Message{
        return new Message(id, text, createdAt, updatedAt, isMine);
    }

    public get id(): string {return this._id}
    public get text(): string {return this._text}
    public get createdAt(): string {return this._createdAt}
    public get updatedAt(): string {return this._updatedAt}
    public get isMine(): boolean {return this._isMine}
    public set text(text: string){
        this._text = text;
        this._updatedAt = toTimestampFormat(new Date());
    }
    set updatedAt(updatedAt: string){this._updatedAt = updatedAt}
}

const MessageItem = memo(({message}: MonoProperty<'message', Message>)=>{
    return (
        <article className={clsx("w-full", "flex", "flex-col", "my-2")}>
            <div className={clsx("flex", "items-start", message.isMine && "justify-end")}>
                <span className={clsx("py-1", "px-2", "rounded-xl", message.isMine? "bg-lime-500" : "bg-gray-200")}>{message.text}</span>
            </div>
            <footer className={clsx("flex", "items-start", message.isMine && "justify-end")}>
                <span className={clsx("text-xs", "mt-1", message.isMine?"text-right":"text-left")}>{message.updatedAt}</span>
            </footer>
        </article>
    )
});

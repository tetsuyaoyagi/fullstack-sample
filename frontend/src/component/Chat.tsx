
import { useLayoutEffect, useRef, useState } from 'react';
import { toTimestampFormat } from 'common/time';
import { v4 as  uuidv4} from 'uuid';
import { type ComponentProperty } from './util'
import clsx from 'clsx';
import axios from 'axios';
import { sleep } from 'common/util';

function ChatArea(){
    const [msg, changeMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    const appendMessage = (message: Message) => setMessages((prev)=>[...prev, message]);

    function sendMessage(msg: string){
        console.log("send message - " + msg);
        changeMessage("");
        appendMessage(Message.my(msg));
        sleep(1000);
        //バックエンドAPI接続
        axios.post("http://localhost:8080/send/text", msg)
        .then((res)=>appendMessage(Message.other(res.data)))
        .catch(()=>appendMessage(Message.other("送信に失敗しました。")));
    }

    return (
        <div className="chat-area w-96 bg-slate-50 ">
            <ChatHistory prop={messages}/>
            <hr></hr>
            <footer className="p-4 flex items-center space-x-2">
                <input
                    className={clsx("flex-1", "border", "border-gray-300", "rounded-full", "px-4", "py-2", "focus:outline-none", "focus:ring-2", "focus:ring-lime-500")}
                    placeholder='message' value={msg} onChange={(e)=>changeMessage(e.target.value)}
                />
                <button className="bg-lime-500 text-white px-4 py-2 rounded-full hover:bg-lime-600" disabled={msg.trim() === ""} onClick={()=>sendMessage(msg)}>Send</button>
            </footer>
        </div>    
    );
}

function ChatHistory({prop}: ComponentProperty<Message[]>){
    const scrollBottomRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(()=>{
        scrollBottomRef?.current?.scrollIntoView();
    });
    return (
        <section className='chat-history p-2 h-96 overflow-y-auto'>
            {prop.map(msg => (<MessageItem key={msg.id} prop={msg}/>))}
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

function MessageItem({prop}: ComponentProperty<Message>){
    const [msg, setMsg] = useState(prop.text);
    const [timestamp, setTimestamp] = useState(prop.updatedAt);
    return (
        <article className={clsx("w-full", "flex", "flex-col", "my-2")}>
            <div className={clsx("flex", "items-start", prop.isMine && "justify-end")}>
                <span className={clsx("py-1", "px-2", "rounded-xl", prop.isMine? "bg-lime-500" : "bg-gray-200")}>{msg}</span>
            </div>
            <footer className={clsx("flex", "items-start", prop.isMine && "justify-end")}>
                <span className={clsx("text-xs", "mt-1", prop.isMine?"text-right":"text-left")}>{timestamp}</span>
            </footer>
        </article>
    )
}

export default ChatArea

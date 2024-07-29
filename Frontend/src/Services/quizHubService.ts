import * as signalR from '@microsoft/signalr';
import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { Quiz } from '../PlayPage';
import { Answer } from '../Components/PlayMenu';
import { User } from '../Context/AuthContext';

export interface Room {
    name: string,
    category: string,
    quizzesNr: number,
    quizzes: Quiz[],
    answers: { [key: number]: Answer[] },
    players: any[]
}




class QuizHubService {

    public connection: signalR.HubConnection;

    public onRoomCreated?: (room: Room) => void;
    public onRoomJoinFailed?: (message: string) => void;
    public onRoomJoined?: (room: Room) => void;
    public onPlayerJoined?: (connectionId: string) => void;
    public onGameStarted?: (room: Room) => void;
    public onRoomCreationFailed?: (message: string) => void;

    constructor() {

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7139/quizHub", {
                withCredentials: true
            })
            .configureLogging(LogLevel.Debug)
            .build();

        this.connection.on("RoomCreated", (room:Room) => {
            if (this.onRoomCreated) this.onRoomCreated(room);
        });

        this.connection.on("RoomJoinFailed", (message:string) => {
            if (this.onRoomJoinFailed) this.onRoomJoinFailed(message);
        });

        this.connection.on("RoomJoined", (room:Room) => {
            if (this.onRoomJoined) this.onRoomJoined(room);
        });

        this.connection.on("PlayerJoined", (connectionId) => {
            if (this.onPlayerJoined) this.onPlayerJoined(connectionId);
        });

        this.connection.on("GameStarted", (room:Room) => {
            if (this.onGameStarted) this.onGameStarted(room);
        });

        this.connection.on("RoomCreationFailed", (message:string) => {
            if (this.onRoomCreationFailed) this.onRoomCreationFailed(message);
        });
    }

    public async start(): Promise<void> {
        if (this.connection.state === signalR.HubConnectionState.Disconnected) {
            try {
                await this.connection.start();
                console.log('SignalR connection started');
            } catch (err) {
                console.error('SignalR connection failed to start:', err);
            }
        }
    }

    public async stop(): Promise<void> {
        if (this.connection.state !== HubConnectionState.Disconnected) {
            await this.connection.stop();
            console.log("SignalR Disconnected.");
        } else {
            console.log("SignalR Connection already stopped.");
        }
    }

    async createRoom(roomName:string, category:string, quizzesNr:number, user:User) {
        if (this.connection.state === HubConnectionState.Connected) {
            try {
                await this.connection.invoke('CreateRoom', roomName, category, quizzesNr, user);
                console.log("Room creation invoked.");
            } catch (err) {
                console.error("Error while invoking CreateRoom: ", err);
            }
        } else {
            console.error("Cannot send data; connection is not in the 'Connected' state.");
        }
    }

    async joinRoom(roomName:string) {
        await this.connection.invoke("JoinRoom", roomName);
    }

    async leaveRoom(roomName:string) {
        await this.connection.invoke("LeaveRoom", roomName);
    }
}

const quizHubService = new QuizHubService();
export default quizHubService;
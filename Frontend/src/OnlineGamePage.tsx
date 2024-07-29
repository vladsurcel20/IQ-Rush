import React, { useEffect, useState } from 'react'
import { Room } from './Services/quizHubService'
import quizHubService from './Services/quizHubService'
import OnlinePlayMenu from './Components/OnlinePlayMenu'

const OnlineGamePage = () => {

    const [rooms,setRooms] = useState<Room[]>([])
    const [createdRoom, setCreatedRoom] = useState<Room>()
    const [roomName, setRoomName] = useState<string>('')
    const [roomCategory, setRoomCategory] = useState<string>('Geography')
    const [roomQuizzesNr, setRoomQuizzesNr] = useState<number>(3)

    const [roomData, setRoomData] = useState<Room | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    let   [gameStarted, setGameStarted] = useState<boolean>(false);


    useEffect(() => {

        const startSignalRConnection = async () => {
            await quizHubService.start();
        };

        startSignalRConnection();

        quizHubService.onRoomCreated = (room: Room) => {
            setRoomData(room); 
            setGameStarted(false); 
            console.log('Room created:', room);
        };

        quizHubService.onRoomJoinFailed = (message: string) => {
            setErrorMessage(message);
            console.log('Room join failed:', message);
        };

        quizHubService.onRoomJoined = (room: Room) => {
            setRoomData(room); 
            setGameStarted(false); 
            console.log('Room joined:', room);
        };

        quizHubService.onPlayerJoined = (connectionId: string) => {
            console.log(`Player joined with connectionId: ${connectionId}`);
        };

        quizHubService.onGameStarted = (room: Room) => {
            setRoomData(room); 
            setGameStarted(true); 
            console.log('Game started:', room);
        };

        quizHubService.onRoomCreationFailed = (message: string) => {
            setErrorMessage(message);
            console.log('Room creation failed:', message);
        };

        // return () => {
        //     quizHubService.connection.stop();
        // };
    }, []);

    // const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault()
    //     if(rooms.find((r:Room) => r.name == roomName) == undefined) {
    //         if(createdRoom) setCreatedRoom({name: roomName, category: roomCategory, quizzesNr: roomQuizzesNr})
    //     } else alert('This room name already exists')
    // }

    const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        if (!rooms.some((r) => r.name === roomName)) {
            await quizHubService.createRoom(roomName, roomCategory, roomQuizzesNr, user);
        } else {
            alert('This room name already exists');
        }
    };

    const handleJoinRoom = async (roomName: string) => {
        await quizHubService.joinRoom(roomName);
    };

    const handleLeaveRoom = async (roomName:string) => {
        if (roomData) {
            await quizHubService.leaveRoom(roomName);
            setGameStarted(false);
            setRoomData(undefined);
        }
    };

    useEffect(() => {
        if(roomData)
        setRooms([...rooms, roomData])
    },[roomData])

  return (
    <div className='onlineGamePage'>
        {!gameStarted ? (
            <>
                <div className='createRoom'>
                    <form onSubmit={handleCreateRoom}>
                        <input type='text' placeholder='room name' required onChange={(e) => setRoomName(e.target.value.trim())}></input>
                        <span>
                            <select id='category' className='categorySelect' onChange={(e) => setRoomCategory(e.target.value.toLowerCase)}>
                                <option>Geography</option>
                                <option>Math</option>
                                <option>Biology</option>
                            </select>
                            <select id='quizzesNr' className='quizzesNrSelect' onChange={(e) => setRoomQuizzesNr(parseInt(e.target.value))}>
                                <option>3</option>
                                <option>5</option>
                                <option>7</option>
                            </select>
                        </span>
                        <button type='submit'>Create room</button>
                    </form>
                </div>

                <div className='availableRooms'>
                    <div>Available Rooms</div>
                    {rooms.length !== 0 ? (
                        rooms.map((r:Room) => (
                            <div className='roomContainer' key={r.name}>
                                <p>{r.name}</p>
                                <button type='button' onClick={() => handleJoinRoom(r.name)}>Join</button>
                                <button type='button' onClick={() => handleLeaveRoom(r.name)}>Leave</button>
                            </div>
                        ))
                    ):(
                        <p className='warning'>No rooms...</p>
                    )}
                </div>
            </>
        ) : roomData ? (
            <OnlinePlayMenu room={roomData}/>
        ) : null}
    </div>
  )
}

export default OnlineGamePage
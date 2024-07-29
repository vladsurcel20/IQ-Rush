using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using QuizApp.Services;
using QuizApp.Models;
using System.Numerics;
namespace QuizApp.Hubs
{
    public class QuizHub : Hub
    {
        private readonly UsersService _usersService;
        private readonly AnswersService _answersService;
        private readonly QuizzesService _quizzesService;

        public QuizHub(UsersService usersService, AnswersService answersService, QuizzesService quizzesService)
        {
            _usersService = usersService;
            _answersService = answersService;
            _quizzesService = quizzesService;
        }

        private static Dictionary<string, Room> Rooms = new Dictionary<string, Room>();

        public async Task CreateRoom(string roomName, string category, int quizzesNr, Users userData)
        {
            if (Rooms.ContainsKey(roomName))
            {
                await Clients.Caller.SendAsync("RoomCreationFailed", "Room already exists.");
                return;
            }

            var room = new Room
            {
                Name = roomName,
                Category = category,
                QuizzesNr = quizzesNr
            };

            var quizzes = _quizzesService.GetByCategory(category)
                                         .OrderBy(q => Guid.NewGuid()) 
                                         .Take(quizzesNr)
                                         .ToList();

            if (quizzes.Count < quizzesNr)
            {
                await Clients.Caller.SendAsync("RoomCreationFailed", "Not enough quizzes in the selected category.");
                return;
            }

            room.Quizzes.AddRange(quizzes);

            foreach (var quiz in quizzes)
            {
                var answers = _answersService.GetByQuizId(quiz.Id);
                room.Answers.Add(quiz.Id, answers);
            }

            Rooms.TryAdd(roomName, room);

            var user = _usersService.GetByUsername(userData.Username);
            var player = new Players
            {
                UserId = user.Id,
                ConnectionId = Context.ConnectionId
            };
            room.AddPlayer(player);

            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
            await Clients.Caller.SendAsync("RoomCreated", room);
            await Clients.Caller.SendAsync("RoomJoined", room);
        }

        public async Task JoinRoom(string roomName)
        {
            if (!Rooms.TryGetValue(roomName, out var room))
            {
                await Clients.Caller.SendAsync("RoomJoinFailed", "Room does not exist.");
                return;
            }

            var user = _usersService.GetByUsername(Context.User.Identity.Name);
            var player = new Players
            {
                UserId = user.Id,
                ConnectionId = Context.ConnectionId
            };
            room.AddPlayer(player);

            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
            await Clients.Caller.SendAsync("RoomJoined", room);
            await Clients.Group(roomName).SendAsync("PlayerJoined", Context.ConnectionId);

            if (room.IsFull)
            {
                await Clients.Group(roomName).SendAsync("GameStarted", room);
            }
        }

        private async Task StartGame(string roomName)
        {
            if (!Rooms.ContainsKey(roomName))
            {
                await Clients.Caller.SendAsync("StartGameFailed", "Room does not exist.");
                return;
            }

            Room room = Rooms[roomName];
            await Clients.Group(roomName).SendAsync("GameStarted", room.Quizzes, room.Answers);
        }

        public async Task SubmitAnswer(string roomName, int quizId, int answerId)
        {
            if (!Rooms.ContainsKey(roomName))
            {
                await Clients.Caller.SendAsync("SubmitAnswerFailed", "Room does not exist.");
                return;
            }

            Room room = Rooms[roomName];
            Answers answer = _answersService.Get(answerId);
            bool isCorrect = answer != null && answer.IsCorrect;
            await Clients.Group(roomName).SendAsync("AnswerSubmitted", Context.ConnectionId, quizId, isCorrect);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var room = Rooms.Values.FirstOrDefault(r => r.Players.Any(p => p.ConnectionId == Context.ConnectionId));
            if (room != null)
            {
                var player = room.Players.FirstOrDefault(p => p.ConnectionId == Context.ConnectionId);
                if (player != null)
                {
                    room.Players.Remove(player);
                    if (room.Players.Count == 0)
                    {
                        Rooms.Remove(room.Name);
                    }
                    await Clients.Group(room.Name).SendAsync("PlayerLeft", Context.ConnectionId);
                }
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task LeaveRoom(string roomName)
        {
            if (Rooms.TryGetValue(roomName, out var room))
            {
                var player = room.Players.FirstOrDefault(p => p.ConnectionId == Context.ConnectionId);
                if (player != null)
                {
                    room.Players.Remove(player);
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
                    if (room.Players.Count == 0)
                    {
                        Rooms.Remove(roomName, out _);
                    }
                    await Clients.Group(roomName).SendAsync("PlayerLeft", Context.ConnectionId);
                }
            }
        }
    }
}

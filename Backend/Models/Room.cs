using System.Collections.Generic;
using System.Numerics;
using QuizApp.Models;
namespace QuizApp.Models
{
    public class Room
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public int QuizzesNr { get; set; }
        public List<Quizzes> Quizzes { get; set; }
        public Dictionary<int, List<Answers>> Answers { get; set; }
        public List<Players> Players { get; set; }

        public Room()
        {
            Players = new List<Players>();
            Quizzes = new List<Quizzes>();
            Answers = new Dictionary<int, List<Answers>>();
        }

        public bool IsFull => Players.Count == 2;

        public void AddPlayer(Players player)
        {
            if (!IsFull)
            {
                Players.Add(player);
            }
        }

        public bool AllPlayersReady()
        {
            return Players.All(p => p.IsReady);
        }
    }
}


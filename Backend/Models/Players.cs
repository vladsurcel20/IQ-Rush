namespace QuizApp.Models
{
    public class Players
    {
        public int UserId { get; set; } 
        public string ConnectionId { get; set; }
        public int Points { get; set; }
        public bool IsReady { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace QuizApp.Models
{
    public class Users
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public DateOnly RegisteredAt { get; set; }

        public int Points { get; set; }

        public int QuizzesDone { get; set; }


    }
}

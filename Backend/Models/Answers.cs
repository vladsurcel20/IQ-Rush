using System.ComponentModel.DataAnnotations;

namespace QuizApp.Models
{
    public class Answers
    {
        public int Id { get; set; }

        [Required]
        public int QuizId { get; set; }

        [Required]
        public string Answer { get; set; }

        [Required]
        public bool IsCorrect { get; set; }
    }
}

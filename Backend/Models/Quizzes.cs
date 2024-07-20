using System.ComponentModel.DataAnnotations;

namespace QuizApp.Models
{
    public class Quizzes
    {
        public int Id { get; set; }

        [Required]
        public string Question { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        public string Type { get; set; }
    }
}

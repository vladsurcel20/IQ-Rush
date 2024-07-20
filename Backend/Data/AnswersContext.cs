using Microsoft.EntityFrameworkCore;
using QuizApp.Models;
namespace QuizApp.Data
{
    public class AnswersContext : DbContext
    {
        public DbSet<Answers> Answers { get; set; }

        public string ConnectionString { get; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=QuizAppDB;Trusted_Connection=True; TrustServerCertificate=True;");
            base.OnConfiguring(optionsBuilder);

        }
    }
}

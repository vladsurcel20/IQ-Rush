using Microsoft.EntityFrameworkCore;
using QuizApp.Models;

namespace QuizApp.Data
{
    public class UsersContext : DbContext
    {
        public DbSet<Users> Users { get; set; }

        public string ConnectionString { get; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=QuizAppDB;Trusted_Connection=True; TrustServerCertificate=True;");
            base.OnConfiguring(optionsBuilder);

        }
    }
}

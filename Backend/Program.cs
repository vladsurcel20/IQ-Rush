using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using QuizApp.Data;
using QuizApp.Services;
using QuizApp.Hubs;
namespace QuizzApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "https://localhost:7139",
                    ValidAudience = "http://localhost:5173",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("scooby-doo-where-are-you-secure-key"))
                };
            });

            builder.Services.AddAuthorization();


            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5173")
                              .WithMethods("GET", "POST", "PUT", "DELETE")
                              .AllowAnyHeader()
                              .AllowCredentials();
                    });
            });

            /*            builder.WebHost.UseUrls("http://0.0.0.0:5086", "https://0.0.0.0:7140", "http://localhost:5085", "https://localhost:7139");*/


            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<UsersService>();
            builder.Services.AddDbContext<UsersContext>();
            builder.Services.AddDbContext<QuizzesContext>();  
            builder.Services.AddScoped<QuizzesService>();
            builder.Services.AddDbContext<AnswersContext>();
            builder.Services.AddScoped<AnswersService>();
            builder.Services.AddSignalR();
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();
            app.MapHub<QuizHub>("/quizHub");

            app.Run();
        }
    }
}

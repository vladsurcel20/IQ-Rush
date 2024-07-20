using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using QuizApp.Data;
using QuizApp.Models;
namespace QuizApp.Services
{
    public class QuizzesService
    {
        private readonly QuizzesContext _quizzesContext;

        public QuizzesService(QuizzesContext context)
        {
            _quizzesContext = context;
        }

        public bool IsIdUsed(int id)
        {
            if (_quizzesContext.Quizzes.FirstOrDefault(q => q.Id == id) == null) return false;
            else return true;
        }

        /* DE GANDIT LA IMPLEMENTARE*/
        public bool IsQuestionUnique(string question)
        {
            if (_quizzesContext.Quizzes.FirstOrDefault(q => q.Question == question) == null ) return true;
            else return false;
        }

        public List<Quizzes> GetAll()
        {
            return _quizzesContext.Quizzes.ToList();
        }

        public Quizzes GetById(int id)
        {
            return _quizzesContext.Quizzes.ToList().FirstOrDefault(q => q.Id == id);
        }

        public List<Quizzes> GetByCategory(string category)
        {
            return _quizzesContext.Quizzes.ToList().FindAll(q => q.Category == category);
        }

        public List<Quizzes> GetByType(string type)
        {
            return _quizzesContext.Quizzes.ToList().FindAll(q => q.Type == type);
        }


        public void Add(Quizzes quiz)
        {
            _quizzesContext.Add(quiz);
            _quizzesContext.SaveChanges();
        }

        public void Remove(int id)
        {
            Quizzes foundQuiz = _quizzesContext.Quizzes.FirstOrDefault(q => q.Id == id);
            _quizzesContext.Remove(foundQuiz);
            _quizzesContext.SaveChanges();
        }

        public void Update(Quizzes newQuiz)
        {
            Quizzes quiz = _quizzesContext.Quizzes.FirstOrDefault(q => q.Id == newQuiz.Id);
            _quizzesContext.Remove(quiz);
            _quizzesContext.Add(newQuiz);
            _quizzesContext.SaveChanges();
        }
    }
}

using QuizApp.Models;
using QuizApp.Data;
using Microsoft.AspNetCore.Http.HttpResults;
namespace QuizApp.Services
{
    public class AnswersService
    {
        private readonly AnswersContext _answersContext;

        public AnswersService(AnswersContext context)
        {
            _answersContext = context;
        }

        public bool isOnlyOneCorrect(int quizId)
        {
            List<Answers> answerList = _answersContext.Answers.ToList().FindAll(a => a.QuizId == quizId);
            int count = 0;
            foreach (var answer in answerList)
            {
                if (answer.IsCorrect == true)
                {
                    count++;
                }
            }
            if (count > 1)
            {
                return false;
            }
            return true;
        }

        public bool IsIdUsed(int id)
        {
            if (_answersContext.Answers.FirstOrDefault(a => a.Id == id) == null) return false;
            else return true;
        }

        public Answers Get(int id)
        {
            return _answersContext.Answers.ToList().FirstOrDefault(a => a.Id == id); 
        }

        public List<Answers> GetByQuizId(int quizId)
        {
            return _answersContext.Answers.ToList().FindAll(a => a.QuizId == quizId);
        }

        public void Add(Answers answer)
        {
            _answersContext.Answers.Add(answer);
            _answersContext.SaveChanges();
        }

        public void Remove(int id)
        {
            Answers foundAnswer = _answersContext.Answers.FirstOrDefault(a => a.Id == id);
            _answersContext.Answers.Remove(foundAnswer);
            _answersContext.SaveChanges();
        }

        public void Update(Answers newAnswer)
        {
            Answers answer = _answersContext.Answers.FirstOrDefault(a => a.Id == newAnswer.Id);
            _answersContext.Answers.Remove(answer);
            _answersContext.Add(newAnswer);
            _answersContext.SaveChanges();
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using QuizApp.Models;
using QuizApp.Services;
namespace QuizApp.Controllers
{
    [ApiController]
    [Route("api/quizzes")]
    public class QuizzesController : ControllerBase
    {
        private readonly QuizzesService _quizzesService;

        public QuizzesController(QuizzesService quizzesService)
        {
            _quizzesService = quizzesService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_quizzesService.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            if (!_quizzesService.IsIdUsed(id))
            {
                return BadRequest("Invalid Id");
            }
            return Ok(_quizzesService.GetById(id));
        }

        [HttpGet("category/{category}")]
        public IActionResult Get(string category)
        {
            if (_quizzesService.IsCategoryValid(category))
            {
                return Ok(_quizzesService.GetByCategory(category));
            }
            return BadRequest("No quizzes in this category");
        }

        [HttpGet("type/{type}")]
        public IActionResult GetByType(string type)
        {
            return Ok(_quizzesService.GetByType(type));
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            if (_quizzesService.IsIdUsed(id))
            {
                _quizzesService.Remove(id);
                return Ok();
            }
            return BadRequest("Invalid Id");
        }

        [HttpPost]
        public IActionResult Post(Quizzes quiz)
        {
            if (!_quizzesService.IsQuestionUnique(quiz.Question))
            {
                return BadRequest("Quiz already registered");
            }
            _quizzesService.Add(quiz);
            return Ok();
        }

        [HttpPut]
        public IActionResult Put(Quizzes quiz)
        {
            if (_quizzesService.IsIdUsed(quiz.Id) == false)
            {
                return BadRequest("Quiz not found");
            }
           /* if (!_quizzesService.IsQuestionUnique(quiz.Question))
            {
                return BadRequest("Quiz already registered");
            }*/
            _quizzesService.Update(quiz);
            return Ok();
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using QuizApp.Models;
using QuizApp.Services;
namespace QuizApp.Controllers
{
    [ApiController]
    [Route("answers")]
    public class AnswersController : ControllerBase
    {
        private readonly AnswersService _answersService;

        public AnswersController(AnswersService answersService)
        {
            _answersService = answersService;
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            if (!_answersService.IsIdUsed(id)) return BadRequest("Invalid Id");
            return Ok(_answersService.Get(id));
        }

        [HttpGet("getByQuiz/{quizId}")]
        public IActionResult GetByQuizId(int quizId)
        {
            return Ok(_answersService.GetByQuizId(quizId));
        }

        [HttpPost]
        public IActionResult Post(Answers answer)
        {
            _answersService.Add(answer);
            if(_answersService.isOnlyOneCorrect(answer.QuizId) == false)
            {
                return BadRequest("Correct answers limit is 1");
            }
            return Ok();
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {   
            if(_answersService.IsIdUsed(id) == false)
            {
                return BadRequest("Invalid Id");
            }
            _answersService.Remove(id);
            return Ok();
        }

        [HttpPut]
        public IActionResult Put(Answers answer)
        {
            if (!_answersService.IsIdUsed(answer.Id))
            {
                return BadRequest("Invalid Id");
            }
            _answersService.Update(answer);
            return Ok();
        }

    }
}

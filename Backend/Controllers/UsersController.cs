using QuizApp.Services;
using QuizApp.Models;
using Microsoft.AspNetCore.Mvc;
namespace QuizApp.Controllers
{

    [ApiController]
    [Route("api/users")]

    public class UsersController : ControllerBase
    {


        private readonly UsersService _usersService;

        public UsersController(UsersService usersService)
        {
            _usersService = usersService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_usersService.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {

            if (_usersService.IsIdUsed(id) == false)
            {
                return BadRequest("User not found");
            }
            return Ok(_usersService.GetById(id));
        }

        [HttpPost]
        public IActionResult Post(Users user)
        {
            if (!_usersService.IsUsernameUnique(user.Username))
            {
                return BadRequest("Username already used");
            }
            if (user.RegisteredAt == DateOnly.MinValue)
            {
                user.RegisteredAt = DateOnly.FromDateTime(DateTime.UtcNow);
            }
            _usersService.Add(user);
            return Ok();
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            if (_usersService.IsIdUsed(id))
            {
                _usersService.Remove(id);
                return Ok();
            }
            return BadRequest("Invalid Id");
        }


        [HttpPut]
        public IActionResult Put(Users user)
        {
            if (_usersService.IsIdUsed(user.Id) == false)
            {
                return BadRequest("User not found");
            }
            if (!_usersService.IsUsernameUnique(user.Username))
            {
                return BadRequest("Username already used");
            }
            _usersService.Update(user);
            return Ok();
        }
    }
}

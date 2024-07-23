using QuizApp.Services;
using QuizApp.Models;
using Microsoft.AspNetCore.Mvc;
using Azure.Identity;
using Microsoft.AspNetCore.Identity.Data;
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

        [HttpGet("username/{username}")]
        public IActionResult GetByUsername(string username)
        {
            if (_usersService.GetByUsername(username) == null) {
                return BadRequest("Incorrect username");
            }
            else return Ok(_usersService.GetByUsername(username));
        }

        [HttpPost("signup")]
        public IActionResult Post([FromBody ] Users user)
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

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            var user = _usersService.Authenticate(loginRequest.Username, loginRequest.Password);

            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }

            // Generate a token (in a real application)
            var token = "dummy-token"; // Replace with actual token generation logic

            return Ok(new { Token = token });
        }

        public class LoginRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
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

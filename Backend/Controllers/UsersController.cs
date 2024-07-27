using QuizApp.Services;
using QuizApp.Models;
using Microsoft.AspNetCore.Mvc;
using Azure.Identity;
using Microsoft.AspNetCore.Identity.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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

       /* [Authorize]*/
        [HttpGet("user-data")]
        public IActionResult GetUserData()
        {
            Console.WriteLine(JwtRegisteredClaimNames.Sub);
            var username = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (username == null)
            {
                return Unauthorized("User is not authorized.");
            }

            var user = _usersService.GetByUsername(username);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
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

            var token = _usersService.GenerateJwtToken(user);

        /*    var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddHours(1)
            };

            Response.Cookies.Append("jwt", token, cookieOptions);*/

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


        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Users user)
        {
            if (_usersService.IsIdUsed(id) == false)
            {
                return NotFound("User not found");
            }
                
            if(_usersService.duplicateUsername(user.Username) == true)
            {
                return BadRequest("Username already used");
            }
            _usersService.Update(id, user);
            return Ok();
        }
    }
}

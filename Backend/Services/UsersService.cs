using QuizApp.Models;
using QuizApp.Data;
namespace QuizApp.Services
{
    public class UsersService
    {
        private readonly UsersContext _usersContext;

        public UsersService (UsersContext context)
        {
            _usersContext = context;
        }

        public bool IsIdUsed(int id)
        {
            if (_usersContext.Users.FirstOrDefault(u => u.Id == id) == null) return false;
            else return true;
        }

        public bool IsUsernameUnique(string username)
        {
            if(_usersContext.Users.FirstOrDefault(u => u.Username == username) == null) return true;
            else return false;
        }

        public List<Users> GetAll()
        {
            return _usersContext.Users.ToList();
        }

        public Users GetById(int id)
        {
            return _usersContext.Users.ToList().FirstOrDefault(user => user.Id == id);
        }

        public List<Users> FindByName(string username)
        {
            return _usersContext.Users.ToList().FindAll(u => u.Username == username);      
        }

        public void Add(Users user)
        {
            _usersContext.Add(user);
            _usersContext.SaveChanges();
        }

        public void Remove(int id)
        {
            Users foundUser = _usersContext.Users.FirstOrDefault(u => u.Id == id);
            _usersContext.Remove(foundUser);
            _usersContext.SaveChanges();
        }

        public void Update(Users newUser)
        {
            Users user = _usersContext.Users.FirstOrDefault(u => u.Id == newUser.Id);

            _usersContext.Remove(user);
            _usersContext.Add(newUser);
            _usersContext.SaveChanges();

        }
    }
}

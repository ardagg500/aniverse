using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using aniverse_backend.Data;
using aniverse_backend.Models;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace aniverse_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        public class AuthRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new { message = "Bu kullanıcı adı zaten alınmış." });
            }

            var user = new User
            {
                Username = request.Username,
                PasswordHash = HashPassword(request.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kayıt başarılı", user = new { user.Id, user.Username, user.Tier, user.Initial } });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest request)
        {
            if (string.IsNullOrWhiteSpace(request?.Username) || string.IsNullOrWhiteSpace(request?.Password))
            {
                return BadRequest(new { success = false, message = "Lütfen kullanıcı adı ve şifrenizi girin." });
            }

            var username = request.Username.Trim();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());

            if (user == null || (user.PasswordHash != HashPassword(request.Password) && user.PasswordHash != request.Password))
            {
                return Unauthorized(new { success = false, message = "Hatalı Şifre" });
            }

            return Ok(new { success = true, message = "Giriş başarılı", user = new { id = user.Id, username = user.Username, initial = user.Initial, role = user.Username.ToLower() == "admin" ? "admin" : "user" } });
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
    }
}

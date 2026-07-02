using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using aniverse_backend.Data;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace aniverse_backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly AppDbContext _context;

        public AccountController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Account/Login")]
        public IActionResult Login()
        {
            return PhysicalFile(System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "wwwroot", "auth.html"), "text/html");
        }

        [HttpPost]
        [Route("Account/Login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (string.IsNullOrWhiteSpace(model?.Username) || string.IsNullOrWhiteSpace(model?.Password))
            {
                return BadRequest(new { success = false, message = "Lütfen kullanıcı adı ve şifrenizi girin." });
            }

            var username = model.Username.Trim();
            var password = model.Password;
            var hashed = HashPassword(password);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());

            if (user == null || (user.PasswordHash != hashed && user.PasswordHash != password))
            {
                // Requirement 1: Kullanıcı adı ve şifre veritabanı ile eşleşmiyorsa oturum açılmasına kesinlikle izin verme ve ekrana 'Hatalı Şifre' uyarısı fırlat
                return Unauthorized(new { success = false, message = "Hatalı Şifre" });
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Username.ToLower() == "admin" ? "admin" : "user")
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties { IsPersistent = true };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

            return Ok(new { 
                success = true, 
                message = "Giriş başarılı", 
                user = new { 
                    id = user.Id, 
                    username = user.Username, 
                    initial = user.Initial, 
                    role = user.Username.ToLower() == "admin" ? "admin" : "user" 
                } 
            });
        }

        [HttpPost]
        [Route("Account/Logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { success = true });
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return System.BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
    }

    public class LoginViewModel
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}

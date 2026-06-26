using System.ComponentModel.DataAnnotations;

namespace aniverse_backend.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Username { get; set; }
        
        [Required]
        public string PasswordHash { get; set; }
        
        public string Tier { get; set; } = "Kayıtlı Üye"; // Misafir, Kayıtlı Üye, Premium
        
        public string Initial => Username?.Substring(0, 1).ToUpper() ?? "U";
    }
}

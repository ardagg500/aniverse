using System.ComponentModel.DataAnnotations;

namespace aniverse_backend.Models
{
    public class ScheduleItem
    {
        public int Id { get; set; }
        public int AnimeId { get; set; }
        public string AnimeTitle { get; set; } = string.Empty;
        public string Day { get; set; } = "Pazartesi";
        public string Time { get; set; } = "20:00";
        public string? ImageUrl { get; set; }
        public string? Genres { get; set; }
    }
}

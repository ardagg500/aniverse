namespace aniverse_backend.Models
{
    public class Episode
    {
        public int Id { get; set; }
        public int AnimeId { get; set; }
        public int EpisodeNumber { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public string Duration { get; set; }
        public string VideoUrl { get; set; }
        
        public Anime Anime { get; set; }
    }
}

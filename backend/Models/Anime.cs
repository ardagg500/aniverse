using System.Collections.Generic;

namespace aniverse_backend.Models
{
    public class Anime
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string Rating { get; set; }
        public string Tags { get; set; } // Comma separated, e.g., "Aksiyon,Fantastik"
        public string Studio { get; set; } = "MAPPA";
        public int ReleaseYear { get; set; } = 2026;
        public string Genres { get; set; } = "Aksiyon,Fantastik";
        
        public List<Episode> Episodes { get; set; } = new List<Episode>();
    }
}

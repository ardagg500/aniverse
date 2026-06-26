using Microsoft.EntityFrameworkCore;
using aniverse_backend.Models;
using System.Collections.Generic;

namespace aniverse_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Anime> Animes { get; set; }
        public DbSet<Episode> Episodes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed Mock Data from Data.js
            modelBuilder.Entity<Anime>().HasData(
                new Anime { Id = 1, Title = "Demon Slayer", Description = "Kılıç ustalarının epik mücadelesi.", ImageUrl = "https://images.unsplash.com/photo-1601850494422-3fb19e13b87b?q=80&w=2070&auto=format&fit=crop", Rating = "9.8", Tags = "Aksiyon,Fantastik", Studio = "Ufotable", ReleaseYear = 2019, Genres = "Aksiyon,Fantastik" },
                new Anime { Id = 2, Title = "Jujutsu Kaisen", Description = "Lanetler ve büyücülerin savaşı.", ImageUrl = "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1974&auto=format&fit=crop", Rating = "9.5", Tags = "Karanlık,Aksiyon", Studio = "MAPPA", ReleaseYear = 2020, Genres = "Aksiyon,Doğaüstü" },
                new Anime { Id = 3, Title = "Solo Leveling", Description = "En zayıftan en güçlü avcıya...", ImageUrl = "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2071&auto=format&fit=crop", Rating = "9.9", Tags = "Aksiyon,RPG", Studio = "A-1 Pictures", ReleaseYear = 2024, Genres = "Aksiyon,Macera" },
                new Anime { Id = 4, Title = "Attack on Titan", Description = "İnsanlığın devlerle olan savaşı.", ImageUrl = "https://images.unsplash.com/photo-1578632284992-04533e4b0c2d?q=80&w=2070&auto=format&fit=crop", Rating = "9.9", Tags = "Dram,Aksiyon", Studio = "WIT Studio", ReleaseYear = 2013, Genres = "Dram,Aksiyon,Gizem" }
            );

            modelBuilder.Entity<Episode>().HasData(
                new Episode { Id = 1, AnimeId = 1, EpisodeNumber = 1, Title = "Zalimlik", Duration = "24m", ImageUrl = "https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?q=80&w=2072&auto=format&fit=crop", VideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4" },
                new Episode { Id = 2, AnimeId = 1, EpisodeNumber = 2, Title = "Eğitmen Sakonji", Duration = "24m", ImageUrl = "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?q=80&w=2090&auto=format&fit=crop", VideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4" },
                new Episode { Id = 3, AnimeId = 3, EpisodeNumber = 1, Title = "En Zayıf Avcı", Duration = "24m", ImageUrl = "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2071&auto=format&fit=crop", VideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4" }
            );
        }
    }
}

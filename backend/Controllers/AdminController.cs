using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using aniverse_backend.Data;
using aniverse_backend.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace aniverse_backend.Controllers
{
    [Route("api/[controller]")]
    [Route("Admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard")]
        [HttpGet("GetStats")]
        [HttpGet("GetDashboardStats")]
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                int totalUsers = await _context.Users.CountAsync();
                int premiumUsers = 154; // Mock premium subscribers count

                int totalAnimes = await _context.Animes.CountAsync();
                int totalEpisodes = await _context.Episodes.CountAsync();

                return Ok(new
                {
                    totalUsers = totalUsers,
                    TotalUsers = totalUsers,
                    count = totalUsers,
                    premiumUsers = premiumUsers,
                    PremiumUsers = premiumUsers,
                    totalAnimes = totalAnimes,
                    totalEpisodes = totalEpisodes
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Veritabanı Hatası", error = ex.Message });
            }
        }

        [HttpGet("schedule")]
        [HttpGet("ReleaseCalendar")]
        public async Task<IActionResult> GetReleaseCalendar()
        {
            var schedule = await _context.ScheduleItems.ToListAsync();
            var dayOrder = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
            {
                { "Pazartesi", 1 }, { "Salı", 2 }, { "Çarşamba", 3 }, { "Perşembe", 4 },
                { "Cuma", 5 }, { "Cumartesi", 6 }, { "Pazar", 7 }
            };

            var sorted = schedule.OrderBy(s => dayOrder.ContainsKey(s.Day) ? dayOrder[s.Day] : 99)
                                 .ThenBy(s => s.Time)
                                 .Select(s => new {
                                     id = s.Id,
                                     animeId = s.AnimeId,
                                     title = s.AnimeTitle,
                                     day = s.Day,
                                     time = s.Time,
                                     imageUrl = s.ImageUrl,
                                     genres = s.Genres
                                 });

            return Ok(sorted);
        }

        [HttpPost("schedule")]
        public async Task<IActionResult> AddSchedule([FromBody] CreateScheduleDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Day) || dto.AnimeId <= 0)
                return BadRequest(new { success = false, message = "Eksik bilgi" });

            var anime = await _context.Animes.FindAsync(dto.AnimeId);
            if (anime == null) return NotFound(new { success = false, message = "Anime bulunamadı" });

            var item = new ScheduleItem
            {
                AnimeId = anime.Id,
                AnimeTitle = anime.Title,
                Day = dto.Day.Trim(),
                Time = !string.IsNullOrWhiteSpace(dto.Time) ? dto.Time.Trim() : "20:00",
                ImageUrl = anime.ImageUrl,
                Genres = anime.Genres
            };

            _context.ScheduleItems.Add(item);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, id = item.Id });
        }

        [HttpDelete("schedule/{id}")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            var item = await _context.ScheduleItems.FindAsync(id);
            if (item != null)
            {
                _context.ScheduleItems.Remove(item);
                await _context.SaveChangesAsync();
            }
            return Ok(new { success = true });
        }

        [HttpGet("genres-count")]
        public async Task<IActionResult> GetGenresCount()
        {
            var allAnimes = await _context.Animes.ToListAsync();
            var genreNames = new[] { "Aksiyon", "Romantik", "Bilim Kurgu", "Fantastik", "Macera", "Dram", "Komedi", "Gizem", "Doğaüstü", "Mecha", "Spor", "Oyun" };

            var result = genreNames.Select(g => new {
                name = g,
                count = allAnimes.Count(a => (!string.IsNullOrEmpty(a.Genres) && a.Genres.Contains(g)) || (!string.IsNullOrEmpty(a.Tags) && a.Tags.Contains(g)))
            });

            return Ok(result);
        }

        [HttpPost("sync-anime")]
        [HttpPost("anime")]
        [HttpPost("AddAnime")]
        public async Task<IActionResult> SyncAnime([FromBody] CreateAnimeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Eksik veya geçersiz form verisi" });

            try
            {
                var existing = await _context.Animes.FirstOrDefaultAsync(a => a.Title == dto.Title);
                if (existing == null)
                {
                    var anime = new Anime
                    {
                        Title = dto.Title,
                        Description = dto.Description ?? "Açıklama belirtilmedi.",
                        ImageUrl = dto.ImageUrl ?? "assets/poster1.jpg",
                        Rating = dto.Rating ?? "8.5",
                        Tags = dto.Genres ?? "Aksiyon",
                        Studio = dto.Studio ?? "MAPPA",
                        ReleaseYear = dto.ReleaseYear > 0 ? dto.ReleaseYear : 2026,
                        Genres = dto.Genres ?? "Aksiyon"
                    };

                    _context.Animes.Add(anime);
                    await _context.SaveChangesAsync();
                    return Ok(new { success = true, animeId = anime.Id, message = "Anime başarıyla veritabanına eklendi." });
                }

                return Ok(new { success = true, animeId = existing.Id, message = "Anime zaten mevcut, senkronize edildi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }

    public class CreateAnimeDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Rating { get; set; }
        public string? Studio { get; set; }
        public int ReleaseYear { get; set; }
        public string? Genres { get; set; }
    }

    public class CreateScheduleDto
    {
        public int AnimeId { get; set; }
        public string Day { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using aniverse_backend.Data;
using System.Threading.Tasks;
using System.Linq;

namespace aniverse_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnimeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnimeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAnimes()
        {
            var animes = await _context.Animes.Include(a => a.Episodes).ToListAsync();
            return Ok(animes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAnime(int id)
        {
            var anime = await _context.Animes.Include(a => a.Episodes).FirstOrDefaultAsync(a => a.Id == id);
            
            if (anime == null)
            {
                return NotFound();
            }

            return Ok(anime);
        }
    }
}

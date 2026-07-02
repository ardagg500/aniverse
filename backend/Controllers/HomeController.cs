using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace aniverse_backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly IWebHostEnvironment _env;

        public HomeController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [Route("")]
        [Route("index.html")]
        [Route("Home/Index")]
        public IActionResult Index()
        {
            var indexPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "index.html");
            if (System.IO.File.Exists(indexPath))
            {
                return PhysicalFile(indexPath, "text/html");
            }
            return NotFound("index.html bulunamadı.");
        }

        [Route("speedtest")]
        [Route("speedtest.html")]
        [Route("Home/SpeedTest")]
        public IActionResult SpeedTest()
        {
            return View();
        }

        [Route("collections")]
        [Route("collections.html")]
        [Route("Home/Collections")]
        public IActionResult Collections()
        {
            return View();
        }
    }
}

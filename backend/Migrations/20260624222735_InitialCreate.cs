using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace aniverse_backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Animes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    Rating = table.Column<string>(type: "TEXT", nullable: false),
                    Tags = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Animes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Tier = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Episodes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AnimeId = table.Column<int>(type: "INTEGER", nullable: false),
                    EpisodeNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    Duration = table.Column<string>(type: "TEXT", nullable: false),
                    VideoUrl = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Episodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Episodes_Animes_AnimeId",
                        column: x => x.AnimeId,
                        principalTable: "Animes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Animes",
                columns: new[] { "Id", "Description", "ImageUrl", "Rating", "Tags", "Title" },
                values: new object[,]
                {
                    { 1, "Kılıç ustalarının epik mücadelesi.", "https://images.unsplash.com/photo-1601850494422-3fb19e13b87b?q=80&w=2070&auto=format&fit=crop", "9.8", "Aksiyon,Fantastik", "Demon Slayer" },
                    { 2, "Lanetler ve büyücülerin savaşı.", "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1974&auto=format&fit=crop", "9.5", "Karanlık,Aksiyon", "Jujutsu Kaisen" },
                    { 3, "En zayıftan en güçlü avcıya...", "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2071&auto=format&fit=crop", "9.9", "Aksiyon,RPG", "Solo Leveling" },
                    { 4, "İnsanlığın devlerle olan savaşı.", "https://images.unsplash.com/photo-1578632284992-04533e4b0c2d?q=80&w=2070&auto=format&fit=crop", "9.9", "Dram,Aksiyon", "Attack on Titan" }
                });

            migrationBuilder.InsertData(
                table: "Episodes",
                columns: new[] { "Id", "AnimeId", "Duration", "EpisodeNumber", "ImageUrl", "Title", "VideoUrl" },
                values: new object[,]
                {
                    { 1, 1, "24m", 1, "https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?q=80&w=2072&auto=format&fit=crop", "Zalimlik", "https://www.w3schools.com/html/mov_bbb.mp4" },
                    { 2, 1, "24m", 2, "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?q=80&w=2090&auto=format&fit=crop", "Eğitmen Sakonji", "https://www.w3schools.com/html/mov_bbb.mp4" },
                    { 3, 3, "24m", 1, "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2071&auto=format&fit=crop", "En Zayıf Avcı", "https://www.w3schools.com/html/mov_bbb.mp4" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_AnimeId",
                table: "Episodes",
                column: "AnimeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Episodes");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Animes");
        }
    }
}

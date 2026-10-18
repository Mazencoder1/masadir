using System.Text.Json.Serialization;

namespace Masadir.Models;

public class Star
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    [JsonIgnore]
    public Project? Project { get; set; }
    public int UserId { get; set; }
    [JsonIgnore]
    public User? User { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

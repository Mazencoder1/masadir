using System.Text.Json.Serialization;

namespace Masadir.Models;

public class Project
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RepoUrl { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty; // primary language/tag
    public string License { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty; // comma-separated
    public bool IsRemoved { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int OwnerId { get; set; }
    [JsonIgnore]
    public User? Owner { get; set; }

    [JsonIgnore]
    public List<Star> Stars { get; set; } = new();
    [JsonIgnore]
    public List<Comment> Comments { get; set; } = new();
}

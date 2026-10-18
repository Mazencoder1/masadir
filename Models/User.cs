using System.Text.Json.Serialization;

namespace Masadir.Models;

public enum UserRole
{
    Contributor,
    Admin
}

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Contributor;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public List<Project> Projects { get; set; } = new();
    [JsonIgnore]
    public List<Star> Stars { get; set; } = new();
    [JsonIgnore]
    public List<Comment> Comments { get; set; } = new();
}

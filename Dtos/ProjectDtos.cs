using System.ComponentModel.DataAnnotations;

namespace Masadir.Dtos;

public class CreateProjectDto
{
    [Required, MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required, Url]
    public string RepoUrl { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Language { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string License { get; set; } = string.Empty;

    [MaxLength(300)]
    public string Tags { get; set; } = string.Empty;
}

public class UpdateProjectDto : CreateProjectDto { }

public class ProjectListItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RepoUrl { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string License { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int OwnerId { get; set; }
    public string OwnerName { get; set; } = string.Empty;
    public int StarCount { get; set; }
    public int CommentCount { get; set; }
    public bool IsStarredByMe { get; set; }
}

public class PagedResultDto<T>
{
    public List<T> Items { get; set; } = new();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
}

public class CreateCommentDto
{
    [Required, MaxLength(1000)]
    public string Body { get; set; } = string.Empty;
}

public class CommentDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

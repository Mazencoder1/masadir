using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Masadir.Data;
using Masadir.Dtos;
using Masadir.Models;

namespace Masadir.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectsController : ControllerBase
{
    private readonly MasadirContext _db;

    public ProjectsController(MasadirContext db)
    {
        _db = db;
    }

    private int? CurrentUserId()
    {
        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return idClaim == null ? null : int.Parse(idClaim);
    }

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<ProjectListItemDto>>> GetAll(
        [FromQuery] string? q,
        [FromQuery] string? language,
        [FromQuery] string? tag,
        [FromQuery] string? sort,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 9)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 50) pageSize = 9;

        var myId = CurrentUserId();

        var query = _db.Projects.AsNoTracking().Include(p => p.Owner).Where(p => !p.IsRemoved);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim();
            query = query.Where(p => p.Title.Contains(term) || p.Description.Contains(term) || p.Tags.Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(language))
        {
            query = query.Where(p => p.Language == language);
        }

        if (!string.IsNullOrWhiteSpace(tag))
        {
            query = query.Where(p => p.Tags.Contains(tag));
        }

        var projected = query.Select(p => new ProjectListItemDto
        {
            Id = p.Id,
            Title = p.Title,
            Description = p.Description,
            RepoUrl = p.RepoUrl,
            Language = p.Language,
            License = p.License,
            Tags = p.Tags,
            CreatedAt = p.CreatedAt,
            OwnerId = p.OwnerId,
            OwnerName = p.Owner!.FullName,
            StarCount = p.Stars.Count,
            CommentCount = p.Comments.Count(c => !c.IsRemoved),
            IsStarredByMe = myId != null && p.Stars.Any(s => s.UserId == myId)
        });

        projected = sort == "stars"
            ? projected.OrderByDescending(p => p.StarCount).ThenByDescending(p => p.CreatedAt)
            : projected.OrderByDescending(p => p.CreatedAt);

        var totalCount = await projected.CountAsync();
        var items = await projected.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(new PagedResultDto<ProjectListItemDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        });
    }

    [HttpGet("mine")]
    [Authorize]
    public async Task<ActionResult<List<ProjectListItemDto>>> GetMine()
    {
        var myId = CurrentUserId()!.Value;
        var items = await _db.Projects.AsNoTracking()
            .Include(p => p.Owner)
            .Where(p => p.OwnerId == myId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new ProjectListItemDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                RepoUrl = p.RepoUrl,
                Language = p.Language,
                License = p.License,
                Tags = p.Tags,
                CreatedAt = p.CreatedAt,
                OwnerId = p.OwnerId,
                OwnerName = p.Owner!.FullName,
                StarCount = p.Stars.Count,
                CommentCount = p.Comments.Count(c => !c.IsRemoved),
                IsStarredByMe = p.Stars.Any(s => s.UserId == myId),
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProjectListItemDto>> GetOne(int id)
    {
        var myId = CurrentUserId();
        var p = await _db.Projects.AsNoTracking().Include(p => p.Owner)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsRemoved);
        if (p == null) return NotFound(new { message = "المشروع غير موجود" });

        var dto = new ProjectListItemDto
        {
            Id = p.Id,
            Title = p.Title,
            Description = p.Description,
            RepoUrl = p.RepoUrl,
            Language = p.Language,
            License = p.License,
            Tags = p.Tags,
            CreatedAt = p.CreatedAt,
            OwnerId = p.OwnerId,
            OwnerName = p.Owner!.FullName,
            StarCount = await _db.Stars.CountAsync(s => s.ProjectId == p.Id),
            CommentCount = await _db.Comments.CountAsync(c => c.ProjectId == p.Id && !c.IsRemoved),
            IsStarredByMe = myId != null && await _db.Stars.AnyAsync(s => s.ProjectId == p.Id && s.UserId == myId)
        };

        return Ok(dto);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ProjectListItemDto>> Create(CreateProjectDto dto)
    {
        var myId = CurrentUserId()!.Value;
        var project = new Project
        {
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            RepoUrl = dto.RepoUrl.Trim(),
            Language = dto.Language.Trim(),
            License = dto.License.Trim(),
            Tags = dto.Tags.Trim(),
            OwnerId = myId
        };
        _db.Projects.Add(project);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOne), new { id = project.Id }, new ProjectListItemDto
        {
            Id = project.Id,
            Title = project.Title,
            Description = project.Description,
            RepoUrl = project.RepoUrl,
            Language = project.Language,
            License = project.License,
            Tags = project.Tags,
            CreatedAt = project.CreatedAt,
            OwnerId = project.OwnerId,
            OwnerName = User.FindFirstValue(ClaimTypes.Name) ?? "",
            StarCount = 0,
            CommentCount = 0,
            IsStarredByMe = false
        });
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, UpdateProjectDto dto)
    {
        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == id && !p.IsRemoved);
        if (project == null) return NotFound(new { message = "المشروع غير موجود" });

        var myId = CurrentUserId()!.Value;
        var isAdmin = User.IsInRole("Admin");
        if (project.OwnerId != myId && !isAdmin) return Forbid();

        project.Title = dto.Title.Trim();
        project.Description = dto.Description.Trim();
        project.RepoUrl = dto.RepoUrl.Trim();
        project.Language = dto.Language.Trim();
        project.License = dto.License.Trim();
        project.Tags = dto.Tags.Trim();

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == id && !p.IsRemoved);
        if (project == null) return NotFound(new { message = "المشروع غير موجود" });

        var myId = CurrentUserId()!.Value;
        var isAdmin = User.IsInRole("Admin");
        if (project.OwnerId != myId && !isAdmin) return Forbid();

        project.IsRemoved = true;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id:int}/star")]
    [Authorize]
    public async Task<ActionResult> ToggleStar(int id)
    {
        var myId = CurrentUserId()!.Value;
        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == id && !p.IsRemoved);
        if (project == null) return NotFound(new { message = "المشروع غير موجود" });

        var existing = await _db.Stars.FirstOrDefaultAsync(s => s.ProjectId == id && s.UserId == myId);
        bool starred;
        if (existing != null)
        {
            _db.Stars.Remove(existing);
            starred = false;
        }
        else
        {
            _db.Stars.Add(new Star { ProjectId = id, UserId = myId });
            starred = true;
        }
        await _db.SaveChangesAsync();

        var count = await _db.Stars.CountAsync(s => s.ProjectId == id);
        return Ok(new { starred, starCount = count });
    }

    [HttpGet("{id:int}/comments")]
    public async Task<ActionResult<List<CommentDto>>> GetComments(int id)
    {
        var comments = await _db.Comments.AsNoTracking()
            .Include(c => c.User)
            .Where(c => c.ProjectId == id && !c.IsRemoved)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                ProjectId = c.ProjectId,
                UserId = c.UserId,
                UserName = c.User!.FullName,
                Body = c.Body,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(comments);
    }

    [HttpPost("{id:int}/comments")]
    [Authorize]
    public async Task<ActionResult<CommentDto>> PostComment(int id, CreateCommentDto dto)
    {
        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == id && !p.IsRemoved);
        if (project == null) return NotFound(new { message = "المشروع غير موجود" });

        var myId = CurrentUserId()!.Value;
        var comment = new Comment
        {
            ProjectId = id,
            UserId = myId,
            Body = dto.Body.Trim()
        };
        _db.Comments.Add(comment);
        await _db.SaveChangesAsync();

        return Ok(new CommentDto
        {
            Id = comment.Id,
            ProjectId = comment.ProjectId,
            UserId = comment.UserId,
            UserName = User.FindFirstValue(ClaimTypes.Name) ?? "",
            Body = comment.Body,
            CreatedAt = comment.CreatedAt
        });
    }
}

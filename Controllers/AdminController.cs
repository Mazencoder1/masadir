using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Masadir.Data;

namespace Masadir.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly MasadirContext _db;

    public AdminController(MasadirContext db)
    {
        _db = db;
    }

    [HttpGet("projects")]
    public async Task<IActionResult> GetAllProjects()
    {
        var projects = await _db.Projects.AsNoTracking()
            .Include(p => p.Owner)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.IsRemoved,
                p.CreatedAt,
                OwnerName = p.Owner!.FullName,
                StarCount = p.Stars.Count,
                CommentCount = p.Comments.Count
            })
            .ToListAsync();

        return Ok(projects);
    }

    [HttpDelete("projects/{id:int}")]
    public async Task<IActionResult> RemoveProject(int id)
    {
        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == id);
        if (project == null) return NotFound(new { message = "المشروع غير موجود" });

        project.IsRemoved = true;
        await _db.SaveChangesAsync();
        return Ok(new { message = "تمت إزالة المشروع" });
    }

    [HttpPost("projects/{id:int}/restore")]
    public async Task<IActionResult> RestoreProject(int id)
    {
        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == id);
        if (project == null) return NotFound(new { message = "المشروع غير موجود" });

        project.IsRemoved = false;
        await _db.SaveChangesAsync();
        return Ok(new { message = "تم استرجاع المشروع" });
    }

    [HttpGet("comments")]
    public async Task<IActionResult> GetAllComments()
    {
        var comments = await _db.Comments.AsNoTracking()
            .Include(c => c.User)
            .Include(c => c.Project)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.Body,
                c.IsRemoved,
                c.CreatedAt,
                UserName = c.User!.FullName,
                ProjectTitle = c.Project!.Title,
                c.ProjectId
            })
            .ToListAsync();

        return Ok(comments);
    }

    [HttpDelete("comments/{id:int}")]
    public async Task<IActionResult> RemoveComment(int id)
    {
        var comment = await _db.Comments.FirstOrDefaultAsync(c => c.Id == id);
        if (comment == null) return NotFound(new { message = "التعليق غير موجود" });

        comment.IsRemoved = true;
        await _db.SaveChangesAsync();
        return Ok(new { message = "تمت إزالة التعليق" });
    }
}

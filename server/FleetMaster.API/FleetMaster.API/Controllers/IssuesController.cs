using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FleetMaster.API.Data;
using FleetMaster.API.Models;

namespace FleetMaster.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class IssuesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public IssuesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Issues (Dla Admina - pobiera wszystko z danymi pojazdu i kierowcy)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Issue>>> GetIssues()
    {
        return await _context.Issues
            .Include(i => i.Vehicle)
            .Include(i => i.Driver)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }

    // POST: api/Issues (Dla Kierowcy - zgłaszanie nowej usterki)
    [HttpPost]
    public async Task<ActionResult<Issue>> PostIssue(Issue issue)
    {
        issue.CreatedAt = DateTime.Now;
        issue.Status = "Zgłoszone";

        _context.Issues.Add(issue);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetIssues), new { id = issue.Id }, issue);
    }

    // PATCH: api/Issues/{id}/status (Dla Admina - szybka zmiana statusu)
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusUpdateDto dto)
    {
        var issue = await _context.Issues
            .Include(i => i.Vehicle)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (issue == null) return NotFound();

        var previousStatus = issue.Status;
        issue.Status = dto.Status;

        if (issue.Vehicle != null)
        {
            if (dto.Status.Equals("W naprawie", StringComparison.OrdinalIgnoreCase))
            {
                issue.Vehicle.IsOperational = false;
            }
            else if (previousStatus.Equals("W naprawie", StringComparison.OrdinalIgnoreCase))
            {
                issue.Vehicle.IsOperational = true;
            }
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public record StatusUpdateDto(string Status);
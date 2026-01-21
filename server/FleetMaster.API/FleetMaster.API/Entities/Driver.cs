using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace FleetMaster.API.Models;

public class Driver
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string LicenseNumber { get; set; }
    public required string Status { get; set; }

    public int? AssignedVehicleId { get; set; }
    [ForeignKey("AssignedVehicleId")]
    public Vehicle? AssignedVehicle { get; set; }

    public string? UserId { get; set; }

    [ForeignKey("UserId")]
    public IdentityUser? User { get; set; }
}
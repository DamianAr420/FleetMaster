namespace FleetMaster.API.Models;

public class Issue
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "Normalny";
    public string Status { get; set; } = "Zgłoszone";
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public int VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    public int? DriverId { get; set; }
    public Driver? Driver { get; set; }
}
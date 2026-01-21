namespace FleetMaster.API.Models;

public class Log
{
    public int Id { get; set; }
    public DateTime Date { get; set; } = DateTime.Now;
    public string RouteFrom { get; set; } = string.Empty;
    public string RouteTo { get; set; } = string.Empty;
    public double DistanceKm { get; set; }
    public TimeSpan Duration { get; set; }
    public int DriverId { get; set; }
    public Driver? Driver { get; set; }
    public int VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
}